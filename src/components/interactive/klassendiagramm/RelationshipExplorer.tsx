import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type ScenarioKey = 'bestellung' | 'warenkorb' | 'kunde'

interface ClassBox {
  id: string
  label: string
  x: number
  y: number
  attributes: string[]
  methods: string[]
}

interface Connection {
  from: string
  to: string
  type: 'composition' | 'aggregation' | 'association'
  label: string
  fromMultiplicity?: string
  toMultiplicity?: string
}

const classes: ClassBox[] = [
  {
    id: 'bestellung',
    label: 'Bestellung',
    x: 100,
    y: 10,
    attributes: ['- bestellNr: int', '- datum: Date', '- status: String'],
    methods: ['+ berechneGesamtpreis()'],
  },
  {
    id: 'bestellposition',
    label: 'Bestellposition',
    x: 100,
    y: 200,
    attributes: ['- anzahl: int', '- einzelpreis: double'],
    methods: ['+ berechnePositionspreis()'],
  },
  {
    id: 'produkt',
    label: 'Produkt',
    x: 530,
    y: 200,
    attributes: ['- name: String', '- preis: double'],
    methods: ['+ getDetails()'],
  },
  {
    id: 'kunde',
    label: 'Kunde',
    x: 530,
    y: 10,
    attributes: ['- name: String', '- email: String'],
    methods: ['+ bestellen()'],
  },
  {
    id: 'warenkorb',
    label: 'Warenkorb',
    x: 530,
    y: 350,
    attributes: ['- erstellt: Date'],
    methods: ['+ hinzufuegen()', '+ leeren()'],
  },
]

const connections: Connection[] = [
  {
    from: 'bestellung',
    to: 'bestellposition',
    type: 'composition',
    label: 'enthält',
    fromMultiplicity: '1',
    toMultiplicity: '1..*',
  },
  {
    from: 'bestellposition',
    to: 'produkt',
    type: 'association',
    label: 'bezieht sich auf',
    fromMultiplicity: '*',
    toMultiplicity: '1',
  },
  {
    from: 'bestellung',
    to: 'kunde',
    type: 'association',
    label: 'gehört zu',
    fromMultiplicity: '*',
    toMultiplicity: '1',
  },
  {
    from: 'warenkorb',
    to: 'produkt',
    type: 'aggregation',
    label: 'enthält',
    fromMultiplicity: '1',
    toMultiplicity: '0..*',
  },
]

const scenarios: Record<ScenarioKey, {
  deletedIds: string[]
  explanation: string
  title: string
}> = {
  bestellung: {
    deletedIds: ['bestellung', 'bestellposition'],
    explanation:
      'Komposition: Bestellpositionen werden mit der Bestellung gelöscht, da sie ohne Bestellung nicht existieren können. Assoziation: Produkte und Kunden existieren unabhängig weiter.',
    title: 'Bestellung löschen',
  },
  warenkorb: {
    deletedIds: ['warenkorb'],
    explanation:
      'Aggregation: Produkte existieren auch ohne Warenkorb weiter. Der Warenkorb ist nur ein \"Behälter\" \u2014 die enthaltenen Produkte sind eigenständige Objekte.',
    title: 'Warenkorb löschen',
  },
  kunde: {
    deletedIds: ['kunde'],
    explanation:
      'Assoziation: Die Bestellung referenziert den Kunden, ist aber nicht existenzabhängig. In der Praxis bleibt die Bestellung als Beleg erhalten, auch wenn der Kunde sein Konto löscht.',
    title: 'Kunde löschen',
  },
}

const BOX_W = 200
const BOX_HEADER_H = 32
const LINE_H = 18
const SECTION_PAD = 6

function boxHeight(c: ClassBox) {
  const attrLines = c.attributes.length
  const methLines = c.methods.length
  return BOX_HEADER_H + SECTION_PAD + attrLines * LINE_H + SECTION_PAD + methLines * LINE_H + SECTION_PAD
}

function boxCenter(c: ClassBox) {
  return { cx: c.x + BOX_W / 2, cy: c.y + boxHeight(c) / 2 }
}

function getConnectionPoints(fromClass: ClassBox, toClass: ClassBox) {
  const from = boxCenter(fromClass)
  const to = boxCenter(toClass)
  const fromH = boxHeight(fromClass)
  const toH = boxHeight(toClass)

  let x1 = from.cx
  let y1 = from.cy
  let x2 = to.cx
  let y2 = to.cy

  const dx = to.cx - from.cx
  const dy = to.cy - from.cy

  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal connection
    if (dx > 0) {
      x1 = fromClass.x + BOX_W
      x2 = toClass.x
    } else {
      x1 = fromClass.x
      x2 = toClass.x + BOX_W
    }
    y1 = from.cy
    y2 = to.cy
  } else {
    // Vertical connection
    if (dy > 0) {
      y1 = fromClass.y + fromH
      y2 = toClass.y
    } else {
      y1 = fromClass.y
      y2 = toClass.y + toH
    }
    x1 = from.cx
    x2 = to.cx
  }

  return { x1, y1, x2, y2 }
}

function DiamondMarker({ x, y, dx, dy, filled }: { x: number; y: number; dx: number; dy: number; filled: boolean }) {
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len === 0) return null
  const ux = dx / len
  const uy = dy / len
  const px = -uy
  const py = ux

  const size = 10
  const halfW = 5

  const points = [
    `${x},${y}`,
    `${x + ux * size + px * halfW},${y + uy * size + py * halfW}`,
    `${x + ux * size * 2},${y + uy * size * 2}`,
    `${x + ux * size - px * halfW},${y + uy * size - py * halfW}`,
  ].join(' ')

  return <polygon points={points} fill={filled ? '#1e293b' : 'white'} stroke="#1e293b" strokeWidth={1.5} />
}

function ArrowHead({ x, y, dx, dy }: { x: number; y: number; dx: number; dy: number }) {
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len === 0) return null
  const ux = dx / len
  const uy = dy / len
  const px = -uy
  const py = ux

  const size = 10
  const halfW = 5

  const points = [
    `${x},${y}`,
    `${x - ux * size + px * halfW},${y - uy * size + py * halfW}`,
    `${x - ux * size - px * halfW},${y - uy * size - py * halfW}`,
  ].join(' ')

  return <polygon points={points} fill="#1e293b" stroke="#1e293b" strokeWidth={1} />
}

function ClassBoxSVG({ cls, dimmed }: { cls: ClassBox; dimmed: boolean }) {
  const h = boxHeight(cls)
  const attrY = cls.y + BOX_HEADER_H + SECTION_PAD
  const methY = attrY + cls.attributes.length * LINE_H + SECTION_PAD

  return (
    <g opacity={dimmed ? 0.2 : 1}>
      {/* Box background */}
      <rect
        x={cls.x}
        y={cls.y}
        width={BOX_W}
        height={h}
        rx={6}
        fill="white"
        stroke="#1e293b"
        strokeWidth={2}
      />
      {/* Header background */}
      <rect
        x={cls.x}
        y={cls.y}
        width={BOX_W}
        height={BOX_HEADER_H}
        rx={6}
        fill="#f1f5f9"
        stroke="#1e293b"
        strokeWidth={2}
      />
      {/* Fix bottom corners of header */}
      <rect
        x={cls.x + 1}
        y={cls.y + BOX_HEADER_H - 8}
        width={BOX_W - 2}
        height={10}
        fill="#f1f5f9"
      />
      <line x1={cls.x} y1={cls.y + BOX_HEADER_H} x2={cls.x + BOX_W} y2={cls.y + BOX_HEADER_H} stroke="#1e293b" strokeWidth={2} />
      {/* Class name */}
      <text
        x={cls.x + BOX_W / 2}
        y={cls.y + BOX_HEADER_H / 2 + 5}
        textAnchor="middle"
        fontSize={13}
        fontWeight="bold"
        fill="#1e293b"
      >
        {cls.label}
      </text>
      {/* Attributes */}
      {cls.attributes.map((attr, i) => (
        <text key={`attr-${i}`} x={cls.x + 8} y={attrY + i * LINE_H + 14} fontSize={11} fill="#475569" fontFamily="ui-monospace, monospace">
          {attr}
        </text>
      ))}
      {/* Divider */}
      <line
        x1={cls.x}
        y1={methY - SECTION_PAD / 2}
        x2={cls.x + BOX_W}
        y2={methY - SECTION_PAD / 2}
        stroke="#e2e8f0"
        strokeWidth={1}
      />
      {/* Methods */}
      {cls.methods.map((meth, i) => (
        <text key={`meth-${i}`} x={cls.x + 8} y={methY + i * LINE_H + 14} fontSize={11} fill="#475569" fontFamily="ui-monospace, monospace">
          {meth}
        </text>
      ))}
    </g>
  )
}

function ConnectionSVG({
  conn,
  dimmed,
}: {
  conn: Connection
  dimmed: boolean
}) {
  const fromClass = classes.find((c) => c.id === conn.from)!
  const toClass = classes.find((c) => c.id === conn.to)!
  const { x1, y1, x2, y2 } = getConnectionPoints(fromClass, toClass)

  const dx = x2 - x1
  const dy = y2 - y1

  return (
    <g opacity={dimmed ? 0.15 : 1}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1e293b" strokeWidth={1.5} />

      {conn.type === 'composition' && (
        <DiamondMarker x={x1} y={y1} dx={dx} dy={dy} filled={true} />
      )}
      {conn.type === 'aggregation' && (
        <DiamondMarker x={x1} y={y1} dx={dx} dy={dy} filled={false} />
      )}
      {conn.type === 'association' && (
        <ArrowHead x={x2} y={y2} dx={dx} dy={dy} />
      )}

      {/* Label */}
      <text
        x={(x1 + x2) / 2}
        y={(y1 + y2) / 2 - 8}
        textAnchor="middle"
        fontSize={10}
        fill="#64748b"
        fontStyle="italic"
      >
        {conn.label}
      </text>

      {/* Multiplicities */}
      {conn.fromMultiplicity && (
        <text
          x={x1 + (dx > 0 ? 14 : dx < 0 ? -14 : (dy > 0 ? -14 : 14))}
          y={y1 + (dy > 0 ? 16 : dy < 0 ? -8 : 0)}
          textAnchor="middle"
          fontSize={10}
          fontWeight="bold"
          fill="#1e293b"
        >
          {conn.fromMultiplicity}
        </text>
      )}
      {conn.toMultiplicity && (
        <text
          x={x2 + (dx > 0 ? -14 : dx < 0 ? 14 : (dy > 0 ? -14 : 14))}
          y={y2 + (dy > 0 ? -8 : dy < 0 ? 16 : 0)}
          textAnchor="middle"
          fontSize={10}
          fontWeight="bold"
          fill="#1e293b"
        >
          {conn.toMultiplicity}
        </text>
      )}
    </g>
  )
}

function RelationTypeBadge({ type }: { type: Connection['type'] }) {
  const config = {
    composition: { label: 'Komposition', color: 'bg-red-100 text-red-800 border-red-300' },
    aggregation: { label: 'Aggregation', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    association: { label: 'Assoziation', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  }
  const c = config[type]
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${c.color}`}>
      {c.label}
    </span>
  )
}

export function RelationshipExplorer() {
  const [activeScenario, setActiveScenario] = useState<ScenarioKey | null>(null)

  const deletedIds = activeScenario ? scenarios[activeScenario].deletedIds : []

  const isDeleted = (id: string) => deletedIds.includes(id)
  const isConnectionDimmed = (conn: Connection) => isDeleted(conn.from) || isDeleted(conn.to)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-text mb-2">
          &laquo;Was passiert, wenn...&raquo;-Explorer
        </h3>
        <p className="text-text-light text-sm">
          Klicke auf eine Aktion, um zu sehen, wie sich das Löschen eines Objekts auf verbundene Objekte auswirkt.
          Die Art der Beziehung (Komposition, Aggregation, Assoziation) bestimmt das Verhalten.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-text-light">
        <div className="flex items-center gap-2">
          <svg width="36" height="14" aria-hidden="true">
            <line x1="0" y1="7" x2="36" y2="7" stroke="#1e293b" strokeWidth="1.5" />
            <polygon points="0,7 10,3 10,11" fill="#1e293b" stroke="#1e293b" strokeWidth="1" />
          </svg>
          <span>Komposition (ausgefüllte Raute)</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="36" height="14" aria-hidden="true">
            <line x1="0" y1="7" x2="36" y2="7" stroke="#1e293b" strokeWidth="1.5" />
            <polygon points="0,7 10,3 10,11" fill="white" stroke="#1e293b" strokeWidth="1" />
          </svg>
          <span>Aggregation (leere Raute)</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="36" height="14" aria-hidden="true">
            <line x1="0" y1="7" x2="30" y2="7" stroke="#1e293b" strokeWidth="1.5" />
            <polygon points="36,7 28,3 28,11" fill="#1e293b" stroke="#1e293b" strokeWidth="1" />
          </svg>
          <span>Assoziation (Pfeil)</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3" role="group" aria-label="Lösch-Szenarien">
        {(Object.keys(scenarios) as ScenarioKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActiveScenario(key)}
            disabled={activeScenario === key}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              activeScenario === key
                ? 'bg-error text-white cursor-default'
                : 'bg-white border border-border text-text hover:bg-red-50 hover:border-red-300 hover:text-error'
            }`}
            aria-pressed={activeScenario === key}
          >
            {scenarios[key].title}
          </button>
        ))}
        {activeScenario && (
          <button
            onClick={() => setActiveScenario(null)}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-text hover:bg-surface-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Zurücksetzen
          </button>
        )}
      </div>

      {/* Diagram */}
      <div className="bg-white rounded-xl border border-border p-4 overflow-x-auto">
        <svg
          viewBox="0 0 840 460"
          className="w-full max-w-4xl mx-auto"
          role="img"
          aria-label="Klassendiagramm mit Beziehungen zwischen Bestellung, Bestellposition, Produkt, Kunde und Warenkorb"
        >
          {/* Connections first (behind boxes) */}
          {connections.map((conn, i) => (
            <ConnectionSVG key={i} conn={conn} dimmed={isConnectionDimmed(conn)} />
          ))}

          {/* Class boxes with animation */}
          {classes.map((cls) => {
            const deleted = isDeleted(cls.id)
            return (
              <g key={cls.id}>
                {/* Deleted indicator */}
                <AnimatePresence>
                  {deleted && (
                    <motion.g
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* Red X overlay */}
                      <line
                        x1={cls.x + 10}
                        y1={cls.y + 10}
                        x2={cls.x + BOX_W - 10}
                        y2={cls.y + boxHeight(cls) - 10}
                        stroke="#dc2626"
                        strokeWidth={3}
                        opacity={0.6}
                      />
                      <line
                        x1={cls.x + BOX_W - 10}
                        y1={cls.y + 10}
                        x2={cls.x + 10}
                        y2={cls.y + boxHeight(cls) - 10}
                        stroke="#dc2626"
                        strokeWidth={3}
                        opacity={0.6}
                      />
                    </motion.g>
                  )}
                </AnimatePresence>
                <ClassBoxSVG cls={cls} dimmed={deleted} />
              </g>
            )
          })}

        </svg>
      </div>

      {/* Explanation */}
      <AnimatePresence mode="wait">
        {activeScenario && (
          <motion.div
            key={activeScenario}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border-2 border-primary/30 bg-blue-50 p-5"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-text mb-2">{scenarios[activeScenario].title}</p>
                <p className="text-sm text-text-light leading-relaxed">
                  {scenarios[activeScenario].explanation}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {deletedIds.map((id) => {
                    const cls = classes.find((c) => c.id === id)!
                    return (
                      <span key={id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-medium">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {cls.label} gelöscht
                      </span>
                    )
                  })}
                  {classes
                    .filter((c) => !deletedIds.includes(c.id))
                    .filter((c) => {
                      // Show surviving classes that were connected to deleted ones
                      return connections.some(
                        (conn) =>
                          (conn.from === c.id && deletedIds.includes(conn.to)) ||
                          (conn.to === c.id && deletedIds.includes(conn.from))
                      )
                    })
                    .map((cls) => (
                      <span key={cls.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-medium">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {cls.label} bleibt erhalten
                      </span>
                    ))}
                </div>
                {/* Relationship type badges */}
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-blue-200">
                  <span className="text-xs text-text-light mr-1">Betroffene Beziehungstypen:</span>
                  {[...new Set(
                    connections
                      .filter((c) => deletedIds.includes(c.from) || deletedIds.includes(c.to))
                      .map((c) => c.type)
                  )].map((type) => (
                    <RelationTypeBadge key={type} type={type} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="bg-surface-dark">
              <th className="text-left px-4 py-2 font-semibold text-text" scope="col">Beziehungstyp</th>
              <th className="text-left px-4 py-2 font-semibold text-text" scope="col">Verhalten beim Löschen</th>
              <th className="text-left px-4 py-2 font-semibold text-text" scope="col">Beispiel</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="px-4 py-2"><RelationTypeBadge type="composition" /></td>
              <td className="px-4 py-2 text-text-light">Teile werden <strong className="text-error">mitgelöscht</strong></td>
              <td className="px-4 py-2 text-text-light">Bestellung &rarr; Bestellposition</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-4 py-2"><RelationTypeBadge type="aggregation" /></td>
              <td className="px-4 py-2 text-text-light">Teile <strong className="text-success">bleiben erhalten</strong></td>
              <td className="px-4 py-2 text-text-light">Warenkorb &rarr; Produkt</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-4 py-2"><RelationTypeBadge type="association" /></td>
              <td className="px-4 py-2 text-text-light">Objekte sind <strong className="text-primary">unabhängig</strong></td>
              <td className="px-4 py-2 text-text-light">Bestellung &rarr; Kunde</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
