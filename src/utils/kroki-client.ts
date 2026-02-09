import { generateCacheKey, getKrokiUrl } from './plantuml-utils.ts'

const CACHE_PREFIX = 'kroki-cache-'

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

export async function fetchUmlSvg(code: string): Promise<string> {
  const cacheKey = generateCacheKey(code)

  // Check cache first
  const cached = getCachedSvg(cacheKey)
  if (cached) {
    return cached
  }

  const url = getKrokiUrl(code)
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Kroki-API Fehler: ${response.status} ${response.statusText}`)
  }

  const svg = await response.text()
  setCachedSvg(cacheKey, svg)
  return svg
}
