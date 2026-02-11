import { useState } from 'react'


interface Characteristic {
  label: string
  value: boolean | null // null = nicht zutreffend
}

interface CardData {
  id: string
  title: string
  description: string
  analogy: string
  techStoreExample: string
  characteristics: Characteristic[]
  notation: React.ReactNode
}

function AssociationNotation() {
  return (
    <svg width="180" height="50" viewBox="0 0 180 50" aria-label="Assoziations-Notation: Linie mit offenem Pfeil" role="img">
      <rect x="2" y="15" width="50" height="22" rx="4" fill="#f1f5f9" stroke="#1e293b" strokeWidth="1.5" />
      <text x="27" y="30" textAnchor="middle" fontSize="10" fill="#1e293b" fontWeight="bold">A</text>
      <line x1="52" y1="26" x2="126" y2="26" stroke="#1e293b" strokeWidth="2" />
      {/* Open arrow */}
      <polyline points="118,20 128,26 118,32" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="128" y="15" width="50" height="22" rx="4" fill="#f1f5f9" stroke="#1e293b" strokeWidth="1.5" />
      <text x="153" y="30" textAnchor="middle" fontSize="10" fill="#1e293b" fontWeight="bold">B</text>
    </svg>
  )
}

function AggregationNotation() {
  return (
    <svg width="180" height="50" viewBox="0 0 180 50" aria-label="Aggregations-Notation: Linie mit leerer Raute" role="img">
      <rect x="2" y="15" width="50" height="22" rx="4" fill="#f1f5f9" stroke="#1e293b" strokeWidth="1.5" />
      <text x="27" y="30" textAnchor="middle" fontSize="10" fill="#1e293b" fontWeight="bold">A</text>
      {/* Empty diamond at A side */}
      <polygon points="52,26 64,20 76,26 64,32" fill="white" stroke="#1e293b" strokeWidth="2" />
      <line x1="76" y1="26" x2="128" y2="26" stroke="#1e293b" strokeWidth="2" />
      <rect x="128" y="15" width="50" height="22" rx="4" fill="#f1f5f9" stroke="#1e293b" strokeWidth="1.5" />
      <text x="153" y="30" textAnchor="middle" fontSize="10" fill="#1e293b" fontWeight="bold">B</text>
    </svg>
  )
}

function CompositionNotation() {
  return (
    <svg width="180" height="50" viewBox="0 0 180 50" aria-label="Kompositions-Notation: Linie mit ausgefüllter Raute" role="img">
      <rect x="2" y="15" width="50" height="22" rx="4" fill="#f1f5f9" stroke="#1e293b" strokeWidth="1.5" />
      <text x="27" y="30" textAnchor="middle" fontSize="10" fill="#1e293b" fontWeight="bold">A</text>
      {/* Filled diamond at A side */}
      <polygon points="52,26 64,20 76,26 64,32" fill="#1e293b" stroke="#1e293b" strokeWidth="2" />
      <line x1="76" y1="26" x2="128" y2="26" stroke="#1e293b" strokeWidth="2" />
      <rect x="128" y="15" width="50" height="22" rx="4" fill="#f1f5f9" stroke="#1e293b" strokeWidth="1.5" />
      <text x="153" y="30" textAnchor="middle" fontSize="10" fill="#1e293b" fontWeight="bold">B</text>
    </svg>
  )
}

function InheritanceNotation() {
  return (
    <svg width="180" height="50" viewBox="0 0 180 50" aria-label="Vererbungs-Notation: Linie mit leerem Dreieck" role="img">
      <rect x="2" y="15" width="50" height="22" rx="4" fill="#f1f5f9" stroke="#1e293b" strokeWidth="1.5" />
      <text x="27" y="30" textAnchor="middle" fontSize="10" fill="#1e293b" fontWeight="bold">B</text>
      <line x1="52" y1="26" x2="116" y2="26" stroke="#1e293b" strokeWidth="2" />
      {/* Hollow triangle at A (parent) side */}
      <polygon points="128,26 116,18 116,34" fill="white" stroke="#1e293b" strokeWidth="2" />
      <rect x="128" y="15" width="50" height="22" rx="4" fill="#f1f5f9" stroke="#1e293b" strokeWidth="1.5" />
      <text x="153" y="30" textAnchor="middle" fontSize="10" fill="#1e293b" fontWeight="bold">A</text>
    </svg>
  )
}

const cards: CardData[] = [
  {
    id: 'assoziation',
    title: 'Assoziation',
    description:
      'Eine allgemeine Beziehung zwischen zwei Klassen. Beide Objekte existieren unabhängig voneinander und kennen sich nur.',
    analogy: 'Eine Person kennt eine Adresse \u2014 beide existieren unabhängig voneinander.',
    techStoreExample: 'Ein Kunde tätigt eine Bestellung. Der Kunde existiert auch ohne Bestellung, und die Bestellung bleibt als Datensatz erhalten.',
    characteristics: [
      { label: 'Existenzabhängigkeit', value: false },
      { label: 'Exklusive Zugehörigkeit', value: false },
      { label: 'Herausgabe möglich', value: true },
    ],
    notation: <AssociationNotation />,
  },
  {
    id: 'aggregation',
    title: 'Aggregation',
    description:
      'Eine \"Teil-von\"-Beziehung, bei der die Teile auch ohne das Ganze existieren können. Das Ganze ist ein Behälter.',
    analogy: 'Eine Universität hat Professoren \u2014 verlässt ein Professor die Uni, existiert er trotzdem weiter.',
    techStoreExample: 'Ein Warenkorb enthält Produkte. Wird der Warenkorb geleert, existieren die Produkte weiterhin im Sortiment.',
    characteristics: [
      { label: 'Existenzabhängigkeit', value: false },
      { label: 'Exklusive Zugehörigkeit', value: false },
      { label: 'Herausgabe möglich', value: true },
    ],
    notation: <AggregationNotation />,
  },
  {
    id: 'komposition',
    title: 'Komposition',
    description:
      'Eine starke \"Teil-von\"-Beziehung mit Existenzabhängigkeit. Die Teile können nicht ohne das Ganze existieren und gehören exklusiv dazu.',
    analogy: 'Ein Haus hat Zimmer \u2014 wird das Haus abgerissen, gibt es die Zimmer nicht mehr.',
    techStoreExample: 'Eine Bestellung enthält Bestellpositionen. Wird die Bestellung storniert/gelöscht, verschwinden auch alle zugehörigen Positionen.',
    characteristics: [
      { label: 'Existenzabhängigkeit', value: true },
      { label: 'Exklusive Zugehörigkeit', value: true },
      { label: 'Herausgabe möglich', value: false },
    ],
    notation: <CompositionNotation />,
  },
  {
    id: 'vererbung',
    title: 'Vererbung',
    description:
      'Eine \"ist-ein\"-Beziehung (Generalisierung/Spezialisierung). Die Unterklasse erbt Attribute und Methoden der Oberklasse und kann diese erweitern.',
    analogy: 'Ein Säugetier ist ein Tier \u2014 es erbt alle Eigenschaften eines Tiers und fügt eigene hinzu.',
    techStoreExample: 'Ein Lagerarbeiter ist ein Mitarbeiter. Er erbt Name und Personalnummer und hat zusätzlich ein zugewiesenes Lager.',
    characteristics: [
      { label: 'Existenzabhängigkeit', value: null },
      { label: 'Exklusive Zugehörigkeit', value: null },
      { label: 'Herausgabe möglich', value: null },
    ],
    notation: <InheritanceNotation />,
  },
]

function CharacteristicIcon({ value }: { value: boolean | null }) {
  if (value === null) {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-400" aria-label="nicht zutreffend">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </span>
    )
  }
  if (value) {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600" aria-label="ja">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    )
  }
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-500" aria-label="nein">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </span>
  )
}

const cardColors: Record<string, { border: string; bg: string; headerBg: string; headerText: string }> = {
  assoziation: {
    border: 'border-blue-300',
    bg: 'bg-blue-50',
    headerBg: 'bg-blue-600',
    headerText: 'text-white',
  },
  aggregation: {
    border: 'border-amber-300',
    bg: 'bg-amber-50',
    headerBg: 'bg-amber-500',
    headerText: 'text-white',
  },
  komposition: {
    border: 'border-red-300',
    bg: 'bg-red-50',
    headerBg: 'bg-red-600',
    headerText: 'text-white',
  },
  vererbung: {
    border: 'border-purple-300',
    bg: 'bg-purple-50',
    headerBg: 'bg-purple-600',
    headerText: 'text-white',
  },
}

export function RelationshipComparisonCards() {
  const [allFlipped, setAllFlipped] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-text mb-2">
          Beziehungstypen im Vergleich
        </h3>
        <p className="text-text-light text-sm">
          Klicke auf eine Karte, um sie umzudrehen und Details zu sehen.
          Jede Karte zeigt die UML-Notation, eine Alltagsanalogie und ein TechStore-Beispiel.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setAllFlipped(!allFlipped)}
          className="text-sm text-primary hover:text-primary-dark font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
        >
          {allFlipped ? 'Alle Vorderseiten zeigen' : 'Alle Rückseiten zeigen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <FlipCardControlled key={card.id} card={card} forceFlipped={allFlipped} />
        ))}
      </div>

      {/* Comparison table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="bg-surface-dark">
              <th className="text-left px-3 py-2 font-semibold text-text" scope="col">Eigenschaft</th>
              {cards.map((c) => (
                <th key={c.id} className="text-center px-3 py-2 font-semibold text-text" scope="col">{c.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {['Existenzabhängigkeit', 'Exklusive Zugehörigkeit', 'Herausgabe möglich'].map((label) => (
              <tr key={label} className="border-t border-border">
                <td className="px-3 py-2 text-text font-medium">{label}</td>
                {cards.map((card) => {
                  const ch = card.characteristics.find((c) => c.label === label)!
                  return (
                    <td key={card.id} className="text-center px-3 py-2">
                      <span className="inline-flex justify-center">
                        <CharacteristicIcon value={ch.value} />
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FlipCardControlled({ card, forceFlipped }: { card: CardData; forceFlipped: boolean }) {
  const [localFlip, setLocalFlip] = useState(false)
  const [prevForce, setPrevForce] = useState(forceFlipped)

  if (forceFlipped !== prevForce) {
    setPrevForce(forceFlipped)
    setLocalFlip(forceFlipped)
  }

  const colors = cardColors[card.id]
  const flipped = localFlip

  return (
    <div
      className={`rounded-xl border-2 ${colors.border} overflow-hidden cursor-pointer transition-shadow hover:shadow-md`}
      onClick={() => setLocalFlip(!localFlip)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setLocalFlip(!localFlip)
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${card.title} \u2014 ${flipped ? 'Rückseite, klicke zum Umdrehen' : 'Vorderseite, klicke zum Umdrehen'}`}
    >
      <div className={`${colors.headerBg} ${colors.headerText} px-4 py-3 flex items-center justify-between`}>
        <h4 className="text-lg font-bold">{card.title}</h4>
        <span className="text-xs opacity-80">{flipped ? 'Rückseite' : 'Vorderseite'}</span>
      </div>

      {!flipped ? (
        <div className={`${colors.bg} p-4 flex flex-col items-center justify-center`} style={{ minHeight: '200px' }}>
          <div className="mb-4">{card.notation}</div>
          <p className="text-sm text-text-light text-center max-w-[220px] mb-4">
            {card.id === 'assoziation' && 'Einfache Linie mit offenem Pfeil'}
            {card.id === 'aggregation' && 'Linie mit leerer Raute (am Ganzen)'}
            {card.id === 'komposition' && 'Linie mit ausgefüllter Raute (am Ganzen)'}
            {card.id === 'vererbung' && 'Linie mit leerem Dreieck (an der Oberklasse)'}
          </p>
          <div className="flex items-center gap-1 text-xs text-text-light/70 mt-auto">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Klicke zum Umdrehen</span>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 space-y-3">
          <p className="text-sm text-text leading-relaxed">{card.description}</p>

          <div className="rounded-lg bg-surface p-3">
            <p className="text-xs font-semibold text-text-light uppercase tracking-wide mb-1">Alltagsanalogie</p>
            <p className="text-sm text-text">{card.analogy}</p>
          </div>

          <div className="rounded-lg bg-surface p-3">
            <p className="text-xs font-semibold text-text-light uppercase tracking-wide mb-1">TechStore-Beispiel</p>
            <p className="text-sm text-text">{card.techStoreExample}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-text-light uppercase tracking-wide mb-2">Eigenschaften</p>
            <div className="space-y-1.5">
              {card.characteristics.map((ch) => (
                <div key={ch.label} className="flex items-center gap-2">
                  <CharacteristicIcon value={ch.value} />
                  <span className="text-sm text-text">{ch.label}</span>
                  {ch.value === null && (
                    <span className="text-xs text-text-light italic">(anderes Konzept)</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-text-light/70 pt-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Klicke zum Umdrehen</span>
          </div>
        </div>
      )}
    </div>
  )
}
