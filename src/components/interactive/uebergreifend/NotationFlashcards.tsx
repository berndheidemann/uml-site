import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ───────────────────────────────────────────────────────────────────

type DiagramCategory =
  | 'Klassendiagramm'
  | 'Sequenzdiagramm'
  | 'Zustandsdiagramm'
  | 'Aktivitätsdiagramm'
  | 'Use-Case-Diagramm'

interface Flashcard {
  id: number
  category: DiagramCategory
  title: string
  description: string
  example: string
  svgFront: React.ReactNode
}

type Phase = 'learning' | 'summary'

// ─── Badge colors per category ───────────────────────────────────────────────

const CATEGORY_STYLES: Record<DiagramCategory, string> = {
  'Klassendiagramm': 'bg-blue-100 text-blue-800 border-blue-300',
  'Sequenzdiagramm': 'bg-purple-100 text-purple-800 border-purple-300',
  'Zustandsdiagramm': 'bg-amber-100 text-amber-800 border-amber-300',
  'Aktivitätsdiagramm': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'Use-Case-Diagramm': 'bg-rose-100 text-rose-800 border-rose-300',
}

// ─── SVG Notation Drawings ───────────────────────────────────────────────────

function SvgAssoziation() {
  return (
    <svg viewBox="0 0 200 60" className="w-full h-full" aria-hidden="true">
      <line x1={30} y1={30} x2={170} y2={30} stroke="#1e293b" strokeWidth={2} />
      <polyline points="160,25 170,30 160,35" fill="none" stroke="#1e293b" strokeWidth={2} />
      <rect x={10} y={18} width={20} height={24} rx={3} fill="#dbeafe" stroke="#3b82f6" strokeWidth={1.5} />
      <rect x={170} y={18} width={20} height={24} rx={3} fill="#dbeafe" stroke="#3b82f6" strokeWidth={1.5} />
    </svg>
  )
}

function SvgAggregation() {
  return (
    <svg viewBox="0 0 200 60" className="w-full h-full" aria-hidden="true">
      <line x1={50} y1={30} x2={170} y2={30} stroke="#1e293b" strokeWidth={2} />
      <polygon points="30,30 45,22 60,30 45,38" fill="white" stroke="#1e293b" strokeWidth={2} />
      <rect x={10} y={18} width={20} height={24} rx={3} fill="#dbeafe" stroke="#3b82f6" strokeWidth={1.5} />
      <rect x={170} y={18} width={20} height={24} rx={3} fill="#dbeafe" stroke="#3b82f6" strokeWidth={1.5} />
    </svg>
  )
}

function SvgKomposition() {
  return (
    <svg viewBox="0 0 200 60" className="w-full h-full" aria-hidden="true">
      <line x1={50} y1={30} x2={170} y2={30} stroke="#1e293b" strokeWidth={2} />
      <polygon points="30,30 45,22 60,30 45,38" fill="#1e293b" stroke="#1e293b" strokeWidth={2} />
      <rect x={10} y={18} width={20} height={24} rx={3} fill="#dbeafe" stroke="#3b82f6" strokeWidth={1.5} />
      <rect x={170} y={18} width={20} height={24} rx={3} fill="#dbeafe" stroke="#3b82f6" strokeWidth={1.5} />
    </svg>
  )
}

function SvgVererbung() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-full" aria-hidden="true">
      <line x1={100} y1={55} x2={100} y2={30} stroke="#1e293b" strokeWidth={2} />
      <polygon points="100,15 90,30 110,30" fill="white" stroke="#1e293b" strokeWidth={2} />
      <rect x={75} y={55} width={50} height={20} rx={3} fill="#dbeafe" stroke="#3b82f6" strokeWidth={1.5} />
      <rect x={75} y={5} width={50} height={20} rx={3} fill="#dbeafe" stroke="#3b82f6" strokeWidth={1.5} />
      <text x={100} y={18} textAnchor="middle" fontSize={9} fill="#1e293b">Eltern</text>
      <text x={100} y={68} textAnchor="middle" fontSize={9} fill="#1e293b">Kind</text>
    </svg>
  )
}

function SvgSichtbarkeit() {
  return (
    <svg viewBox="0 0 200 100" className="w-full h-full" aria-hidden="true">
      <rect x={40} y={5} width={120} height={90} rx={4} fill="white" stroke="#1e293b" strokeWidth={2} />
      <rect x={40} y={5} width={120} height={22} rx={4} fill="#f1f5f9" stroke="#1e293b" strokeWidth={2} />
      <rect x={41} y={20} width={118} height={8} fill="#f1f5f9" />
      <line x1={40} y1={27} x2={160} y2={27} stroke="#1e293b" strokeWidth={1.5} />
      <text x={100} y={20} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#1e293b">Klasse</text>
      <text x={52} y={42} fontSize={10} fontFamily="monospace" fill="#16a34a" fontWeight="bold">+</text>
      <text x={62} y={42} fontSize={9} fontFamily="monospace" fill="#475569">public</text>
      <text x={52} y={56} fontSize={10} fontFamily="monospace" fill="#dc2626" fontWeight="bold">-</text>
      <text x={62} y={56} fontSize={9} fontFamily="monospace" fill="#475569">private</text>
      <text x={52} y={70} fontSize={10} fontFamily="monospace" fill="#d97706" fontWeight="bold">#</text>
      <text x={62} y={70} fontSize={9} fontFamily="monospace" fill="#475569">protected</text>
      <text x={52} y={84} fontSize={10} fontFamily="monospace" fill="#7c3aed" fontWeight="bold">~</text>
      <text x={62} y={84} fontSize={9} fontFamily="monospace" fill="#475569">package</text>
    </svg>
  )
}

function SvgSynchroneNachricht() {
  return (
    <svg viewBox="0 0 200 60" className="w-full h-full" aria-hidden="true">
      <line x1={30} y1={10} x2={30} y2={50} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={170} y1={10} x2={170} y2={50} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={30} y1={30} x2={170} y2={30} stroke="#1e293b" strokeWidth={2} />
      <polygon points="170,30 160,24 160,36" fill="#1e293b" />
      <text x={100} y={23} textAnchor="middle" fontSize={10} fill="#1e293b">nachricht()</text>
    </svg>
  )
}

function SvgAsynchroneNachricht() {
  return (
    <svg viewBox="0 0 200 60" className="w-full h-full" aria-hidden="true">
      <line x1={30} y1={10} x2={30} y2={50} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={170} y1={10} x2={170} y2={50} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={30} y1={30} x2={170} y2={30} stroke="#1e293b" strokeWidth={2} />
      <polyline points="160,24 170,30 160,36" fill="none" stroke="#1e293b" strokeWidth={2} />
      <text x={100} y={23} textAnchor="middle" fontSize={10} fill="#1e293b">nachricht()</text>
    </svg>
  )
}

function SvgRueckantwort() {
  return (
    <svg viewBox="0 0 200 60" className="w-full h-full" aria-hidden="true">
      <line x1={30} y1={10} x2={30} y2={50} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={170} y1={10} x2={170} y2={50} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={170} y1={30} x2={30} y2={30} stroke="#64748b" strokeWidth={1.5} strokeDasharray="6 3" />
      <polyline points="40,25 30,30 40,35" fill="none" stroke="#64748b" strokeWidth={1.5} />
      <text x={100} y={23} textAnchor="middle" fontSize={10} fill="#64748b" fontStyle="italic">ergebnis</text>
    </svg>
  )
}

function SvgSelbstaufruf() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-full" aria-hidden="true">
      <line x1={80} y1={5} x2={80} y2={75} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
      <rect x={75} y={20} width={10} height={40} fill="#dbeafe" stroke="#3b82f6" strokeWidth={1} />
      <path d="M 85 30 L 120 30 L 120 50 L 85 50" fill="none" stroke="#1e293b" strokeWidth={2} />
      <polygon points="85,50 93,46 93,54" fill="#1e293b" />
      <text x={125} y={43} fontSize={10} fill="#1e293b">intern()</text>
    </svg>
  )
}

function SvgAnfangszustand() {
  return (
    <svg viewBox="0 0 200 60" className="w-full h-full" aria-hidden="true">
      <circle cx={60} cy={30} r={12} fill="#1e293b" />
      <line x1={72} y1={30} x2={140} y2={30} stroke="#1e293b" strokeWidth={2} />
      <polygon points="140,30 132,25 132,35" fill="#1e293b" />
      <rect x={140} y={18} width={50} height={24} rx={12} fill="#fef3c7" stroke="#1e293b" strokeWidth={1.5} />
      <text x={165} y={34} textAnchor="middle" fontSize={9} fill="#1e293b">Zustand</text>
    </svg>
  )
}

function SvgEndzustand() {
  return (
    <svg viewBox="0 0 200 60" className="w-full h-full" aria-hidden="true">
      <rect x={20} y={18} width={50} height={24} rx={12} fill="#fef3c7" stroke="#1e293b" strokeWidth={1.5} />
      <text x={45} y={34} textAnchor="middle" fontSize={9} fill="#1e293b">Zustand</text>
      <line x1={70} y1={30} x2={120} y2={30} stroke="#1e293b" strokeWidth={2} />
      <polygon points="120,30 112,25 112,35" fill="#1e293b" />
      <circle cx={140} cy={30} r={14} fill="none" stroke="#1e293b" strokeWidth={2} />
      <circle cx={140} cy={30} r={9} fill="#1e293b" />
    </svg>
  )
}

function SvgGuard() {
  return (
    <svg viewBox="0 0 220 60" className="w-full h-full" aria-hidden="true">
      <rect x={10} y={18} width={55} height={24} rx={12} fill="#fef3c7" stroke="#1e293b" strokeWidth={1.5} />
      <text x={37} y={34} textAnchor="middle" fontSize={9} fill="#1e293b">Zustand</text>
      <line x1={65} y1={30} x2={155} y2={30} stroke="#1e293b" strokeWidth={2} />
      <polygon points="155,30 147,25 147,35" fill="#1e293b" />
      <rect x={155} y={18} width={55} height={24} rx={12} fill="#fef3c7" stroke="#1e293b" strokeWidth={1.5} />
      <text x={182} y={34} textAnchor="middle" fontSize={9} fill="#1e293b">Zustand</text>
      <rect x={80} y={10} width={65} height={18} rx={3} fill="white" stroke="#1e293b" strokeWidth={1} />
      <text x={112} y={22} textAnchor="middle" fontSize={9} fill="#1e293b" fontWeight="bold">[bezahlt]</text>
    </svg>
  )
}

function SvgEntscheidungsknoten() {
  return (
    <svg viewBox="0 0 200 100" className="w-full h-full" aria-hidden="true">
      <line x1={30} y1={50} x2={75} y2={50} stroke="#1e293b" strokeWidth={2} />
      <polygon points="75,50 69,46 69,54" fill="#1e293b" />
      <polygon points="100,25 125,50 100,75 75,50" fill="white" stroke="#1e293b" strokeWidth={2} />
      <line x1={125} y1={50} x2={180} y2={50} stroke="#1e293b" strokeWidth={2} />
      <polygon points="180,50 174,46 174,54" fill="#1e293b" />
      <line x1={100} y1={75} x2={100} y2={95} stroke="#1e293b" strokeWidth={2} />
      <polygon points="100,95 96,89 104,89" fill="#1e293b" />
      <text x={152} y={43} textAnchor="middle" fontSize={8} fill="#0369a1" fontWeight="bold">[ja]</text>
      <text x={110} y={92} fontSize={8} fill="#0369a1" fontWeight="bold">[nein]</text>
      <text x={100} y={53} textAnchor="middle" fontSize={8} fill="#94a3b8" fontStyle="italic">leer!</text>
    </svg>
  )
}

function SvgForkJoin() {
  return (
    <svg viewBox="0 0 200 90" className="w-full h-full" aria-hidden="true">
      {/* Incoming */}
      <line x1={100} y1={5} x2={100} y2={20} stroke="#1e293b" strokeWidth={2} />
      <polygon points="100,20 96,14 104,14" fill="#1e293b" />
      {/* Fork bar */}
      <rect x={40} y={22} width={120} height={6} rx={2} fill="#1e293b" />
      {/* Two outgoing */}
      <line x1={70} y1={28} x2={70} y2={55} stroke="#1e293b" strokeWidth={2} />
      <polygon points="70,55 66,49 74,49" fill="#1e293b" />
      <line x1={130} y1={28} x2={130} y2={55} stroke="#1e293b" strokeWidth={2} />
      <polygon points="130,55 126,49 134,49" fill="#1e293b" />
      {/* Actions */}
      <rect x={40} y={55} width={60} height={18} rx={9} fill="#dcfce7" stroke="#1e293b" strokeWidth={1} />
      <text x={70} y={67} textAnchor="middle" fontSize={8} fill="#1e293b">Aktion A</text>
      <rect x={100} y={55} width={60} height={18} rx={9} fill="#dcfce7" stroke="#1e293b" strokeWidth={1} />
      <text x={130} y={67} textAnchor="middle" fontSize={8} fill="#1e293b">Aktion B</text>
      {/* Join bar */}
      <line x1={70} y1={73} x2={70} y2={80} stroke="#1e293b" strokeWidth={2} />
      <line x1={130} y1={73} x2={130} y2={80} stroke="#1e293b" strokeWidth={2} />
      <rect x={40} y={80} width={120} height={6} rx={2} fill="#1e293b" />
    </svg>
  )
}

function SvgInclude() {
  return (
    <svg viewBox="0 0 220 70" className="w-full h-full" aria-hidden="true">
      <ellipse cx={65} cy={35} rx={55} ry={22} fill="#fff1f2" stroke="#1e293b" strokeWidth={1.5} />
      <text x={65} y={38} textAnchor="middle" fontSize={9} fill="#1e293b">Basis-UC</text>
      <ellipse cx={185} cy={35} rx={35} ry={22} fill="#fef3c7" stroke="#1e293b" strokeWidth={1.5} />
      <text x={185} y={38} textAnchor="middle" fontSize={9} fill="#1e293b">Inkl.-UC</text>
      <line x1={120} y1={35} x2={150} y2={35} stroke="#1e293b" strokeWidth={1.5} strokeDasharray="5 3" />
      <polygon points="150,35 143,31 143,39" fill="#1e293b" />
      <text x={135} y={25} textAnchor="middle" fontSize={8} fill="#64748b" fontStyle="italic">&laquo;include&raquo;</text>
    </svg>
  )
}

function SvgExtend() {
  return (
    <svg viewBox="0 0 220 70" className="w-full h-full" aria-hidden="true">
      <ellipse cx={65} cy={35} rx={55} ry={22} fill="#fff1f2" stroke="#1e293b" strokeWidth={1.5} />
      <text x={65} y={38} textAnchor="middle" fontSize={9} fill="#1e293b">Basis-UC</text>
      <ellipse cx={185} cy={35} rx={35} ry={22} fill="#f0fdf4" stroke="#1e293b" strokeWidth={1.5} />
      <text x={185} y={38} textAnchor="middle" fontSize={9} fill="#1e293b">Erw.-UC</text>
      <line x1={150} y1={35} x2={120} y2={35} stroke="#1e293b" strokeWidth={1.5} strokeDasharray="5 3" />
      <polygon points="120,35 127,31 127,39" fill="#1e293b" />
      <text x={135} y={25} textAnchor="middle" fontSize={8} fill="#64748b" fontStyle="italic">&laquo;extend&raquo;</text>
    </svg>
  )
}

// ─── Card Data ───────────────────────────────────────────────────────────────

const ALL_CARDS: Flashcard[] = [
  {
    id: 1,
    category: 'Klassendiagramm',
    title: 'Assoziation',
    description: 'Allgemeine Beziehung zwischen Klassen. Durchgezogene Linie mit offenem Pfeil.',
    example: 'Kunde und Bestellung sind assoziiert: Ein Kunde kann mehrere Bestellungen aufgeben.',
    svgFront: <SvgAssoziation />,
  },
  {
    id: 2,
    category: 'Klassendiagramm',
    title: 'Aggregation',
    description: 'Teil-Ganzes-Beziehung. Das Teil kann ohne das Ganze existieren. Leere Raute am Ganzen.',
    example: 'Warenkorb und Produkt: Ein Produkt existiert auch ohne Warenkorb.',
    svgFront: <SvgAggregation />,
  },
  {
    id: 3,
    category: 'Klassendiagramm',
    title: 'Komposition',
    description: 'Starke Teil-Ganzes-Beziehung. Das Teil kann NICHT ohne das Ganze existieren. Ausgefuellte Raute am Ganzen.',
    example: 'Bestellung und Bestellposition: Ohne Bestellung keine Bestellposition.',
    svgFront: <SvgKomposition />,
  },
  {
    id: 4,
    category: 'Klassendiagramm',
    title: 'Vererbung (Generalisierung)',
    description: 'Generalisierung/Spezialisierung. Hohles Dreieck zeigt zur Elternklasse.',
    example: 'Premiumkunde erbt von Kunde: Gleiche Attribute, zusaetzlich Rabattstufe.',
    svgFront: <SvgVererbung />,
  },
  {
    id: 5,
    category: 'Klassendiagramm',
    title: 'Sichtbarkeitsmodifikatoren',
    description: '+ public, - private, # protected, ~ package. Stehen vor Attributen und Methoden.',
    example: '- email: String (privat), + bestellen(): void (oeffentlich)',
    svgFront: <SvgSichtbarkeit />,
  },
  {
    id: 6,
    category: 'Sequenzdiagramm',
    title: 'Synchrone Nachricht',
    description: 'Durchgezogene Linie mit ausgefuelltem Pfeil. Der Sender wartet auf eine Antwort.',
    example: 'Kunde ruft bestellen() auf dem WebShop auf und wartet auf Bestaetigung.',
    svgFront: <SvgSynchroneNachricht />,
  },
  {
    id: 7,
    category: 'Sequenzdiagramm',
    title: 'Asynchrone Nachricht',
    description: 'Durchgezogene Linie mit offenem Pfeil. Der Sender arbeitet weiter, ohne auf Antwort zu warten.',
    example: 'WebShop sendet Bestellbestaetigung per E-Mail asynchron an den Kunden.',
    svgFront: <SvgAsynchroneNachricht />,
  },
  {
    id: 8,
    category: 'Sequenzdiagramm',
    title: 'Rueckantwort',
    description: 'Gestrichelte Linie mit offenem Pfeil. Antwort auf eine synchrone Nachricht.',
    example: 'Lager antwortet dem WebShop: Produkt ist verfuegbar.',
    svgFront: <SvgRueckantwort />,
  },
  {
    id: 9,
    category: 'Sequenzdiagramm',
    title: 'Selbstaufruf',
    description: 'Pfeil, der vom Objekt zu sich selbst zeigt. Das Objekt ruft eine eigene Methode auf.',
    example: 'Bestellung ruft berechneGesamtpreis() auf sich selbst auf.',
    svgFront: <SvgSelbstaufruf />,
  },
  {
    id: 10,
    category: 'Zustandsdiagramm',
    title: 'Anfangszustand',
    description: 'Ausgefuellter schwarzer Kreis. Markiert den Startpunkt des Zustandsautomaten.',
    example: 'Startpunkt, von dem aus eine neue Bestellung im Zustand "Erstellt" beginnt.',
    svgFront: <SvgAnfangszustand />,
  },
  {
    id: 11,
    category: 'Zustandsdiagramm',
    title: 'Endzustand',
    description: 'Kreis mit innenliegendem ausgefuelltem Kreis. Markiert den Endpunkt des Automaten.',
    example: 'Die Bestellung endet im Zustand "Zugestellt" oder "Storniert".',
    svgFront: <SvgEndzustand />,
  },
  {
    id: 12,
    category: 'Zustandsdiagramm',
    title: 'Guard-Bedingung',
    description: 'Bedingung in eckigen Klammern auf einer Transition. Uebergang erfolgt nur, wenn die Bedingung wahr ist.',
    example: '[bezahlt] als Guard am Uebergang von "Erstellt" nach "In Bearbeitung".',
    svgFront: <SvgGuard />,
  },
  {
    id: 13,
    category: 'Aktivitätsdiagramm',
    title: 'Entscheidungsknoten (Raute)',
    description: 'Leere Raute fuer Verzweigungen. WICHTIG: Die Raute bleibt LEER! Guards stehen an den ausgehenden Kanten.',
    example: 'Raute nach "Zahlung pruefen" mit [erfolgreich] und [fehlgeschlagen] an den Kanten.',
    svgFront: <SvgEntscheidungsknoten />,
  },
  {
    id: 14,
    category: 'Aktivitätsdiagramm',
    title: 'Fork / Join (Synchronisationsbalken)',
    description: 'Dicker schwarzer Balken. Fork: Parallelisierung (eine eingehende, mehrere ausgehende). Join: Synchronisation (mehrere eingehende, eine ausgehende).',
    example: 'Nach Bezahlung laufen "Rechnung erstellen" und "Versand vorbereiten" parallel.',
    svgFront: <SvgForkJoin />,
  },
  {
    id: 15,
    category: 'Use-Case-Diagramm',
    title: '<<include>>-Beziehung',
    description: 'Gestrichelter Pfeil von Basis-UC zum inkludierten UC. Pflichtbestandteil, wird IMMER ausgefuehrt.',
    example: '"Produkt bestellen" schliesst "Zahlung durchfuehren" immer ein (include).',
    svgFront: <SvgInclude />,
  },
  {
    id: 16,
    category: 'Use-Case-Diagramm',
    title: '<<extend>>-Beziehung',
    description: 'Gestrichelter Pfeil vom erweiternden UC zum Basis-UC. Optional, NUR unter bestimmter Bedingung ausgefuehrt.',
    example: '"Gutschein einloesen" erweitert "Produkt bestellen" optional (extend).',
    svgFront: <SvgExtend />,
  },
]

// ─── Shuffle utility ─────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function NotationFlashcards() {
  const [deck, setDeck] = useState<Flashcard[]>(() => shuffleArray(ALL_CARDS))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [knownIds, setKnownIds] = useState<Set<number>>(new Set())
  const [unknownIds, setUnknownIds] = useState<Set<number>>(new Set())
  const [phase, setPhase] = useState<Phase>('learning')
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left')

  const currentCard = deck[currentIndex] ?? null
  const totalCards = deck.length
  const answeredCount = knownIds.size + unknownIds.size

  // Progress percentage
  const progressPercent = totalCards > 0 ? Math.round((answeredCount / totalCards) * 100) : 0

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev)
  }, [])

  const advanceToNext = useCallback(() => {
    setIsFlipped(false)
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setPhase('summary')
    }
  }, [currentIndex, deck.length])

  const handleKnown = useCallback(() => {
    if (!currentCard) return
    setSlideDirection('left')
    setKnownIds((prev) => new Set(prev).add(currentCard.id))
    // Remove from unknown if it was there (re-review scenario)
    setUnknownIds((prev) => {
      const next = new Set(prev)
      next.delete(currentCard.id)
      return next
    })
    setTimeout(advanceToNext, 150)
  }, [currentCard, advanceToNext])

  const handleUnknown = useCallback(() => {
    if (!currentCard) return
    setSlideDirection('right')
    setUnknownIds((prev) => new Set(prev).add(currentCard.id))
    setKnownIds((prev) => {
      const next = new Set(prev)
      next.delete(currentCard.id)
      return next
    })
    setTimeout(advanceToNext, 150)
  }, [currentCard, advanceToNext])

  const handleRepeatUnknown = useCallback(() => {
    const unknownCards = ALL_CARDS.filter((c) => unknownIds.has(c.id))
    setDeck(shuffleArray(unknownCards))
    setCurrentIndex(0)
    setIsFlipped(false)
    setKnownIds(new Set())
    setUnknownIds(new Set())
    setPhase('learning')
  }, [unknownIds])

  const handleRestartAll = useCallback(() => {
    setDeck(shuffleArray(ALL_CARDS))
    setCurrentIndex(0)
    setIsFlipped(false)
    setKnownIds(new Set())
    setUnknownIds(new Set())
    setPhase('learning')
  }, [])

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (phase !== 'learning') return
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        if (!isFlipped) {
          handleFlip()
        }
      } else if (e.key === 'ArrowRight' && isFlipped) {
        handleKnown()
      } else if (e.key === 'ArrowLeft' && isFlipped) {
        handleUnknown()
      }
    },
    [phase, isFlipped, handleFlip, handleKnown, handleUnknown]
  )

  // Summary stats
  const summaryKnownCount = useMemo(() => {
    return deck.filter((c) => knownIds.has(c.id)).length
  }, [deck, knownIds])

  // ── Summary Phase ──

  if (phase === 'summary') {
    const percent = totalCards > 0 ? Math.round((summaryKnownCount / totalCards) * 100) : 0
    const hasUnknown = unknownIds.size > 0

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-text mb-2">Notation-Schnelltrainer</h3>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border-2 border-border bg-white p-8 text-center"
        >
          <div className="text-5xl font-bold text-primary mb-2">{summaryKnownCount} von {totalCards}</div>
          <p className="text-lg text-text-light mb-6">Karten gewusst!</p>

          {/* Result bar */}
          <div className="w-full max-w-md mx-auto h-4 bg-surface-dark rounded-full overflow-hidden mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-success rounded-full"
            />
          </div>

          {/* Category breakdown */}
          <div className="grid gap-2 max-w-md mx-auto mb-8 text-left">
            {(['Klassendiagramm', 'Sequenzdiagramm', 'Zustandsdiagramm', 'Aktivitätsdiagramm', 'Use-Case-Diagramm'] as DiagramCategory[]).map((cat) => {
              const cardsInCat = deck.filter((c) => c.category === cat)
              const knownInCat = cardsInCat.filter((c) => knownIds.has(c.id)).length
              if (cardsInCat.length === 0) return null
              return (
                <div key={cat} className="flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg bg-surface">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${CATEGORY_STYLES[cat]}`}>{cat}</span>
                  <span className="text-sm text-text font-medium">{knownInCat}/{cardsInCat.length}</span>
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {hasUnknown && (
              <button
                onClick={handleRepeatUnknown}
                className="px-5 py-2.5 rounded-lg bg-warning text-white font-medium text-sm hover:bg-warning/90 transition-colors focus:outline-none focus:ring-2 focus:ring-warning focus:ring-offset-2"
              >
                Unbekannte wiederholen ({unknownIds.size} Karten)
              </button>
            )}
            <button
              onClick={handleRestartAll}
              className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Alle Karten neu starten
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Learning Phase ──

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown} tabIndex={-1}>
      <div>
        <h3 className="text-xl font-bold text-text mb-2">Notation-Schnelltrainer</h3>
        <p className="text-text-light text-sm">
          Lerne die wichtigsten UML-Notationssymbole. Klicke auf die Karte zum Umdrehen,
          dann bewerte dein Wissen.
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-text">Karte {currentIndex + 1} von {totalCards}</span>
          <span className="text-text-light">{progressPercent}% bearbeitet</span>
        </div>
        <div className="w-full h-3 bg-surface-dark rounded-full overflow-hidden flex">
          <motion.div
            className="h-full bg-success"
            initial={false}
            animate={{ width: `${totalCards > 0 ? (knownIds.size / totalCards) * 100 : 0}%` }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="h-full bg-error"
            initial={false}
            animate={{ width: `${totalCards > 0 ? (unknownIds.size / totalCards) * 100 : 0}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex gap-4 text-xs text-text-light">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-success" aria-hidden="true" />
            Gewusst: {knownIds.size}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-error" aria-hidden="true" />
            Nicht gewusst: {unknownIds.size}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-surface-dark border border-border" aria-hidden="true" />
            Offen: {totalCards - answeredCount}
          </span>
        </div>
      </div>

      {/* Flashcard */}
      {currentCard && (
        <div className="flex justify-center perspective-[1000px]" style={{ perspective: '1000px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentCard.id}-${currentIndex}`}
              initial={{ opacity: 0, x: slideDirection === 'left' ? 80 : -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: slideDirection === 'left' ? -80 : 80 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full max-w-lg"
            >
              <div
                onClick={handleFlip}
                className="relative w-full cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  minHeight: '320px',
                }}
                role="button"
                tabIndex={0}
                aria-label={isFlipped ? `Kartenvorderseite zeigen: ${currentCard.title}` : `Karte umdrehen: Was bedeutet dieses Symbol?`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleFlip()
                  }
                }}
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="relative w-full"
                >
                  {/* Front */}
                  <div
                    className="rounded-2xl border-2 border-border bg-white p-6 shadow-lg w-full"
                    style={{
                      backfaceVisibility: 'hidden',
                      minHeight: '320px',
                    }}
                  >
                    <div className="flex flex-col items-center justify-center h-full space-y-4" style={{ minHeight: '280px' }}>
                      <div className="w-full max-w-[280px] h-[120px] flex items-center justify-center">
                        {currentCard.svgFront}
                      </div>
                      <p className="text-base font-semibold text-text text-center">
                        Was bedeutet dieses Symbol?
                      </p>
                      <p className="text-xs text-text-light text-center">
                        Klicke zum Umdrehen
                      </p>
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    className="rounded-2xl border-2 border-primary bg-white p-6 shadow-lg w-full absolute top-0 left-0"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      minHeight: '320px',
                    }}
                  >
                    <div className="flex flex-col h-full space-y-4" style={{ minHeight: '280px' }}>
                      {/* Category badge */}
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${CATEGORY_STYLES[currentCard.category]}`}>
                          {currentCard.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-lg font-bold text-text">{currentCard.title}</h4>

                      {/* Description */}
                      <p className="text-sm text-text leading-relaxed flex-1">
                        {currentCard.description}
                      </p>

                      {/* TechStore Example */}
                      <div className="rounded-lg bg-surface p-3 border border-border">
                        <p className="text-xs font-semibold text-text-light mb-1">TechStore-Beispiel:</p>
                        <p className="text-sm text-text">{currentCard.example}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleUnknown}
          disabled={!isFlipped}
          className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 ${
            isFlipped
              ? 'bg-error text-white hover:bg-error-light shadow-sm active:scale-95'
              : 'bg-surface-dark text-text-light cursor-not-allowed opacity-50'
          }`}
          aria-label="Nicht gewusst"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Nicht gewusst
          </span>
        </button>

        <button
          onClick={handleKnown}
          disabled={!isFlipped}
          className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2 ${
            isFlipped
              ? 'bg-success text-white hover:bg-success-light shadow-sm active:scale-95'
              : 'bg-surface-dark text-text-light cursor-not-allowed opacity-50'
          }`}
          aria-label="Gewusst"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Gewusst
          </span>
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-xs text-text-light">
        Tastatur: <kbd className="px-1.5 py-0.5 rounded bg-surface-dark border border-border text-[10px] font-mono">Leertaste</kbd> umdrehen
        {' '} <kbd className="px-1.5 py-0.5 rounded bg-surface-dark border border-border text-[10px] font-mono">&larr;</kbd> nicht gewusst
        {' '} <kbd className="px-1.5 py-0.5 rounded bg-surface-dark border border-border text-[10px] font-mono">&rarr;</kbd> gewusst
      </p>
    </div>
  )
}
