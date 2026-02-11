import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ───────────────────────────────────────────────────────────────────

type DiagramType =
  | 'klassendiagramm'
  | 'sequenzdiagramm'
  | 'zustandsdiagramm'
  | 'aktivitaetsdiagramm'
  | 'usecasediagramm'

type ConceptKey = 'bestellung' | 'kunde' | 'produkt'

interface CrossReference {
  diagram: DiagramType
  label: string
  description: string
}

interface ConceptConfig {
  name: string
  color: string
  bgColor: string
  borderColor: string
  hoverBg: string
  textColor: string
  crossReferences: CrossReference[]
}

// ─── Data ────────────────────────────────────────────────────────────────────

const TAB_CONFIG: { key: DiagramType; label: string; short: string }[] = [
  { key: 'klassendiagramm', label: 'Klassendiagramm', short: 'Klassen' },
  { key: 'sequenzdiagramm', label: 'Sequenzdiagramm', short: 'Sequenz' },
  { key: 'zustandsdiagramm', label: 'Zustandsdiagramm', short: 'Zustand' },
  { key: 'aktivitaetsdiagramm', label: 'Aktivitätsdiagramm', short: 'Aktivität' },
  { key: 'usecasediagramm', label: 'Use-Case-Diagramm', short: 'Use-Case' },
]

const CONCEPTS: Record<ConceptKey, ConceptConfig> = {
  bestellung: {
    name: 'Bestellung',
    color: '#eab308',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-400',
    hoverBg: 'hover:bg-yellow-50',
    textColor: 'text-yellow-800',
    crossReferences: [
      { diagram: 'klassendiagramm', label: 'Klasse "Bestellung"', description: 'Zentrale Entität mit Attributen und Methoden' },
      { diagram: 'sequenzdiagramm', label: 'Objekt ": Bestellung"', description: 'Wird im Bestellprozess erzeugt' },
      { diagram: 'zustandsdiagramm', label: 'Alle Zustände der Bestellung', description: 'Erstellt, Bezahlt, Versendet, Zugestellt' },
      { diagram: 'aktivitaetsdiagramm', label: 'Prozess "Bestellung aufgeben"', description: 'Erster Schritt im Gesamtprozess' },
      { diagram: 'usecasediagramm', label: 'Use Case "Produkt bestellen"', description: 'Hauptanwendungsfall des Kunden' },
    ],
  },
  kunde: {
    name: 'Kunde',
    color: '#3b82f6',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-400',
    hoverBg: 'hover:bg-blue-50',
    textColor: 'text-blue-800',
    crossReferences: [
      { diagram: 'klassendiagramm', label: 'Klasse "Kunde"', description: 'Assoziiert mit Bestellung' },
      { diagram: 'sequenzdiagramm', label: 'Lebenslinie ": Kunde"', description: 'Initiiert den Bestellprozess' },
      { diagram: 'zustandsdiagramm', label: 'Auslöser der Ereignisse', description: 'Aktionen des Kunden lösen Zustandsübergänge aus' },
      { diagram: 'aktivitaetsdiagramm', label: 'Startakteur', description: 'Beginnt den Bestellprozess' },
      { diagram: 'usecasediagramm', label: 'Akteur "Kunde"', description: 'Primärer Akteur (Strichmännchen)' },
    ],
  },
  produkt: {
    name: 'Produkt',
    color: '#22c55e',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-400',
    hoverBg: 'hover:bg-green-50',
    textColor: 'text-green-800',
    crossReferences: [
      { diagram: 'klassendiagramm', label: 'Klasse "Produkt"', description: 'Wird über Bestellposition referenziert' },
      { diagram: 'sequenzdiagramm', label: 'Nachricht "pruefeVerfuegbarkeit()"', description: 'Lager prüft Produkt-Verfügbarkeit' },
      { diagram: 'zustandsdiagramm', label: 'Nicht direkt modelliert', description: 'Zustandsdiagramm fokussiert auf Bestellung' },
      { diagram: 'aktivitaetsdiagramm', label: 'Aktion "Verpacken"', description: 'Produkt wird für Versand vorbereitet' },
      { diagram: 'usecasediagramm', label: 'Im Use Case enthalten', description: 'Teil von "Produkt bestellen"' },
    ],
  },
}

// ─── SVG Diagram components ─────────────────────────────────────────────────

function getHighlightFill(concept: ConceptKey | null, activeConcept: ConceptKey | null, alpha: number = 0.25): string {
  if (!activeConcept || activeConcept !== concept) return 'white'
  return CONCEPTS[activeConcept].color + Math.round(alpha * 255).toString(16).padStart(2, '0')
}

function getHighlightStroke(concept: ConceptKey | null, activeConcept: ConceptKey | null): string {
  if (!activeConcept || activeConcept !== concept) return '#1e293b'
  return CONCEPTS[activeConcept].color
}

function getHighlightStrokeWidth(concept: ConceptKey | null, activeConcept: ConceptKey | null): number {
  if (!activeConcept || activeConcept !== concept) return 1.5
  return 3
}

interface ClickableProps {
  concept: ConceptKey
  activeConcept: ConceptKey | null
  onSelect: (c: ConceptKey) => void
}

// ── Klassendiagramm ──

function KlassendiagrammSVG({ activeConcept, onSelect }: { activeConcept: ConceptKey | null; onSelect: (c: ConceptKey) => void }) {
  const ClassBox = ({ concept, x, y, name, attrs, methods, ...rest }: ClickableProps & { x: number; y: number; name: string; attrs: string[]; methods: string[] }) => {
    void rest
    const h = 30 + attrs.length * 18 + methods.length * 18 + 10
    return (
      <g
        onClick={() => onSelect(concept)}
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label={`Klasse ${name} auswählen`}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(concept) } }}
      >
        <rect x={x} y={y} width={140} height={h} rx={4} fill={getHighlightFill(concept, activeConcept)} stroke={getHighlightStroke(concept, activeConcept)} strokeWidth={getHighlightStrokeWidth(concept, activeConcept)} />
        <rect x={x} y={y} width={140} height={28} rx={4} fill={getHighlightFill(concept, activeConcept, 0.35)} stroke={getHighlightStroke(concept, activeConcept)} strokeWidth={getHighlightStrokeWidth(concept, activeConcept)} />
        <rect x={x + 1} y={y + 20} width={138} height={10} fill={getHighlightFill(concept, activeConcept, 0.35)} />
        <line x1={x} y1={y + 28} x2={x + 140} y2={y + 28} stroke={getHighlightStroke(concept, activeConcept)} strokeWidth={1} />
        <text x={x + 70} y={y + 19} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#1e293b">{name}</text>
        {attrs.map((a, i) => (
          <text key={i} x={x + 8} y={y + 44 + i * 18} fontSize={10} fill="#475569" fontFamily="monospace">{a}</text>
        ))}
        <line x1={x} y1={y + 30 + attrs.length * 18} x2={x + 140} y2={y + 30 + attrs.length * 18} stroke="#e2e8f0" strokeWidth={1} />
        {methods.map((m, i) => (
          <text key={i} x={x + 8} y={y + 46 + attrs.length * 18 + i * 18} fontSize={10} fill="#475569" fontFamily="monospace">{m}</text>
        ))}
      </g>
    )
  }

  return (
    <svg viewBox="0 0 520 250" className="w-full" role="img" aria-label="Klassendiagramm: Kunde, Bestellung, Produkt mit Assoziationen">
      <ClassBox concept="kunde" activeConcept={activeConcept} onSelect={onSelect} x={10} y={80} name="Kunde" attrs={['- name: String', '- email: String']} methods={['+ bestellen()']} />
      <ClassBox concept="bestellung" activeConcept={activeConcept} onSelect={onSelect} x={190} y={20} name="Bestellung" attrs={['- bestellNr: int', '- datum: Date', '- status: String']} methods={['+ berechnePreis()']} />
      <ClassBox concept="produkt" activeConcept={activeConcept} onSelect={onSelect} x={370} y={80} name="Produkt" attrs={['- name: String', '- preis: double']} methods={['+ getDetails()']} />

      {/* Kunde -> Bestellung */}
      <line x1={150} y1={110} x2={190} y2={75} stroke="#64748b" strokeWidth={1.5} />
      <text x={150} y={82} fontSize={9} fill="#64748b" fontStyle="italic">erstellt</text>
      <text x={145} y={106} fontSize={9} fill="#1e293b" fontWeight="bold">1</text>
      <text x={190} y={70} fontSize={9} fill="#1e293b" fontWeight="bold">*</text>

      {/* Bestellung -> Produkt */}
      <line x1={330} y1={75} x2={370} y2={110} stroke="#64748b" strokeWidth={1.5} />
      <text x={345} y={82} fontSize={9} fill="#64748b" fontStyle="italic">enthält</text>
      <text x={330} y={70} fontSize={9} fill="#1e293b" fontWeight="bold">*</text>
      <text x={375} y={106} fontSize={9} fill="#1e293b" fontWeight="bold">*</text>
    </svg>
  )
}

// ── Sequenzdiagramm ──

function SequenzdiagrammSVG({ activeConcept, onSelect }: { activeConcept: ConceptKey | null; onSelect: (c: ConceptKey) => void }) {
  const Lifeline = ({ concept, x, label }: ClickableProps & { x: number; label: string }) => (
    <g
      onClick={() => onSelect(concept)}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`Lebenslinie ${label} auswählen`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(concept) } }}
    >
      <rect x={x - 50} y={10} width={100} height={30} rx={4} fill={getHighlightFill(concept, activeConcept)} stroke={getHighlightStroke(concept, activeConcept)} strokeWidth={getHighlightStrokeWidth(concept, activeConcept)} />
      <text x={x} y={30} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#1e293b">{label}</text>
      <line x1={x} y1={40} x2={x} y2={230} stroke="#94a3b8" strokeWidth={1} strokeDasharray="6 4" />
    </g>
  )

  return (
    <svg viewBox="0 0 520 250" className="w-full" role="img" aria-label="Sequenzdiagramm: Kunde bestellt über WebShop, Lager prüft Verfügbarkeit">
      <Lifeline concept="kunde" activeConcept={activeConcept} onSelect={onSelect} x={80} label=": Kunde" />
      <Lifeline concept="bestellung" activeConcept={activeConcept} onSelect={onSelect} x={260} label=": WebShop" />
      <Lifeline concept="produkt" activeConcept={activeConcept} onSelect={onSelect} x={440} label=": Lager" />

      {/* Activation bars */}
      <rect x={75} y={70} width={10} height={30} fill="#dbeafe" stroke="#3b82f6" strokeWidth={1} />
      <rect x={255} y={70} width={10} height={80} fill="#fef3c7" stroke="#eab308" strokeWidth={1} />
      <rect x={435} y={110} width={10} height={30} fill="#dcfce7" stroke="#22c55e" strokeWidth={1} />

      {/* bestellen() */}
      <line x1={85} y1={85} x2={255} y2={85} stroke="#1e293b" strokeWidth={1.5} />
      <polygon points="255,85 247,81 247,89" fill="#1e293b" />
      <text x={170} y={78} textAnchor="middle" fontSize={10} fill="#1e293b">bestellen()</text>

      {/* pruefeVerfuegbarkeit() */}
      <line x1={265} y1={125} x2={435} y2={125} stroke="#1e293b" strokeWidth={1.5} />
      <polygon points="435,125 427,121 427,129" fill="#1e293b" />
      <text x={350} y={118} textAnchor="middle" fontSize={10} fill="#1e293b">pruefeVerfuegbarkeit()</text>

      {/* return verfuegbar */}
      <line x1={435} y1={140} x2={265} y2={140} stroke="#64748b" strokeWidth={1} strokeDasharray="6 3" />
      <polyline points="273,136 265,140 273,144" fill="none" stroke="#64748b" strokeWidth={1} />
      <text x={350} y={155} textAnchor="middle" fontSize={10} fill="#64748b" fontStyle="italic">verfuegbar</text>

      {/* return bestellBestaetigung */}
      <line x1={255} y1={175} x2={85} y2={175} stroke="#64748b" strokeWidth={1} strokeDasharray="6 3" />
      <polyline points="93,171 85,175 93,179" fill="none" stroke="#64748b" strokeWidth={1} />
      <text x={170} y={192} textAnchor="middle" fontSize={10} fill="#64748b" fontStyle="italic">bestellBestaetigung</text>
    </svg>
  )
}

// ── Zustandsdiagramm ──

function ZustandsdiagrammSVG({ activeConcept, onSelect }: { activeConcept: ConceptKey | null; onSelect: (c: ConceptKey) => void }) {
  const StateNode = ({ concept, x, y, label }: ClickableProps & { x: number; y: number; label: string }) => (
    <g
      onClick={() => onSelect(concept)}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`Zustand ${label} auswählen`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(concept) } }}
    >
      <rect x={x - 55} y={y - 16} width={110} height={32} rx={16} fill={getHighlightFill(concept, activeConcept)} stroke={getHighlightStroke(concept, activeConcept)} strokeWidth={getHighlightStrokeWidth(concept, activeConcept)} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#1e293b">{label}</text>
    </g>
  )

  return (
    <svg viewBox="0 0 520 200" className="w-full" role="img" aria-label="Zustandsdiagramm: Bestellungszustände von Erstellt bis Zugestellt">
      {/* Start node */}
      <circle cx={30} cy={100} r={8} fill="#1e293b" />
      <line x1={38} y1={100} x2={58} y2={100} stroke="#1e293b" strokeWidth={1.5} />
      <polygon points="58,100 52,96 52,104" fill="#1e293b" />

      <StateNode concept="bestellung" activeConcept={activeConcept} onSelect={onSelect} x={130} y={100} label="Erstellt" />

      {/* Erstellt -> Bezahlt */}
      <line x1={185} y1={100} x2={215} y2={100} stroke="#1e293b" strokeWidth={1.5} />
      <polygon points="215,100 209,96 209,104" fill="#1e293b" />
      <text x={200} y={90} textAnchor="middle" fontSize={9} fill="#64748b">bezahlen()</text>

      <StateNode concept="bestellung" activeConcept={activeConcept} onSelect={onSelect} x={280} y={100} label="Bezahlt" />

      {/* Bezahlt -> Versendet */}
      <line x1={335} y1={100} x2={365} y2={100} stroke="#1e293b" strokeWidth={1.5} />
      <polygon points="365,100 359,96 359,104" fill="#1e293b" />
      <text x={350} y={90} textAnchor="middle" fontSize={9} fill="#64748b">versenden()</text>

      <StateNode concept="bestellung" activeConcept={activeConcept} onSelect={onSelect} x={430} y={100} label="Versendet" />

      {/* Versendet -> Zugestellt */}
      <path d="M 430 116 L 430 155 L 280 155" stroke="#1e293b" strokeWidth={1.5} fill="none" />
      <polygon points="280,155 286,151 286,159" fill="#1e293b" />
      <text x={360} y={148} textAnchor="middle" fontSize={9} fill="#64748b">zustellen()</text>

      <StateNode concept="bestellung" activeConcept={activeConcept} onSelect={onSelect} x={215} y={155} label="Zugestellt" />

      {/* End node */}
      <line x1={160} y1={155} x2={135} y2={155} stroke="#1e293b" strokeWidth={1.5} />
      <polygon points="135,155 141,151 141,159" fill="#1e293b" />
      <circle cx={120} cy={155} r={10} fill="none" stroke="#1e293b" strokeWidth={1.5} />
      <circle cx={120} cy={155} r={6} fill="#1e293b" />

      {/* Kunde trigger annotation */}
      <g
        onClick={() => onSelect('kunde')}
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label="Kunde als Auslöser auswählen"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect('kunde') } }}
      >
        <rect x={95} y={30} width={130} height={24} rx={4} fill={getHighlightFill('kunde', activeConcept)} stroke={getHighlightStroke('kunde', activeConcept)} strokeWidth={getHighlightStrokeWidth('kunde', activeConcept)} strokeDasharray="4 2" />
        <text x={160} y={46} textAnchor="middle" fontSize={10} fill="#3b82f6" fontStyle="italic">Auslöser: Kunde</text>
      </g>
      <line x1={160} y1={54} x2={160} y2={84} stroke="#3b82f6" strokeWidth={1} strokeDasharray="3 2" />
    </svg>
  )
}

// ── Aktivitätsdiagramm ──

function AktivitaetsdiagrammSVG({ activeConcept, onSelect }: { activeConcept: ConceptKey | null; onSelect: (c: ConceptKey) => void }) {
  const ActionNode = ({ concept, x, y, label, w = 120 }: ClickableProps & { x: number; y: number; label: string; w?: number }) => (
    <g
      onClick={() => onSelect(concept)}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`Aktion ${label} auswählen`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(concept) } }}
    >
      <rect x={x - w / 2} y={y - 16} width={w} height={32} rx={10} fill={getHighlightFill(concept, activeConcept)} stroke={getHighlightStroke(concept, activeConcept)} strokeWidth={getHighlightStrokeWidth(concept, activeConcept)} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#1e293b">{label}</text>
    </g>
  )

  return (
    <svg viewBox="0 0 520 220" className="w-full" role="img" aria-label="Aktivitätsdiagramm: Bestellen, Zahlen, Verpacken, Versenden">
      {/* Start */}
      <circle cx={60} cy={110} r={8} fill="#1e293b" />
      <line x1={68} y1={110} x2={85} y2={110} stroke="#1e293b" strokeWidth={1.5} />
      <polygon points="85,110 79,106 79,114" fill="#1e293b" />

      <ActionNode concept="bestellung" activeConcept={activeConcept} onSelect={onSelect} x={150} y={110} label="Bestellen" w={100} />

      <line x1={200} y1={110} x2={218} y2={110} stroke="#1e293b" strokeWidth={1.5} />
      <polygon points="218,110 212,106 212,114" fill="#1e293b" />

      <ActionNode concept="kunde" activeConcept={activeConcept} onSelect={onSelect} x={270} y={110} label="Zahlen" w={80} />

      <line x1={310} y1={110} x2={328} y2={110} stroke="#1e293b" strokeWidth={1.5} />
      <polygon points="328,110 322,106 322,114" fill="#1e293b" />

      <ActionNode concept="produkt" activeConcept={activeConcept} onSelect={onSelect} x={385} y={110} label="Verpacken" w={90} />

      <line x1={430} y1={110} x2={448} y2={110} stroke="#1e293b" strokeWidth={1.5} />
      <polygon points="448,110 442,106 442,114" fill="#1e293b" />

      {/* Final activity box wraps down */}
      <path d="M 448 110 L 470 110 L 470 170 L 385 170" stroke="#1e293b" strokeWidth={1.5} fill="none" />
      <polygon points="385,170 391,166 391,174" fill="#1e293b" />

      <ActionNode concept="bestellung" activeConcept={activeConcept} onSelect={onSelect} x={320} y={170} label="Versenden" w={100} />

      {/* End */}
      <line x1={270} y1={170} x2={252} y2={170} stroke="#1e293b" strokeWidth={1.5} />
      <polygon points="252,170 258,166 258,174" fill="#1e293b" />
      <circle cx={238} cy={170} r={10} fill="none" stroke="#1e293b" strokeWidth={1.5} />
      <circle cx={238} cy={170} r={6} fill="#1e293b" />

      {/* Annotations */}
      <text x={150} y={40} textAnchor="middle" fontSize={9} fill="#64748b" fontStyle="italic">Kunde löst aus</text>
      <line x1={150} y1={44} x2={150} y2={94} stroke="#64748b" strokeWidth={0.5} strokeDasharray="3 2" />
    </svg>
  )
}

// ── Use-Case-Diagramm ──

function UseCaseDiagrammSVG({ activeConcept, onSelect }: { activeConcept: ConceptKey | null; onSelect: (c: ConceptKey) => void }) {
  return (
    <svg viewBox="0 0 520 250" className="w-full" role="img" aria-label="Use-Case-Diagramm: Kunde, Systemgrenze TechStore, Produkt bestellen">
      {/* System boundary */}
      <rect x={160} y={15} width={240} height={220} rx={12} fill="#f8fafc" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="8 4" />
      <text x={280} y={38} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#64748b">TechStore</text>

      {/* Actor: Kunde */}
      <g
        onClick={() => onSelect('kunde')}
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label="Akteur Kunde auswählen"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect('kunde') } }}
      >
        {/* Highlight circle behind actor */}
        {activeConcept === 'kunde' && <circle cx={65} cy={100} r={42} fill={getHighlightFill('kunde', activeConcept)} stroke="none" />}
        {/* Stick figure */}
        <circle cx={65} cy={75} r={12} fill="none" stroke={getHighlightStroke('kunde', activeConcept)} strokeWidth={getHighlightStrokeWidth('kunde', activeConcept)} />
        <line x1={65} y1={87} x2={65} y2={115} stroke={getHighlightStroke('kunde', activeConcept)} strokeWidth={getHighlightStrokeWidth('kunde', activeConcept)} />
        <line x1={45} y1={97} x2={85} y2={97} stroke={getHighlightStroke('kunde', activeConcept)} strokeWidth={getHighlightStrokeWidth('kunde', activeConcept)} />
        <line x1={65} y1={115} x2={50} y2={135} stroke={getHighlightStroke('kunde', activeConcept)} strokeWidth={getHighlightStrokeWidth('kunde', activeConcept)} />
        <line x1={65} y1={115} x2={80} y2={135} stroke={getHighlightStroke('kunde', activeConcept)} strokeWidth={getHighlightStrokeWidth('kunde', activeConcept)} />
        <text x={65} y={152} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#1e293b">Kunde</text>
      </g>

      {/* Use Case: Produkt bestellen */}
      <g
        onClick={() => onSelect('bestellung')}
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label="Use Case Produkt bestellen auswählen"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect('bestellung') } }}
      >
        <ellipse cx={280} cy={80} rx={85} ry={28} fill={getHighlightFill('bestellung', activeConcept)} stroke={getHighlightStroke('bestellung', activeConcept)} strokeWidth={getHighlightStrokeWidth('bestellung', activeConcept)} />
        <text x={280} y={76} textAnchor="middle" fontSize={11} fill="#1e293b">Produkt</text>
        <text x={280} y={90} textAnchor="middle" fontSize={11} fill="#1e293b">bestellen</text>
      </g>

      {/* Use Case: Produkt suchen */}
      <g
        onClick={() => onSelect('produkt')}
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label="Use Case Produkt suchen auswählen"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect('produkt') } }}
      >
        <ellipse cx={280} cy={160} rx={85} ry={28} fill={getHighlightFill('produkt', activeConcept)} stroke={getHighlightStroke('produkt', activeConcept)} strokeWidth={getHighlightStrokeWidth('produkt', activeConcept)} />
        <text x={280} y={156} textAnchor="middle" fontSize={11} fill="#1e293b">Produkt</text>
        <text x={280} y={170} textAnchor="middle" fontSize={11} fill="#1e293b">suchen</text>
      </g>

      {/* Association lines */}
      <line x1={88} y1={100} x2={195} y2={80} stroke="#64748b" strokeWidth={1.5} />
      <line x1={88} y1={110} x2={195} y2={155} stroke="#64748b" strokeWidth={1.5} />

      {/* <<include>> from bestellen to suchen */}
      <line x1={280} y1={108} x2={280} y2={132} stroke="#64748b" strokeWidth={1} strokeDasharray="5 3" />
      <polygon points="280,132 276,126 284,126" fill="#64748b" />
      <text x={310} y={123} fontSize={9} fill="#64748b" fontStyle="italic">&laquo;include&raquo;</text>

      {/* Actor: Zahlungssystem */}
      <g>
        <circle cx={460} cy={75} r={12} fill="none" stroke="#94a3b8" strokeWidth={1.5} />
        <line x1={460} y1={87} x2={460} y2={115} stroke="#94a3b8" strokeWidth={1.5} />
        <line x1={440} y1={97} x2={480} y2={97} stroke="#94a3b8" strokeWidth={1.5} />
        <line x1={460} y1={115} x2={445} y2={135} stroke="#94a3b8" strokeWidth={1.5} />
        <line x1={460} y1={115} x2={475} y2={135} stroke="#94a3b8" strokeWidth={1.5} />
        <text x={460} y={152} textAnchor="middle" fontSize={10} fill="#64748b">Zahlung</text>
      </g>
      <line x1={365} y1={78} x2={448} y2={80} stroke="#94a3b8" strokeWidth={1} />
    </svg>
  )
}

// ─── Diagram Map ─────────────────────────────────────────────────────────────

const DIAGRAM_COMPONENTS: Record<DiagramType, React.FC<{ activeConcept: ConceptKey | null; onSelect: (c: ConceptKey) => void }>> = {
  klassendiagramm: KlassendiagrammSVG,
  sequenzdiagramm: SequenzdiagrammSVG,
  zustandsdiagramm: ZustandsdiagrammSVG,
  aktivitaetsdiagramm: AktivitaetsdiagrammSVG,
  usecasediagramm: UseCaseDiagrammSVG,
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function RosettaStone() {
  const [activeTab, setActiveTab] = useState<DiagramType>('klassendiagramm')
  const [activeConcept, setActiveConcept] = useState<ConceptKey | null>(null)

  const handleConceptSelect = useCallback((concept: ConceptKey) => {
    setActiveConcept((prev) => (prev === concept ? null : concept))
  }, [])

  const DiagramComponent = DIAGRAM_COMPONENTS[activeTab]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-text mb-2">
          UML-Rosetta-Stone
        </h3>
        <p className="text-text-light text-sm leading-relaxed">
          Dasselbe TechStore-Szenario aus 5 verschiedenen UML-Perspektiven.
          Klicke auf ein farbiges Element in einem Diagramm, um seine Querverweise
          in allen anderen Diagrammtypen zu sehen.
        </p>
      </div>

      {/* Concept legend */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Konzepte zum Hervorheben">
        {(Object.entries(CONCEPTS) as [ConceptKey, ConceptConfig][]).map(([key, config]) => (
          <button
            key={key}
            onClick={() => handleConceptSelect(key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
              activeConcept === key
                ? `${config.bgColor} ${config.borderColor} ${config.textColor} shadow-sm`
                : `bg-white border-border text-text-light ${config.hoverBg}`
            }`}
            aria-pressed={activeConcept === key}
          >
            <span
              className="inline-block w-2.5 h-2.5 rounded-full mr-1.5"
              style={{ backgroundColor: config.color }}
              aria-hidden="true"
            />
            {config.name}
          </button>
        ))}
        {activeConcept && (
          <button
            onClick={() => setActiveConcept(null)}
            className="px-3 py-1.5 rounded-full text-sm font-medium border border-border text-text-light hover:bg-surface-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Auswahl aufheben
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-border" role="tablist" aria-label="UML-Diagrammtypen">
        <div className="flex flex-wrap -mb-px">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls={`panel-${tab.key}`}
              id={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2.5 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-light hover:text-text hover:border-border'
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.short}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Diagram panel */}
      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="bg-white rounded-xl border border-border p-4 overflow-x-auto min-h-[220px]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <DiagramComponent activeConcept={activeConcept} onSelect={handleConceptSelect} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cross-references section */}
      <AnimatePresence mode="wait">
        {activeConcept && (
          <motion.div
            key={activeConcept}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className={`rounded-xl border-2 p-5 ${CONCEPTS[activeConcept].borderColor} ${CONCEPTS[activeConcept].bgColor}`}
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: CONCEPTS[activeConcept].color }}
                aria-hidden="true"
              />
              <h4 className={`font-bold text-base ${CONCEPTS[activeConcept].textColor}`}>
                Querverweise: {CONCEPTS[activeConcept].name}
              </h4>
            </div>

            <div className="grid gap-2">
              {CONCEPTS[activeConcept].crossReferences.map((ref) => {
                const tabInfo = TAB_CONFIG.find((t) => t.key === ref.diagram)!
                const isCurrentTab = ref.diagram === activeTab
                return (
                  <motion.button
                    key={ref.diagram}
                    onClick={() => setActiveTab(ref.diagram)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`flex items-start gap-3 text-left w-full px-3 py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                      isCurrentTab
                        ? 'bg-white/80 shadow-sm ring-1 ring-black/5'
                        : 'hover:bg-white/50'
                    }`}
                  >
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0 mt-0.5 ${
                      isCurrentTab ? 'bg-primary text-white' : 'bg-white/70 text-text-light'
                    }`}>
                      {tabInfo.label}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text truncate">{ref.label}</p>
                      <p className="text-xs text-text-light mt-0.5">{ref.description}</p>
                    </div>
                    {isCurrentTab && (
                      <span className="ml-auto text-xs text-primary font-medium flex-shrink-0 mt-0.5">
                        aktiv
                      </span>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint when no concept selected */}
      {!activeConcept && (
        <div className="rounded-xl border border-border bg-surface p-4 text-center text-sm text-text-light">
          <p>
            Klicke auf ein farbiges Element in einem Diagramm oder auf einen der Konzept-Buttons oben,
            um zu sehen, wie dasselbe Konzept in verschiedenen UML-Diagrammtypen dargestellt wird.
          </p>
        </div>
      )}
    </div>
  )
}
