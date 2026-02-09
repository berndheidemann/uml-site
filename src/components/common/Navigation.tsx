import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useProgressStore } from '../../store/progress-store.ts'
import type { DiagramType } from '../../types/index.ts'

interface NavItem {
  to: string
  label: string
  diagramType?: DiagramType
}

const navItems: NavItem[] = [
  { to: '/', label: 'Start' },
  { to: '/einfuehrung', label: 'Einführung' },
  { to: '/klassendiagramm', label: 'Klassendiagramm', diagramType: 'klassendiagramm' },
  { to: '/sequenzdiagramm', label: 'Sequenzdiagramm', diagramType: 'sequenzdiagramm' },
  { to: '/zustandsdiagramm', label: 'Zustandsdiagramm', diagramType: 'zustandsdiagramm' },
  { to: '/aktivitaetsdiagramm', label: 'Aktivitätsdiagramm', diagramType: 'aktivitaetsdiagramm' },
  { to: '/usecasediagramm', label: 'Use-Case-Diagramm', diagramType: 'usecasediagramm' },
]

function ChapterProgressIndicator({ diagramType }: { diagramType: DiagramType }) {
  const chapter = useProgressStore((s) => s.chapters[diagramType])
  if (!chapter) return null

  const exercises = Object.values(chapter.exercises)
  if (exercises.length === 0) return null

  const completed = exercises.filter((e) => e.completed).length
  const total = exercises.length
  const percentage = Math.round((completed / total) * 100)

  return (
    <span
      className="ml-auto text-xs text-text-light"
      aria-label={`${completed} von ${total} Übungen abgeschlossen`}
    >
      {percentage}%
    </span>
  )
}

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav aria-label="Hauptnavigation">
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-border"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-expanded={mobileOpen}
        aria-controls="main-nav"
        aria-label={mobileOpen ? 'Navigation schließen' : 'Navigation öffnen'}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="main-nav"
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-border z-40 transform transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-4 border-b border-border">
          <NavLink to="/" className="text-lg font-bold text-primary" onClick={() => setMobileOpen(false)}>
            UML Lernsituation
          </NavLink>
        </div>

        <ul className="p-2 space-y-1" role="list">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-text hover:bg-surface-dark'
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
                {item.diagramType && <ChapterProgressIndicator diagramType={item.diagramType} />}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </nav>
  )
}
