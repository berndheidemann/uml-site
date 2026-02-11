#!/usr/bin/env node

/**
 * Pre-render PlantUML diagrams to static SVG files.
 *
 * Scans src/data/**\/*.ts for @startuml...@enduml blocks, deduplicates them,
 * fetches SVGs from the Kroki API, and saves them to public/uml/{cacheKey}.svg.
 *
 * Usage:  node scripts/pre-render-uml.mjs
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const DATA_DIR = join(ROOT, 'src', 'data')
const OUT_DIR = join(ROOT, 'public', 'uml')

const CONCURRENCY = 5

// ── Strict-mode injection (mirrors src/utils/plantuml-utils.ts) ─────────────

const STRICT_MODE_PARAMS = `skinparam style strictuml
skinparam shadowing false
skinparam classAttributeIconSize 0`

function injectStrictMode(code) {
  const trimmed = code.trim()
  if (trimmed.includes('skinparam style strictuml')) {
    return trimmed
  }

  const startUmlMatch = trimmed.match(/^(@start\w+)(.*)$/m)
  if (startUmlMatch) {
    const startLine = startUmlMatch[0]
    const rest = trimmed.slice(startLine.length)
    return `${startLine}\n${STRICT_MODE_PARAMS}${rest}`
  }

  return `${STRICT_MODE_PARAMS}\n${trimmed}`
}

// ── Cache-key generation (mirrors src/utils/plantuml-utils.ts) ──────────────

function generateCacheKey(code) {
  const normalized = injectStrictMode(code)
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash | 0 // Convert to 32-bit integer
  }
  return `uml-svg-${Math.abs(hash).toString(36)}`
}

// ── PlantUML encoding (reimplemented to avoid ESM/CJS issues) ───────────────

function encodePlantUml(code) {
  // Use dynamic import for the plantuml-encoder package
  return import('plantuml-encoder').then(mod => {
    const encoder = mod.default ?? mod
    return encoder.encode(injectStrictMode(code))
  })
}

// ── File scanning ───────────────────────────────────────────────────────────

function walkDir(dir) {
  const results = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      results.push(...walkDir(full))
    } else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
      results.push(full)
    }
  }
  return results
}

function extractDiagrams(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const regex = /@startuml[\s\S]*?@enduml/g
  const matches = []
  let match
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[0])
  }
  return matches
}

// ── Parallel fetch with concurrency limit ───────────────────────────────────

async function fetchWithLimit(tasks, limit) {
  const results = []
  let index = 0

  async function worker() {
    while (index < tasks.length) {
      const i = index++
      results[i] = await tasks[i]()
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker())
  await Promise.all(workers)
  return results
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Scanning for PlantUML diagrams...')

  const files = walkDir(DATA_DIR)
  console.log(`  Found ${files.length} data files`)

  // Collect all diagram codes
  const allCodes = []
  for (const file of files) {
    const diagrams = extractDiagrams(file)
    allCodes.push(...diagrams)
  }
  console.log(`  Found ${allCodes.length} @startuml blocks total`)

  // Deduplicate by cache key
  const uniqueByKey = new Map()
  for (const code of allCodes) {
    const key = generateCacheKey(code)
    if (!uniqueByKey.has(key)) {
      uniqueByKey.set(key, code)
    }
  }
  console.log(`  ${uniqueByKey.size} unique diagrams after deduplication`)

  // Check which are already rendered
  let alreadyExists = 0
  let toFetch = []
  for (const [key, code] of uniqueByKey) {
    const svgPath = join(OUT_DIR, `${key}.svg`)
    if (existsSync(svgPath)) {
      alreadyExists++
    } else {
      toFetch.push({ key, code })
    }
  }
  console.log(`  ${alreadyExists} already rendered, ${toFetch.length} to fetch\n`)

  if (toFetch.length === 0) {
    console.log('Nothing to do — all diagrams are up to date.')
    return
  }

  // Fetch SVGs in parallel
  let fetched = 0
  let errors = 0

  const tasks = toFetch.map(({ key, code }) => async () => {
    try {
      const encoded = await encodePlantUml(code)
      const url = `https://kroki.io/plantuml/svg/${encoded}`
      const response = await fetch(url)

      if (!response.ok) {
        console.error(`  FAIL [${key}]: ${response.status} ${response.statusText}`)
        errors++
        return
      }

      const svg = await response.text()
      const svgPath = join(OUT_DIR, `${key}.svg`)
      writeFileSync(svgPath, svg, 'utf-8')
      fetched++
      process.stdout.write(`  Fetched ${fetched}/${toFetch.length}\r`)
    } catch (err) {
      console.error(`  FAIL [${key}]: ${err.message}`)
      errors++
    }
  })

  await fetchWithLimit(tasks, CONCURRENCY)

  console.log(`\nDone!`)
  console.log(`  Fetched: ${fetched}`)
  console.log(`  Errors:  ${errors}`)
  console.log(`  Total:   ${uniqueByKey.size} unique diagrams in public/uml/`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
