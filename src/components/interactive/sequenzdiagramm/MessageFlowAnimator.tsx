import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Lifeline {
  id: string
  label: string
  x: number
}

type MessageKind = 'sync' | 'return' | 'self' | 'self-return'

interface Message {
  id: number
  from: string
  to: string
  label: string
  kind: MessageKind
  description: string
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const LIFELINES: Lifeline[] = [
  { id: 'kunde', label: 'Kunde', x: 100 },
  { id: 'webshop', label: 'WebShop', x: 300 },
  { id: 'produktservice', label: 'ProduktService', x: 500 },
  { id: 'datenbank', label: 'Datenbank', x: 700 },
]

const MESSAGES: Message[] = [
  {
    id: 1,
    from: 'kunde',
    to: 'webshop',
    label: 'sucheProdukt()',
    kind: 'sync',
    description:
      'Der Kunde sendet eine synchrone Nachricht an den WebShop, um nach einem Produkt zu suchen.',
  },
  {
    id: 2,
    from: 'webshop',
    to: 'produktservice',
    label: 'findeProdukte()',
    kind: 'sync',
    description:
      'Der WebShop leitet die Anfrage als synchrone Nachricht an den ProduktService weiter.',
  },
  {
    id: 3,
    from: 'produktservice',
    to: 'datenbank',
    label: 'query()',
    kind: 'sync',
    description:
      'Der ProduktService sendet eine Datenbankabfrage an die Datenbank.',
  },
  {
    id: 4,
    from: 'datenbank',
    to: 'produktservice',
    label: 'resultSet',
    kind: 'return',
    description:
      'Die Datenbank liefert das Ergebnis als Rueckantwort (gestrichelte Linie) an den ProduktService zurueck.',
  },
  {
    id: 5,
    from: 'produktservice',
    to: 'produktservice',
    label: 'konvertiere()',
    kind: 'self',
    description:
      'Der ProduktService ruft sich selbst auf (Selbstaufruf), um die Rohdaten in Produktobjekte umzuwandeln.',
  },
  {
    id: 6,
    from: 'produktservice',
    to: 'produktservice',
    label: 'produktListe',
    kind: 'self-return',
    description:
      'Der Selbstaufruf gibt die konvertierte Produktliste als Rueckantwort zurueck (gestrichelter Pfeil auf eigener Lebenslinie).',
  },
  {
    id: 7,
    from: 'produktservice',
    to: 'webshop',
    label: 'produktListe',
    kind: 'return',
    description:
      'Der ProduktService sendet die konvertierte Produktliste als Rueckantwort an den WebShop.',
  },
  {
    id: 8,
    from: 'webshop',
    to: 'kunde',
    label: 'produktListe',
    kind: 'return',
    description:
      'Der WebShop liefert die Produktliste als Rueckantwort an den Kunden zurueck.',
  },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const COLOR: Record<MessageKind, string> = {
  sync: '#3b82f6',
  return: '#22c55e',
  self: '#f59e0b',
  'self-return': '#22c55e',
}

const HEADER_H = 40
const HEADER_Y = 20
const MSG_START_Y = HEADER_Y + HEADER_H + 30
const MSG_SPACING = 55
const ACTIVATION_W = 12
const DOT_R = 6

function lifelineX(id: string): number {
  return LIFELINES.find((l) => l.id === id)!.x
}

function msgY(index: number): number {
  return MSG_START_Y + index * MSG_SPACING
}

/**
 * Which lifelines have an active activation bar at a given step.
 * A lifeline becomes active when it receives a sync/self message
 * and stays active until its corresponding return is sent.
 */
function activationRanges(): { id: string; startStep: number; endStep: number }[] {
  const ranges: { id: string; startStep: number; endStep: number }[] = []

  // kunde is active from step 0 (initiator) until step 7 (receives return)
  ranges.push({ id: 'kunde', startStep: 0, endStep: 7 })
  // webshop: receives at step 0, returns at step 7
  ranges.push({ id: 'webshop', startStep: 0, endStep: 7 })
  // produktservice: receives at step 1, returns at step 6
  ranges.push({ id: 'produktservice', startStep: 1, endStep: 6 })
  // datenbank: receives at step 2, returns at step 3
  ranges.push({ id: 'datenbank', startStep: 2, endStep: 3 })
  // produktservice self-call bar: active during self-call and self-return
  ranges.push({ id: 'produktservice_self', startStep: 4, endStep: 5 })

  return ranges
}

const RANGES = activationRanges()

/* ------------------------------------------------------------------ */
/*  SVG sub-components                                                 */
/* ------------------------------------------------------------------ */

function ArrowHead({
  x,
  y,
  direction,
  filled,
  color,
}: {
  x: number
  y: number
  direction: 'right' | 'left'
  filled: boolean
  color: string
}) {
  const sign = direction === 'right' ? -1 : 1
  const points = `${x},${y} ${x + sign * 10},${y - 5} ${x + sign * 10},${y + 5}`
  return filled ? (
    <polygon points={points} fill={color} />
  ) : (
    <polyline
      points={`${x + sign * 10},${y - 5} ${x},${y} ${x + sign * 10},${y + 5}`}
      fill="none"
      stroke={color}
      strokeWidth={2}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function MessageFlowAnimator() {
  const [currentStep, setCurrentStep] = useState(-1) // -1 = not started
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const totalSteps = MESSAGES.length

  /* Auto-play logic */
  const scheduleNext = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setCurrentStep((prev) => {
        const next = prev + 1
        if (next >= totalSteps) {
          setIsPlaying(false)
          return prev
        }
        return next
      })
    }, 1200 / speed)
  }, [speed, totalSteps])

  useEffect(() => {
    if (isPlaying && currentStep < totalSteps - 1) {
      scheduleNext()
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isPlaying, currentStep, scheduleNext, totalSteps])

  /* Controls */
  const play = () => {
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(0)
    } else if (currentStep < 0) {
      setCurrentStep(0)
    }
    setIsPlaying(true)
  }

  const pause = () => setIsPlaying(false)

  const stepForward = () => {
    setIsPlaying(false)
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }

  const stepBackward = () => {
    setIsPlaying(false)
    setCurrentStep((prev) => Math.max(prev - 1, -1))
  }

  const reset = () => {
    setIsPlaying(false)
    setCurrentStep(-1)
  }

  /* Derived */
  const svgHeight = MSG_START_Y + totalSteps * MSG_SPACING + 40
  const lifelineEnd = svgHeight - 10

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <h3 className="text-xl font-bold text-text mb-1">
          Animierter Nachrichtenfluss
        </h3>
        <p className="text-sm text-text-light">
          TechStore-Szenario: Ein Kunde sucht nach einem Produkt im Online-Shop.
          Beobachte den Nachrichtenfluss zwischen den Objekten.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-text-light">
        <span className="flex items-center gap-1">
          <svg width="30" height="10">
            <line x1="0" y1="5" x2="30" y2="5" stroke={COLOR.sync} strokeWidth={2} />
          </svg>
          Synchrone Nachricht
        </span>
        <span className="flex items-center gap-1">
          <svg width="30" height="10">
            <line x1="0" y1="5" x2="30" y2="5" stroke={COLOR.return} strokeWidth={2} strokeDasharray="6 3" />
          </svg>
          Rueckantwort
        </span>
        <span className="flex items-center gap-1">
          <svg width="30" height="10">
            <line x1="0" y1="5" x2="30" y2="5" stroke={COLOR.self} strokeWidth={2} />
          </svg>
          Selbstaufruf
        </span>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Play / Pause */}
        {isPlaying ? (
          <button
            onClick={pause}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-warning-light text-white text-sm font-medium hover:bg-warning transition-colors focus:outline-none focus:ring-2 focus:ring-warning focus:ring-offset-2"
            aria-label="Pause"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <rect x="5" y="3" width="4" height="14" rx="1" />
              <rect x="11" y="3" width="4" height="14" rx="1" />
            </svg>
            Pause
          </button>
        ) : (
          <button
            onClick={play}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Abspielen"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <polygon points="5,3 17,10 5,17" />
            </svg>
            Abspielen
          </button>
        )}

        {/* Step backward */}
        <button
          onClick={stepBackward}
          disabled={currentStep < 0}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-text text-sm hover:bg-surface-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Schritt zurueck"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zurueck
        </button>

        {/* Step forward */}
        <button
          onClick={stepForward}
          disabled={currentStep >= totalSteps - 1}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-text text-sm hover:bg-surface-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Schritt vor"
        >
          Vor
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Reset */}
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-text text-sm hover:bg-surface-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Zuruecksetzen"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0115.4-5.4M20 15a9 9 0 01-15.4 5.4" />
          </svg>
          Zuruecksetzen
        </button>

        {/* Speed control */}
        <div className="flex items-center gap-2 ml-auto">
          <label htmlFor="speed-slider" className="text-xs text-text-light whitespace-nowrap">
            Geschwindigkeit:
          </label>
          <input
            id="speed-slider"
            type="range"
            min={0.5}
            max={2}
            step={0.5}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-20 accent-primary"
            aria-label="Animationsgeschwindigkeit"
          />
          <span className="text-xs font-mono text-text-light w-8">{speed}x</span>
        </div>
      </div>

      {/* Step progress bar */}
      <div className="flex gap-1">
        {MESSAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIsPlaying(false)
              setCurrentStep(i)
            }}
            className={`h-2 flex-1 rounded-full transition-colors ${
              i <= currentStep
                ? i === currentStep
                  ? 'bg-primary'
                  : 'bg-primary/40'
                : 'bg-surface-dark'
            }`}
            aria-label={`Springe zu Schritt ${i + 1}`}
          />
        ))}
      </div>

      {/* SVG Diagram */}
      <div className="bg-white rounded-lg border border-border p-2 overflow-x-auto">
        <svg
          viewBox={`0 0 800 ${svgHeight}`}
          preserveAspectRatio="xMidYMin meet"
          className="w-full"
          role="img"
          aria-label="Animiertes Sequenzdiagramm: Produktsuche im TechStore"
        >
          <defs>
            {/* Marker definitions for arrows are inlined per-message for color */}
          </defs>

          {/* ── Lifeline headers ── */}
          {LIFELINES.map((ll) => (
            <g key={ll.id}>
              <rect
                x={ll.x - 55}
                y={HEADER_Y}
                width={110}
                height={HEADER_H}
                rx={6}
                fill="#f1f5f9"
                stroke="#1e293b"
                strokeWidth={1.5}
              />
              <text
                x={ll.x}
                y={HEADER_Y + HEADER_H / 2 + 5}
                textAnchor="middle"
                fontSize={13}
                fontWeight="bold"
                fill="#1e293b"
              >
                {ll.label}
              </text>
              {/* Dashed lifeline */}
              <line
                x1={ll.x}
                y1={HEADER_Y + HEADER_H}
                x2={ll.x}
                y2={lifelineEnd}
                stroke="#94a3b8"
                strokeWidth={1}
                strokeDasharray="6 4"
              />
            </g>
          ))}

          {/* ── Activation bars ── */}
          {RANGES.map((range, ri) => {
            const isSelf = range.id.endsWith('_self')
            const baseId = isSelf ? range.id.replace('_self', '') : range.id
            const x = lifelineX(baseId)
            const offsetX = isSelf ? ACTIVATION_W / 2 + 2 : 0

            const top = msgY(range.startStep) - 8
            const bottom = msgY(range.endStep) + 8
            const height = bottom - top

            // Only show if we've reached the startStep
            if (currentStep < range.startStep) return null

            const visibleBottom = msgY(Math.min(currentStep, range.endStep)) + 8
            const visibleHeight = Math.max(0, visibleBottom - top)

            return (
              <motion.rect
                key={ri}
                x={x - ACTIVATION_W / 2 + offsetX}
                y={top}
                width={ACTIVATION_W}
                height={visibleHeight}
                rx={2}
                fill={
                  currentStep >= range.startStep && currentStep <= range.endStep
                    ? '#dbeafe'
                    : '#e2e8f0'
                }
                stroke={
                  currentStep >= range.startStep && currentStep <= range.endStep
                    ? '#3b82f6'
                    : '#94a3b8'
                }
                strokeWidth={1}
                initial={{ height: 0 }}
                animate={{ height: visibleHeight }}
                transition={{ duration: 0.3 }}
              />
            )
          })}

          {/* ── Messages ── */}
          {MESSAGES.map((msg, i) => {
            if (i > currentStep) return null

            const y = msgY(i)
            const isCurrent = i === currentStep
            const opacity = isCurrent ? 1 : 0.45
            const color = COLOR[msg.kind]
            const isDashed = msg.kind === 'return'
            const isFilled = msg.kind === 'sync'

            /* Self-call or self-return */
            if (msg.kind === 'self' || msg.kind === 'self-return') {
              const x = lifelineX(msg.from)
              const loopW = 40
              const loopH = 25
              const isSelfReturn = msg.kind === 'self-return'

              return (
                <motion.g
                  key={msg.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Self-loop path */}
                  <path
                    d={`M ${x + ACTIVATION_W / 2} ${y - 8}
                        h ${loopW}
                        v ${loopH}
                        h ${-loopW}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    strokeDasharray={isSelfReturn ? '8 4' : undefined}
                  />
                  <ArrowHead
                    x={x + ACTIVATION_W / 2}
                    y={y - 8 + loopH}
                    direction="left"
                    filled={!isSelfReturn}
                    color={color}
                  />
                  <text
                    x={x + ACTIVATION_W / 2 + loopW + 5}
                    y={y - 8 + loopH / 2 + 4}
                    fontSize={11}
                    fill={color}
                    fontWeight={isCurrent ? 'bold' : 'normal'}
                  >
                    {msg.label}
                  </text>

                  {/* Animated dot */}
                  {isCurrent && (
                    <motion.circle
                      r={DOT_R}
                      fill={color}
                      initial={{ offsetDistance: '0%' }}
                      animate={{
                        cx: [x + ACTIVATION_W / 2, x + ACTIVATION_W / 2 + loopW, x + ACTIVATION_W / 2 + loopW, x + ACTIVATION_W / 2],
                        cy: [y - 8, y - 8, y - 8 + loopH, y - 8 + loopH],
                      }}
                      transition={{ duration: 0.8 / speed, ease: 'easeInOut' }}
                    />
                  )}
                </motion.g>
              )
            }

            /* Normal message */
            const fromX = lifelineX(msg.from)
            const toX = lifelineX(msg.to)
            const goingRight = toX > fromX
            const x1 = fromX + (goingRight ? ACTIVATION_W / 2 : -ACTIVATION_W / 2)
            const x2 = toX + (goingRight ? -ACTIVATION_W / 2 : ACTIVATION_W / 2)
            const labelX = (x1 + x2) / 2

            return (
              <motion.g
                key={msg.id}
                initial={{ opacity: 0 }}
                animate={{ opacity }}
                transition={{ duration: 0.3 }}
              >
                {/* Message line */}
                <line
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke={color}
                  strokeWidth={2}
                  strokeDasharray={isDashed ? '8 4' : undefined}
                />

                {/* Arrow head */}
                <ArrowHead
                  x={x2}
                  y={y}
                  direction={goingRight ? 'right' : 'left'}
                  filled={isFilled}
                  color={color}
                />

                {/* Label */}
                <text
                  x={labelX}
                  y={y - 8}
                  textAnchor="middle"
                  fontSize={11}
                  fill={color}
                  fontWeight={isCurrent ? 'bold' : 'normal'}
                >
                  {msg.label}
                </text>

                {/* Animated travelling dot */}
                {isCurrent && (
                  <motion.circle
                    r={DOT_R}
                    fill={color}
                    filter="drop-shadow(0 0 3px rgba(0,0,0,0.3))"
                    initial={{ cx: x1, cy: y }}
                    animate={{ cx: x2, cy: y }}
                    transition={{ duration: 0.6 / speed, ease: 'easeInOut' }}
                  />
                )}
              </motion.g>
            )
          })}
        </svg>
      </div>

      {/* Description panel */}
      <div className="min-h-[56px] bg-surface rounded-lg border border-border p-3">
        <AnimatePresence mode="wait">
          {currentStep >= 0 && currentStep < totalSteps ? (
            <motion.p
              key={currentStep}
              className="text-sm text-text leading-relaxed"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-semibold text-primary">
                Schritt {currentStep + 1}/{totalSteps}:
              </span>{' '}
              {MESSAGES[currentStep].description}
            </motion.p>
          ) : (
            <motion.p
              key="idle"
              className="text-sm text-text-light italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Druecke &quot;Abspielen&quot; oder &quot;Schritt vor&quot;, um die Animation zu starten.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
