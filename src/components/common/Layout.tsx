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
      <footer className="lg:ml-64 border-t border-border bg-surface-alt" role="contentinfo">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8 text-xs text-text-light space-y-1">
          <p className="font-semibold text-text">Impressum</p>
          <p>
            Diese GitHub Pages-Seite ist Teil einer schulischen Lernsituation im Bildungsgang
            Fachinformatiker/in &ndash; Anwendungsentwicklung am Schulzentrum Utbremen, Bremen.
          </p>
          <p>
            Verantwortlich im Sinne des &sect; 5 DDG ist das Schulzentrum Utbremen.
            Vollstaendiges Impressum:{' '}
            <a href="https://www.szut.de/impressum.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
              www.szut.de/impressum.html
            </a>
          </p>
          <p>Diese Seite dient ausschliesslich der schulischen Ausbildung und verfolgt keine kommerziellen Zwecke.</p>
        </div>
      </footer>
    </div>
  )
}
