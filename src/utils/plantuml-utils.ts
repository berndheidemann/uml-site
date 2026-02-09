import plantumlEncoder from 'plantuml-encoder'

const STRICT_MODE_PARAMS = `skinparam style strictuml
skinparam shadowing false
skinparam classAttributeIconSize 0`

export function injectStrictMode(code: string): string {
  const trimmed = code.trim()
  // Check if strict mode params are already present
  if (trimmed.includes('skinparam style strictuml')) {
    return trimmed
  }

  // Insert after @startuml if present
  const startUmlMatch = trimmed.match(/^(@start\w+)(.*)$/m)
  if (startUmlMatch) {
    const startLine = startUmlMatch[0]
    const rest = trimmed.slice(startLine.length)
    return `${startLine}\n${STRICT_MODE_PARAMS}${rest}`
  }

  // Otherwise prepend
  return `${STRICT_MODE_PARAMS}\n${trimmed}`
}

export function encodePlantUml(code: string): string {
  return plantumlEncoder.encode(injectStrictMode(code))
}

export function generateCacheKey(code: string): string {
  const normalized = injectStrictMode(code)
  // Simple hash for cache key
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return `uml-svg-${Math.abs(hash).toString(36)}`
}

export function getKrokiUrl(code: string): string {
  const encoded = encodePlantUml(code)
  return `https://kroki.io/plantuml/svg/${encoded}`
}
