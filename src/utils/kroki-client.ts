import { generateCacheKey, getKrokiUrl } from './plantuml-utils.ts'

const CACHE_PREFIX = 'kroki-cache-'
const BASE_PATH = import.meta.env.BASE_URL ?? '/uml_site_v3/'

function getCachedSvg(key: string): string | null {
  try {
    return sessionStorage.getItem(CACHE_PREFIX + key)
  } catch {
    return null
  }
}

function setCachedSvg(key: string, svg: string): void {
  try {
    sessionStorage.setItem(CACHE_PREFIX + key, svg)
  } catch {
    // SessionStorage full or unavailable — silently ignore
  }
}

async function fetchLocalSvg(cacheKey: string): Promise<string | null> {
  try {
    const url = `${BASE_PATH}uml/${cacheKey}.svg`
    const response = await fetch(url)
    if (response.ok) {
      const contentType = response.headers.get('content-type') ?? ''
      if (!contentType.includes('svg') && !contentType.includes('xml')) {
        return null
      }
      return await response.text()
    }
  } catch {
    // Local file not available — fall through
  }
  return null
}

export async function fetchUmlSvg(code: string): Promise<string> {
  const cacheKey = generateCacheKey(code)

  // 1. SessionStorage cache
  const cached = getCachedSvg(cacheKey)
  if (cached) {
    return cached
  }

  // 2. Pre-rendered local SVG file
  const localSvg = await fetchLocalSvg(cacheKey)
  if (localSvg) {
    setCachedSvg(cacheKey, localSvg)
    return localSvg
  }

  // 3. Kroki API fallback (for dynamic / user-generated diagrams)
  const url = getKrokiUrl(code)
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Kroki-API Fehler: ${response.status} ${response.statusText}`)
  }

  const svg = await response.text()
  setCachedSvg(cacheKey, svg)
  return svg
}
