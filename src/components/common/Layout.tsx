import type { ReactNode } from 'react'
import { Navigation } from './Navigation.tsx'

interface Props {
  children: ReactNode
}

export function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-surface">
      <a href="#main-content" className="skip-link">
        Zum Hauptinhalt springen
      </a>
      <Navigation />
      <main id="main-content" className="lg:ml-64 min-h-screen" tabIndex={-1}>
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
