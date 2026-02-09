import { useState, useEffect, useCallback } from 'react'
import { fetchUmlSvg } from '../../utils/kroki-client.ts'
import { ErrorBoundary } from './ErrorBoundary.tsx'

interface Props {
  code: string
  alt: string
  className?: string
  onLoad?: () => void
  onError?: (error: Error) => void
}

type LoadState = 'loading' | 'loaded' | 'error'

function UmlDiagramInner({ code, alt, className, onLoad, onError }: Props) {
  const [svg, setSvg] = useState<string | null>(null)
  const [state, setState] = useState<LoadState>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  const loadDiagram = useCallback(async () => {
    setState('loading')
    setErrorMsg('')
    try {
      const result = await fetchUmlSvg(code)
      setSvg(result)
      setState('loaded')
      onLoad?.()
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unbekannter Fehler')
      setState('error')
      setErrorMsg(error.message)
      onError?.(error)
    }
  }, [code, onLoad, onError])

  useEffect(() => {
    loadDiagram()
  }, [loadDiagram])

  if (state === 'loading') {
    return (
      <div className={`animate-pulse bg-surface-dark rounded-lg p-8 ${className ?? ''}`} role="status" aria-label="Diagramm wird geladen">
        <div className="h-48 bg-border rounded" />
        <span className="sr-only">Diagramm wird geladen...</span>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 text-center ${className ?? ''}`} role="alert">
        <p className="text-red-600 mb-3">Diagramm konnte nicht geladen werden: {errorMsg}</p>
        <button
          onClick={loadDiagram}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Erneut versuchen
        </button>
      </div>
    )
  }

  return (
    <figure className={className} aria-label={alt}>
      <div
        className="overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: svg ?? '' }}
      />
      <details className="mt-2">
        <summary className="text-sm text-text-light cursor-pointer hover:text-text">
          PlantUML-Quellcode anzeigen
        </summary>
        <pre className="mt-2 p-3 bg-surface-dark rounded-lg text-xs overflow-x-auto">
          <code>{code}</code>
        </pre>
      </details>
    </figure>
  )
}

export function UmlDiagram(props: Props) {
  return (
    <ErrorBoundary>
      <UmlDiagramInner {...props} />
    </ErrorBoundary>
  )
}
