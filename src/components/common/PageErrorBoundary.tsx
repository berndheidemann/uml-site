import type { ReactNode } from 'react'
import { ErrorBoundary } from './ErrorBoundary.tsx'

interface Props {
  children: ReactNode
  pageName?: string
}

export function PageErrorBoundary({ children, pageName }: Props) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center p-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center" role="alert">
            <div className="text-4xl mb-4 text-red-600 font-bold" aria-hidden="true">!</div>
            <h2 className="text-xl font-bold text-red-800 mb-2">
              Seite konnte nicht geladen werden
            </h2>
            <p className="text-red-600 mb-4">
              {pageName
                ? `Beim Laden von „${pageName}" ist ein Fehler aufgetreten.`
                : 'Beim Laden dieser Seite ist ein Fehler aufgetreten.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Seite neu laden
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
