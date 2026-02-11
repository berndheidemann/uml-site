import type { JSX } from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Data ──

type ActorId = 'kunde' | 'mitarbeiter' | 'admin' | 'zahlungssystem'

interface UseCaseData {
  id: string
  label: string
  cx: number
  cy: number
}

interface ActorData {
  id: ActorId
  label: string
  description: string
  color: string
  colorLight: string
  colorBorder: string
  useCases: string[]           // ids of own use cases
  inheritedUseCases?: string[] // ids inherited from parent
  side: 'left' | 'right'
  figureY: number
}

const useCases: UseCaseData[] = [
  { id: 'suchen',     label: 'Produkt suchen',        cx: 400, cy: 70  },
  { id: 'bestellen',  label: 'Produkt bestellen',      cx: 400, cy: 140 },
  { id: 'anmelden',   label: 'Anmelden',               cx: 400, cy: 210 },
  { id: 'profil',     label: 'Profil bearbeiten',      cx: 400, cy: 280 },
  { id: 'stornieren', label: 'Bestellung stornieren',  cx: 400, cy: 350 },
  { id: 'verwalten',  label: 'Nutzer verwalten',       cx: 400, cy: 420 },
  { id: 'zahlung',    label: 'Zahlung durchfuehren',    cx: 400, cy: 490 },
]

const actors: ActorData[] = [
  {
    id: 'kunde',
    label: 'Kunde',
    description: 'Endkunde des Online-Shops',
    color: '#3b82f6',
    colorLight: '#dbeafe',
    colorBorder: '#93c5fd',
    useCases: ['suchen', 'bestellen', 'anmelden', 'profil'],
    side: 'left',
    figureY: 140,
  },
  {
    id: 'mitarbeiter',
    label: 'Mitarbeiter',
    description: 'Interner Mitarbeiter',
    color: '#22c55e',
    colorLight: '#dcfce7',
    colorBorder: '#86efac',
    useCases: ['anmelden', 'profil', 'stornieren'],
    side: 'right',
    figureY: 210,
  },
  {
    id: 'admin',
    label: 'Admin',
    description: 'Systemadministrator, erbt von Mitarbeiter',
    color: '#f59e0b',
    colorLight: '#fef3c7',
    colorBorder: '#fcd34d',
    useCases: ['verwalten'],
    inheritedUseCases: ['anmelden', 'profil', 'stornieren'],
    side: 'right',
    figureY: 390,
  },
  {
    id: 'zahlungssystem',
    label: 'Zahlungssystem',
    description: 'Externer Zahlungsdienstleister',
    color: '#8b5cf6',
    colorLight: '#ede9fe',
    colorBorder: '#c4b5fd',
    useCases: ['zahlung'],
    side: 'right',
    figureY: 490,
  },
]

// ── SVG Helpers ──

const SVG_W = 700
const SVG_H = 560
const SYS_X = 250
const SYS_Y = 30
const SYS_W = 300
const SYS_H = 500
const ELLIPSE_RX = 110
const ELLIPSE_RY = 24

function StickFigure({
  x,
  y,
  label,
  color,
  active,
}: {
  x: number
  y: number
  label: string
  color: string
  active: boolean
}) {
  const headR = 10
  const bodyLen = 24
  const armSpan = 16
  const legLen = 18

  return (
    <g>
      {/* Head */}
      <circle
        cx={x}
        cy={y}
        r={headR}
        fill={active ? color : 'white'}
        stroke={active ? color : '#64748b'}
        strokeWidth={active ? 2.5 : 1.5}
      />
      {/* Body */}
      <line
        x1={x}
        y1={y + headR}
        x2={x}
        y2={y + headR + bodyLen}
        stroke={active ? color : '#64748b'}
        strokeWidth={active ? 2.5 : 1.5}
      />
      {/* Arms */}
      <line
        x1={x - armSpan}
        y1={y + headR + 10}
        x2={x + armSpan}
        y2={y + headR + 10}
        stroke={active ? color : '#64748b'}
        strokeWidth={active ? 2.5 : 1.5}
      />
      {/* Left leg */}
      <line
        x1={x}
        y1={y + headR + bodyLen}
        x2={x - armSpan * 0.7}
        y2={y + headR + bodyLen + legLen}
        stroke={active ? color : '#64748b'}
        strokeWidth={active ? 2.5 : 1.5}
      />
      {/* Right leg */}
      <line
        x1={x}
        y1={y + headR + bodyLen}
        x2={x + armSpan * 0.7}
        y2={y + headR + bodyLen + legLen}
        stroke={active ? color : '#64748b'}
        strokeWidth={active ? 2.5 : 1.5}
      />
      {/* Label */}
      <text
        x={x}
        y={y + headR + bodyLen + legLen + 16}
        textAnchor="middle"
        fontSize={11}
        fontWeight={active ? 'bold' : 'normal'}
        fill={active ? color : '#1e293b'}
      >
        {label}
      </text>
    </g>
  )
}

function InheritanceArrow({
  fromX,
  fromY,
  toX,
  toY,
  color,
  active,
}: {
  fromX: number
  fromY: number
  toX: number
  toY: number
  color: string
  active: boolean
}) {
  const headSize = 8
  const dx = toX - fromX
  const dy = toY - fromY
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len === 0) return null
  const ux = dx / len
  const uy = dy / len
  const px = -uy
  const py = ux

  // End point offset by the arrow head so arrowhead sits at target
  const endX = toX - ux * headSize
  const endY = toY - uy * headSize

  const points = [
    `${toX},${toY}`,
    `${toX - ux * headSize * 1.5 + px * headSize},${toY - uy * headSize * 1.5 + py * headSize}`,
    `${toX - ux * headSize * 1.5 - px * headSize},${toY - uy * headSize * 1.5 - py * headSize}`,
  ].join(' ')

  return (
    <g>
      <line
        x1={fromX}
        y1={fromY}
        x2={endX}
        y2={endY}
        stroke={active ? color : '#94a3b8'}
        strokeWidth={active ? 2 : 1.5}
        strokeDasharray={active ? undefined : '4 3'}
      />
      <polygon
        points={points}
        fill="white"
        stroke={active ? color : '#94a3b8'}
        strokeWidth={active ? 2 : 1.5}
      />
    </g>
  )
}

// ── Icons for persona cards ──

function KundeIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
    </svg>
  )
}

function MitarbeiterIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

function AdminIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function ZahlungIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  )
}

const iconMap: Record<ActorId, (props: { color: string }) => JSX.Element> = {
  kunde: KundeIcon,
  mitarbeiter: MitarbeiterIcon,
  admin: AdminIcon,
  zahlungssystem: ZahlungIcon,
}

// ── Main Component ──

export function PersonaCards() {
  const [selectedActor, setSelectedActor] = useState<ActorId | null>(null)

  const activeActor = selectedActor ? actors.find((a) => a.id === selectedActor)! : null

  // All use case ids relevant to the selected actor (own + inherited)
  const activeUseCaseIds = activeActor
    ? [...activeActor.useCases, ...(activeActor.inheritedUseCases ?? [])]
    : []

  const inheritedIds = activeActor?.inheritedUseCases ?? []

  function getUseCaseFill(ucId: string): string {
    if (!activeActor) return 'white'
    if (activeActor.useCases.includes(ucId)) return activeActor.colorLight
    if (inheritedIds.includes(ucId)) {
      // lighter shade for inherited: mix with more white
      return activeActor.colorLight + '80' // with alpha
    }
    return 'white'
  }

  function getUseCaseStroke(ucId: string): string {
    if (!activeActor) return '#64748b'
    if (activeUseCaseIds.includes(ucId)) return activeActor.color
    return '#cbd5e1'
  }

  function getUseCaseOpacity(ucId: string): number {
    if (!activeActor) return 1
    if (activeUseCaseIds.includes(ucId)) return 1
    return 0.25
  }

  function getConnectionStroke(actorData: ActorData): string {
    if (!activeActor) return '#94a3b8'
    if (actorData.id === activeActor.id) return activeActor.color
    return '#e2e8f0'
  }

  function getConnectionWidth(actorData: ActorData): number {
    if (!activeActor) return 1
    if (actorData.id === activeActor.id) return 2.5
    return 0.5
  }

  function getConnectionOpacity(actorData: ActorData): number {
    if (!activeActor) return 0.7
    if (actorData.id === activeActor.id) return 1
    return 0.15
  }

  function getFigureActive(actorData: ActorData): boolean {
    if (!activeActor) return false
    return actorData.id === activeActor.id
  }

  // Actor figure positions
  function getActorFigureX(actor: ActorData): number {
    return actor.side === 'left' ? 80 : 620
  }

  // Connections: from actor figure to use case ellipse edge
  function getConnectionEndpoints(actor: ActorData, uc: UseCaseData) {
    const ax = getActorFigureX(actor)
    const ay = actor.figureY + 10 + 12 // roughly torso center
    // Edge of ellipse closest to actor
    const dx = ax - uc.cx
    const ecx = uc.cx + (dx > 0 ? ELLIPSE_RX : -ELLIPSE_RX)
    return { x1: ax, y1: ay, x2: ecx, y2: uc.cy }
  }

  function handleCardClick(id: ActorId) {
    setSelectedActor((prev) => (prev === id ? null : id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-text mb-2">
          Persona-Karten: Akteure und ihre Use Cases
        </h3>
        <p className="text-text-light text-sm">
          Klicke auf eine Persona-Karte, um die zugehoerigen Use Cases im Diagramm
          hervorzuheben. Beim Admin werden geerbte Use Cases gesondert markiert.
        </p>
      </div>

      {/* SVG Use Case Diagram */}
      <div className="bg-white rounded-xl border border-border p-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full max-w-4xl mx-auto"
          role="img"
          aria-label="Use-Case-Diagramm des TechStore-Systems mit Akteuren und Anwendungsfaellen"
        >
          {/* System boundary */}
          <rect
            x={SYS_X}
            y={SYS_Y}
            width={SYS_W}
            height={SYS_H}
            rx={12}
            fill="#f8fafc"
            stroke="#1e293b"
            strokeWidth={2}
          />
          <text
            x={SYS_X + SYS_W / 2}
            y={SYS_Y + 22}
            textAnchor="middle"
            fontSize={14}
            fontWeight="bold"
            fill="#1e293b"
          >
            TechStore-System
          </text>

          {/* Connection lines (drawn behind everything else) */}
          {actors.map((actor) => {
            const allUcIds = [...actor.useCases, ...(actor.inheritedUseCases ?? [])]
            return allUcIds.map((ucId) => {
              const uc = useCases.find((u) => u.id === ucId)
              if (!uc) return null
              const { x1, y1, x2, y2 } = getConnectionEndpoints(actor, uc)
              return (
                <motion.line
                  key={`${actor.id}-${ucId}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  animate={{
                    stroke: getConnectionStroke(actor),
                    strokeWidth: getConnectionWidth(actor),
                    opacity: getConnectionOpacity(actor),
                  }}
                  transition={{ duration: 0.35 }}
                />
              )
            })
          })}

          {/* Inheritance arrow: Admin -> Mitarbeiter */}
          <InheritanceArrow
            fromX={620}
            fromY={390}
            toX={620}
            toY={210 + 10 + 24 + 18 + 16}
            color={activeActor?.id === 'admin' ? '#f59e0b' : '#94a3b8'}
            active={activeActor?.id === 'admin'}
          />

          {/* Use case ellipses */}
          {useCases.map((uc) => {
            const isInherited = activeActor && inheritedIds.includes(uc.id) && !activeActor.useCases.includes(uc.id)
            return (
              <g key={uc.id}>
                <motion.ellipse
                  cx={uc.cx}
                  cy={uc.cy}
                  rx={ELLIPSE_RX}
                  ry={ELLIPSE_RY}
                  animate={{
                    fill: getUseCaseFill(uc.id),
                    stroke: getUseCaseStroke(uc.id),
                    opacity: getUseCaseOpacity(uc.id),
                    strokeWidth: activeActor && activeUseCaseIds.includes(uc.id) ? 2.5 : 1.5,
                  }}
                  transition={{ duration: 0.35 }}
                />
                <motion.text
                  x={uc.cx}
                  y={uc.cy + 4}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#1e293b"
                  animate={{ opacity: getUseCaseOpacity(uc.id) }}
                  transition={{ duration: 0.35 }}
                >
                  {uc.label}
                </motion.text>
                {/* Inherited label */}
                <AnimatePresence>
                  {isInherited && (
                    <motion.text
                      x={uc.cx}
                      y={uc.cy + 18}
                      textAnchor="middle"
                      fontSize={9}
                      fontStyle="italic"
                      fill={activeActor!.color}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.8 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      (geerbt)
                    </motion.text>
                  )}
                </AnimatePresence>
              </g>
            )
          })}

          {/* Actor stick figures */}
          {actors.map((actor) => (
            <StickFigure
              key={actor.id}
              x={getActorFigureX(actor)}
              y={actor.figureY}
              label={actor.label}
              color={actor.color}
              active={getFigureActive(actor)}
            />
          ))}
        </svg>
      </div>

      {/* Persona Cards */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        role="group"
        aria-label="Persona-Karten der Akteure"
      >
        {actors.map((actor) => {
          const isSelected = selectedActor === actor.id
          const Icon = iconMap[actor.id]
          const allUcLabels = [
            ...actor.useCases.map((id) => ({
              label: useCases.find((u) => u.id === id)!.label,
              inherited: false,
            })),
            ...(actor.inheritedUseCases ?? []).map((id) => ({
              label: useCases.find((u) => u.id === id)!.label,
              inherited: true,
            })),
          ]

          return (
            <motion.button
              key={actor.id}
              onClick={() => handleCardClick(actor.id)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              aria-pressed={isSelected}
              aria-label={`Persona ${actor.label}: ${actor.description}`}
              className="text-left rounded-xl border-2 p-4 transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white cursor-pointer"
              style={{
                borderColor: isSelected ? actor.color : '#e2e8f0',
                boxShadow: isSelected
                  ? `0 4px 20px ${actor.color}30`
                  : '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: isSelected ? actor.colorLight : '#f1f5f9' }}
                >
                  <Icon color={isSelected ? actor.color : '#64748b'} />
                </div>
                <div>
                  <span
                    className="text-sm font-bold block"
                    style={{ color: isSelected ? actor.color : '#1e293b' }}
                  >
                    {actor.label}
                  </span>
                  <span className="text-xs text-text-light">{actor.description}</span>
                </div>
              </div>

              {/* Use Case list */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text-light">
                  Use Cases
                </span>
                <ul className="space-y-1">
                  {allUcLabels.map((uc, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-xs text-text-light">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: uc.inherited
                            ? actor.color + '60'
                            : actor.color,
                        }}
                      />
                      <span>
                        {uc.label}
                        {uc.inherited && (
                          <span
                            className="ml-1 text-[10px] italic"
                            style={{ color: actor.color }}
                          >
                            (geerbt)
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Selection indicator */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-3 pt-2 border-t overflow-hidden"
                    style={{ borderColor: actor.colorBorder }}
                  >
                    <span
                      className="text-[10px] font-semibold"
                      style={{ color: actor.color }}
                    >
                      Ausgewaehlt -- Klicke erneut zum Abwaehlen
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      {/* Legend for inheritance */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-text-light bg-surface rounded-lg px-4 py-3 border border-border">
        <span className="font-semibold text-text">Legende:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span>Eigener Use Case</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400/40" />
          <span>Geerbter Use Case (Vererbung)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="24" height="14" aria-hidden="true">
            <line x1="0" y1="7" x2="14" y2="7" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
            <polygon points="24,7 16,3 16,11" fill="white" stroke="#94a3b8" strokeWidth="1.5" />
          </svg>
          <span>Vererbungspfeil (offene Pfeilspitze)</span>
        </div>
      </div>
    </div>
  )
}
