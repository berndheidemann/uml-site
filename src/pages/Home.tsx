import { Link } from 'react-router-dom'
import { ProgressOverview } from '../components/common/ProgressOverview.tsx'
import { useProgressStore } from '../store/progress-store.ts'
import type { DiagramType } from '../types/index.ts'

const chapters: { to: string; title: string; description: string; diagramType?: DiagramType }[] = [
  { to: '/einfuehrung', title: 'Einführung', description: 'Was ist UML? Überblick über die Diagrammtypen.' },
  { to: '/klassendiagramm', title: 'Klassendiagramm', description: 'Klassen, Attribute, Methoden, Beziehungen und Multiplizitäten.', diagramType: 'klassendiagramm' },
  { to: '/sequenzdiagramm', title: 'Sequenzdiagramm', description: 'Objekt-Interaktionen, Nachrichten und Lebenslinien.', diagramType: 'sequenzdiagramm' },
  { to: '/zustandsdiagramm', title: 'Zustandsdiagramm', description: 'Zustände, Übergänge und Guards.', diagramType: 'zustandsdiagramm' },
  { to: '/aktivitaetsdiagramm', title: 'Aktivitätsdiagramm', description: 'Ablaufmodellierung, Verzweigungen und Parallelität.', diagramType: 'aktivitaetsdiagramm' },
  { to: '/usecasediagramm', title: 'Use-Case-Diagramm', description: 'Akteure, Anwendungsfälle und Systemgrenzen.', diagramType: 'usecasediagramm' },
]

function ChapterCard({ to, title, description, diagramType }: typeof chapters[number]) {
  const chapterProgress = useProgressStore((s) => diagramType ? s.chapters[diagramType] : undefined)
  const completed = chapterProgress
    ? Object.values(chapterProgress.exercises).filter((e) => e.completed).length
    : 0
  const total = chapterProgress
    ? Object.values(chapterProgress.exercises).length
    : 0

  return (
    <Link
      to={to}
      className="block p-6 bg-white rounded-xl border border-border hover:border-primary hover:shadow-md transition-all group"
    >
      <h3 className="text-lg font-semibold text-text group-hover:text-primary mb-2">
        {title}
      </h3>
      <p className="text-sm text-text-light mb-3">
        {description}
      </p>
      {total > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-surface-dark rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                completed === total ? 'bg-success' : 'bg-primary'
              }`}
              style={{ width: `${Math.round((completed / total) * 100)}%` }}
            />
          </div>
          <span className="text-xs text-text-light">{completed}/{total}</span>
        </div>
      )}
    </Link>
  )
}

export default function Home() {
  return (
    <div>
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-text mb-4">
          UML Lernsituation
        </h1>
        <p className="text-lg text-text-light max-w-2xl mx-auto">
          Willkommen auf der interaktiven Lernplattform zum Thema UML-Diagramme.
          Lerne die wichtigsten Diagrammtypen kennen und wende dein Wissen in
          praxisnahen Übungen am Beispiel des <strong>TechStore Online-Shops</strong> an.
        </p>
      </section>

      <section aria-label="Kapitelübersicht" className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-6">Kapitel</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((chapter) => (
            <ChapterCard key={chapter.to} {...chapter} />
          ))}
        </div>
      </section>

      <section aria-label="Fortschritt und Badges">
        <h2 className="text-2xl font-bold text-text mb-6">Dein Fortschritt</h2>
        <ProgressOverview />
      </section>
    </div>
  )
}
