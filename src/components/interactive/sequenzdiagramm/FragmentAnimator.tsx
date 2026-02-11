import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface IterationData {
  name: string
  menge: number
  success: boolean
}

interface StepDef {
  label: string
  description: string
  iteration: number // 0 = none, 1-3
  showInitial: boolean
  showLoop: boolean
  showCheck: boolean
  showSelfCall: boolean
  showResult: boolean
  showFinal: boolean
  altBranch: 'if' | 'else' | null
  resultCount: number
}

interface ArtikelResult {
  name: string
  status: string
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const ORDER_DATA = {
  bestellId: 'B-2024-42',
  artikel: [
    { id: 1, name: 'Laptop', menge: 2 },
    { id: 2, name: 'Maus', menge: 5 },
    { id: 3, name: 'Monitor', menge: 1 },
  ],
}

const ITERATIONS: IterationData[] = [
  { name: 'Laptop', menge: 2, success: true },
  { name: 'Maus', menge: 5, success: false },
  { name: 'Monitor', menge: 1, success: true },
]

const RESULT_ENTRIES: ArtikelResult[] = [
  { name: 'Laptop', status: 'reserviert' },
  { name: 'Maus', status: 'nichtVerfuegbar' },
  { name: 'Monitor', status: 'reserviert' },
]

/* ------------------------------------------------------------------ */
/*  Layout — one loop body, shown once, replayed 3x                   */
/* ------------------------------------------------------------------ */

const HEADER_Y = 15
const HEADER_H = 36
const LIFELINE_TOP = HEADER_Y + HEADER_H
const ACTIVATION_W = 12
const SVG_W = 540

// Vertical positions
const INIT_MSG_Y = LIFELINE_TOP + 38
const LOOP_TOP = LIFELINE_TOP + 60
const PRUEFE_Y = LOOP_TOP + 38
const ALT_TOP = PRUEFE_Y + 20
const RESERVIERE_Y = ALT_TOP + 32
const RESULT_IF_Y = ALT_TOP + 60
const ALT_DIVIDER_Y = ALT_TOP + 72
const RESULT_ELSE_Y = ALT_DIVIDER_Y + 22
const ALT_BOTTOM = ALT_DIVIDER_Y + 42
const LOOP_BOTTOM = ALT_BOTTOM + 14
const FINAL_MSG_Y = LOOP_BOTTOM + 32
const LIFELINE_END = FINAL_MSG_Y + 30
const SVG_H = LIFELINE_END + 15

const PARTICIPANTS = [
  { id: 'kunde', label: 'Kunde', x: 70, isActor: true },
  { id: 'bestellservice', label: 'BestellService', x: 240, isActor: false },
  { id: 'lagerservice', label: 'LagerService', x: 440, isActor: false },
]

function px(id: string): number {
  return PARTICIPANTS.find((p) => p.id === id)!.x
}

const LOOP_X = px('bestellservice') - 70
const LOOP_W = px('lagerservice') - px('bestellservice') + 140
const ALT_X = px('bestellservice') - 50
const ALT_W = px('lagerservice') - px('bestellservice') + 120

/* ------------------------------------------------------------------ */
/*  Steps                                                              */
/* ------------------------------------------------------------------ */

const STEPS: StepDef[] = [
  {
    label: 'Ausgangslage',
    description:
      'Der Kunde moechte seine Bestellung mit 3 Artikeln pruefen lassen. Oben sind die Bestelldaten als JSON zu sehen.',
    iteration: 0, showInitial: false, showLoop: false, showCheck: false,
    showSelfCall: false, showResult: false, showFinal: false, altBranch: null, resultCount: 0,
  },
  {
    label: 'Auftrag senden',
    description:
      'Der Kunde sendet die gesamte Bestellung an den BestellService. Das JSON-Objekt mit allen 3 Artikeln wird uebergeben.',
    iteration: 0, showInitial: true, showLoop: false, showCheck: false,
    showSelfCall: false, showResult: false, showFinal: false, altBranch: null, resultCount: 0,
  },
  {
    label: 'Iteration 1/3: Laptop pruefe',
    description:
      'Die Schleife beginnt. Der BestellService prueft den ersten Artikel: Laptop (Menge 2). Die gleiche Nachricht wird in jeder Iteration an der gleichen Stelle angezeigt — nur der Artikel wechselt.',
    iteration: 1, showInitial: true, showLoop: true, showCheck: true,
    showSelfCall: false, showResult: false, showFinal: false, altBranch: null, resultCount: 0,
  },
  {
    label: 'Iteration 1/3: Laptop reserviert',
    description:
      'Bestand ausreichend (bestand >= menge): Der LagerService reserviert und meldet "reserviert" zurueck. Der obere Bereich des alt-Fragments ist aktiv.',
    iteration: 1, showInitial: true, showLoop: true, showCheck: true,
    showSelfCall: true, showResult: true, showFinal: false, altBranch: 'if', resultCount: 1,
  },
  {
    label: 'Iteration 2/3: Maus pruefe',
    description:
      'Zweite Iteration — der Loop-Body wird erneut durchlaufen, diesmal fuer Maus (Menge 5). Beachte: Das Diagramm zeigt den gleichen Ablauf an derselben Stelle.',
    iteration: 2, showInitial: true, showLoop: true, showCheck: true,
    showSelfCall: false, showResult: false, showFinal: false, altBranch: null, resultCount: 1,
  },
  {
    label: 'Iteration 2/3: Maus nicht verfuegbar',
    description:
      'Bestand nicht ausreichend (bestand < menge): Der LagerService meldet "nichtVerfuegbar". Diesmal ist der else-Bereich aktiv — kein reserviere()-Aufruf.',
    iteration: 2, showInitial: true, showLoop: true, showCheck: true,
    showSelfCall: false, showResult: true, showFinal: false, altBranch: 'else', resultCount: 2,
  },
  {
    label: 'Iteration 3/3: Monitor pruefe',
    description:
      'Dritte und letzte Iteration fuer Monitor (Menge 1). Der gleiche Pruefmechanismus laeuft erneut im selben Loop-Body.',
    iteration: 3, showInitial: true, showLoop: true, showCheck: true,
    showSelfCall: false, showResult: false, showFinal: false, altBranch: null, resultCount: 2,
  },
  {
    label: 'Iteration 3/3: Monitor reserviert',
    description:
      'Bestand ausreichend: Der LagerService reserviert und meldet "reserviert". Die Schleife endet nach 3 Durchlaeufen.',
    iteration: 3, showInitial: true, showLoop: true, showCheck: true,
    showSelfCall: true, showResult: true, showFinal: false, altBranch: 'if', resultCount: 3,
  },
  {
    label: 'Ergebnis zurueckgeben',
    description:
      'Die Schleife endet. Der BestellService sendet das Gesamtergebnis als Rueckantwort: 2 von 3 Artikeln wurden reserviert, Maus ist nicht verfuegbar.',
    iteration: 0, showInitial: true, showLoop: true, showCheck: false,
    showSelfCall: false, showResult: false, showFinal: true, altBranch: null, resultCount: 3,
  },
]

/* ------------------------------------------------------------------ */
/*  SVG helpers                                                        */
/* ------------------------------------------------------------------ */

function ArrowHead({
  x, y, direction, filled, color,
}: {
  x: number; y: number; direction: 'right' | 'left'; filled: boolean; color: string
}) {
  const sign = direction === 'right' ? -1 : 1
  return filled ? (
    <polygon points={`${x},${y} ${x + sign * 9},${y - 4} ${x + sign * 9},${y + 4}`} fill={color} />
  ) : (
    <polyline
      points={`${x + sign * 9},${y - 4} ${x},${y} ${x + sign * 9},${y + 4}`}
      fill="none" stroke={color} strokeWidth={2}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  JSON display components                                            */
/* ------------------------------------------------------------------ */

function OrderJsonDisplay({ highlight }: { highlight?: string }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden text-xs">
      <div className="bg-gray-100 px-3 py-1 font-semibold text-gray-600 border-b border-border">
        Bestelldaten (Eingabe)
      </div>
      <div className="bg-gray-50 px-3 py-2 font-mono leading-relaxed">
        <div className="text-gray-500">{'{ '}<span className="text-purple-600">"bestellId"</span>: <span className="text-green-600">"B-2024-42"</span>,</div>
        <div className="text-gray-500 pl-1"><span className="text-purple-600">"artikel"</span>: [</div>
        {ORDER_DATA.artikel.map((a, i) => {
          const isHL = highlight === a.name
          return (
            <div key={a.id} className={`pl-3 ${isHL ? 'bg-yellow-100 rounded font-semibold' : ''}`}>
              <span className="text-gray-500">{'{ '}</span>
              <span className="text-purple-600">"name"</span>
              <span className="text-gray-500">: </span>
              <span className="text-green-600">"{a.name}"</span>
              <span className="text-gray-500">, </span>
              <span className="text-purple-600">"menge"</span>
              <span className="text-gray-500">: </span>
              <span className="text-blue-600">{a.menge}</span>
              <span className="text-gray-500">{' }'}{i < 2 ? ',' : ''}</span>
            </div>
          )
        })}
        <div className="text-gray-500 pl-1">] {'}'}</div>
      </div>
    </div>
  )
}

function ResultJsonDisplay({ results, animateIndex }: { results: ArtikelResult[]; animateIndex: number }) {
  if (results.length === 0) {
    return (
      <div className="rounded-lg border border-border overflow-hidden text-xs">
        <div className="bg-gray-100 px-3 py-1 font-semibold text-gray-600 border-b border-border">
          Ergebnis (wird aufgebaut...)
        </div>
        <div className="bg-gray-50 px-3 py-2 font-mono text-gray-400 italic">
          Noch keine Ergebnisse...
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden text-xs">
      <div className="bg-gray-100 px-3 py-1 font-semibold text-gray-600 border-b border-border">
        Ergebnis ({results.length}/3 Artikel)
      </div>
      <div className="bg-gray-50 px-3 py-2 font-mono leading-relaxed">
        <div className="text-gray-500">{'{ '}<span className="text-purple-600">"ergebnis"</span>: [</div>
        {results.map((r, i) => {
          const isNew = i === animateIndex
          const statusColor = r.status === 'reserviert' ? 'text-green-600' : 'text-red-500'
          return (
            <motion.div
              key={`${r.name}-${i}`}
              className={`pl-3 ${isNew ? 'bg-yellow-100 rounded' : ''}`}
              initial={isNew ? { opacity: 0, x: -10 } : undefined}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-gray-500">{'{ '}</span>
              <span className="text-purple-600">"name"</span>
              <span className="text-gray-500">: </span>
              <span className="text-green-600">"{r.name}"</span>
              <span className="text-gray-500">, </span>
              <span className="text-purple-600">"status"</span>
              <span className="text-gray-500">: </span>
              <span className={statusColor}>"{r.status}"</span>
              <span className="text-gray-500">{' }'}{i < results.length - 1 ? ',' : ''}</span>
            </motion.div>
          )
        })}
        <div className="text-gray-500">] {'}'}</div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function FragmentAnimator() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const totalSteps = STEPS.length

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
    }, 2200 / speed)
  }, [speed, totalSteps])

  useEffect(() => {
    if (isPlaying && currentStep < totalSteps - 1) scheduleNext()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [isPlaying, currentStep, scheduleNext, totalSteps])

  const play = () => {
    if (currentStep >= totalSteps - 1) setCurrentStep(0)
    setIsPlaying(true)
  }
  const pause = () => setIsPlaying(false)
  const stepForward = () => { setIsPlaying(false); setCurrentStep((p) => Math.min(p + 1, totalSteps - 1)) }
  const stepBackward = () => { setIsPlaying(false); setCurrentStep((p) => Math.max(p - 1, 0)) }
  const reset = () => { setIsPlaying(false); setCurrentStep(0) }

  const step = STEPS[currentStep]
  const iterData = step.iteration > 0 ? ITERATIONS[step.iteration - 1] : null
  const currentResults = RESULT_ENTRIES.slice(0, step.resultCount)
  const newResultIndex = step.resultCount > 0 ? step.resultCount - 1 : -1
  const highlightArtikel = iterData?.name

  // Derive labels for the current iteration
  const checkLabel = iterData ? `pruefeBestand("${iterData.name}", ${iterData.menge})` : ''

  // Lifeline positions
  const bsX = px('bestellservice')
  const lsX = px('lagerservice')

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <h3 className="text-xl font-bold text-text mb-1">
          Kombinierte Fragmente: Loop &amp; Alt mit 3 Artikeln
        </h3>
        <p className="text-sm text-text-light">
          Szenario: Der BestellService prueft fuer jeden der 3 Artikel den Lagerbestand.
          Der <strong>gleiche Ablauf</strong> im Loop-Body wird dreimal durchlaufen — mit
          unterschiedlichen Artikeln und Ergebnissen.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {isPlaying ? (
          <button onClick={pause}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-warning-light text-white text-sm font-medium hover:bg-warning transition-colors focus:outline-none focus:ring-2 focus:ring-warning focus:ring-offset-2"
            aria-label="Pause">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <rect x="5" y="3" width="4" height="14" rx="1" /><rect x="11" y="3" width="4" height="14" rx="1" />
            </svg>
            Pause
          </button>
        ) : (
          <button onClick={play}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Abspielen">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <polygon points="5,3 17,10 5,17" />
            </svg>
            Abspielen
          </button>
        )}
        <button onClick={stepBackward} disabled={currentStep <= 0}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-text text-sm hover:bg-surface-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Schritt zurueck">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zurueck
        </button>
        <button onClick={stepForward} disabled={currentStep >= totalSteps - 1}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-text text-sm hover:bg-surface-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Schritt vor">
          Vor
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button onClick={reset}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-text text-sm hover:bg-surface-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Zuruecksetzen">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0115.4-5.4M20 15a9 9 0 01-15.4 5.4" />
          </svg>
          Zuruecksetzen
        </button>
        <div className="flex items-center gap-2 ml-auto">
          <label htmlFor="frag-speed" className="text-xs text-text-light whitespace-nowrap">Geschwindigkeit:</label>
          <input id="frag-speed" type="range" min={0.5} max={2} step={0.5} value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))} className="w-20 accent-primary" aria-label="Animationsgeschwindigkeit" />
          <span className="text-xs font-mono text-text-light w-8">{speed}x</span>
        </div>
      </div>

      {/* Step progress bar */}
      <div className="flex gap-1">
        {STEPS.map((_, i) => (
          <button key={i} onClick={() => { setIsPlaying(false); setCurrentStep(i) }}
            className={`h-2 flex-1 rounded-full transition-colors ${
              i <= currentStep ? (i === currentStep ? 'bg-primary' : 'bg-primary/40') : 'bg-surface-dark'
            }`}
            aria-label={`Springe zu Schritt ${i + 1}`} />
        ))}
      </div>

      {/* Iteration indicator + JSON panels */}
      <div className="flex flex-col gap-3">
        {/* Iteration badge */}
        {step.iteration > 0 && (
          <motion.div
            key={`iter-${step.iteration}-${step.altBranch}`}
            className="flex items-center gap-2 text-sm"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold text-xs">
              Iteration {step.iteration}/3: {ITERATIONS[step.iteration - 1].name}
              (Menge: {ITERATIONS[step.iteration - 1].menge})
            </span>
            {step.altBranch === 'if' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium text-xs">
                bestand &gt;= menge &rarr; reserviert
              </span>
            )}
            {step.altBranch === 'else' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-600 font-medium text-xs">
                bestand &lt; menge &rarr; nichtVerfuegbar
              </span>
            )}
          </motion.div>
        )}

        {/* JSON: Order + Result side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <OrderJsonDisplay highlight={highlightArtikel} />
          <ResultJsonDisplay results={currentResults} animateIndex={newResultIndex} />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-text-light">
        <span className="flex items-center gap-1">
          <span className="inline-block w-5 h-3 rounded border-2 border-purple-500 bg-purple-50" />
          loop-Fragment
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-5 h-3 rounded border-2 border-amber-500 bg-amber-50" />
          alt-Fragment
        </span>
        <span className="flex items-center gap-1">
          <svg width="28" height="10"><line x1="0" y1="5" x2="28" y2="5" stroke="#3b82f6" strokeWidth={2} /></svg>
          Synchrone Nachricht
        </span>
        <span className="flex items-center gap-1">
          <svg width="28" height="10"><line x1="0" y1="5" x2="28" y2="5" stroke="#22c55e" strokeWidth={2} strokeDasharray="6 3" /></svg>
          Rueckantwort
        </span>
      </div>

      {/* SVG Diagram — full width */}
      <div className="bg-white rounded-lg border border-border p-3 overflow-x-auto">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="xMidYMin meet"
          className="w-full max-w-2xl mx-auto"
          role="img"
          aria-label="Animiertes Sequenzdiagramm mit loop- und alt-Fragmenten"
        >
          {/* Lifeline headers + dashed lines */}
          {PARTICIPANTS.map((p) => (
            <g key={p.id}>
              {p.isActor ? (
                <>
                  <circle cx={p.x} cy={HEADER_Y + 10} r={8} fill="none" stroke="#1e293b" strokeWidth={1.5} />
                  <line x1={p.x} y1={HEADER_Y + 18} x2={p.x} y2={HEADER_Y + 30} stroke="#1e293b" strokeWidth={1.5} />
                  <line x1={p.x - 8} y1={HEADER_Y + 22} x2={p.x + 8} y2={HEADER_Y + 22} stroke="#1e293b" strokeWidth={1.5} />
                  <line x1={p.x} y1={HEADER_Y + 30} x2={p.x - 6} y2={HEADER_Y + HEADER_H} stroke="#1e293b" strokeWidth={1.5} />
                  <line x1={p.x} y1={HEADER_Y + 30} x2={p.x + 6} y2={HEADER_Y + HEADER_H} stroke="#1e293b" strokeWidth={1.5} />
                  <text x={p.x} y={HEADER_Y + HEADER_H + 12} textAnchor="middle" fontSize={12} fill="#1e293b">{p.label}</text>
                </>
              ) : (
                <>
                  <rect x={p.x - 55} y={HEADER_Y} width={110} height={HEADER_H} rx={5} fill="#f1f5f9" stroke="#1e293b" strokeWidth={1.5} />
                  <text x={p.x} y={HEADER_Y + HEADER_H / 2 + 5} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#1e293b">{p.label}</text>
                </>
              )}
              <line
                x1={p.x} y1={LIFELINE_TOP + (p.isActor ? 12 : 0)}
                x2={p.x} y2={LIFELINE_END}
                stroke="#94a3b8" strokeWidth={1} strokeDasharray="6 4"
              />
            </g>
          ))}

          {/* Initial message: Kunde → BestellService */}
          {step.showInitial && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <line x1={px('kunde')} y1={INIT_MSG_Y} x2={bsX - ACTIVATION_W / 2} y2={INIT_MSG_Y}
                stroke="#3b82f6" strokeWidth={2} />
              <ArrowHead x={bsX - ACTIVATION_W / 2} y={INIT_MSG_Y} direction="right" filled={true} color="#3b82f6" />
              <text x={(px('kunde') + bsX) / 2} y={INIT_MSG_Y - 8} textAnchor="middle" fontSize={11} fill="#3b82f6">
                bestellungPruefen(bestellung)
              </text>
              {currentStep === 1 && (
                <motion.circle r={5} fill="#3b82f6" filter="drop-shadow(0 0 2px rgba(0,0,0,0.25))"
                  initial={{ cx: px('kunde'), cy: INIT_MSG_Y }}
                  animate={{ cx: bsX - ACTIVATION_W / 2, cy: INIT_MSG_Y }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }} />
              )}
            </motion.g>
          )}

          {/* Loop fragment */}
          {step.showLoop && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: step.iteration > 0 ? 1 : 0.5 }} transition={{ duration: 0.4 }}>
              <rect x={LOOP_X} y={LOOP_TOP} width={LOOP_W} height={LOOP_BOTTOM - LOOP_TOP}
                rx={3} fill="rgba(139,92,246,0.06)" stroke={step.iteration > 0 ? '#8b5cf6' : '#a78bfa'}
                strokeWidth={step.iteration > 0 ? 2 : 1.5} />
              <path d={`M ${LOOP_X} ${LOOP_TOP} h 50 l -8 16 h -42 z`} fill="#8b5cf6" opacity={0.9} />
              <text x={LOOP_X + 5} y={LOOP_TOP + 12} fontSize={10} fontWeight="bold" fill="white">loop</text>
              <text x={bsX + ACTIVATION_W / 2 + 6} y={LOOP_TOP + 14} fontSize={10} fill="#8b5cf6" fontWeight="bold">
                [1..3] fuer jeden Artikel
              </text>
              {/* Iteration counter in corner */}
              {step.iteration > 0 && (
                <text x={LOOP_X + LOOP_W - 8} y={LOOP_TOP + 14} textAnchor="end" fontSize={10} fill="#7c3aed" fontWeight="bold">
                  {step.iteration}/3
                </text>
              )}
            </motion.g>
          )}

          {/* Alt fragment inside loop */}
          {step.showLoop && step.showCheck && (
            <motion.g
              key={`alt-${step.iteration}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <rect x={ALT_X} y={ALT_TOP} width={ALT_W} height={ALT_BOTTOM - ALT_TOP}
                rx={3} fill="rgba(245,158,11,0.05)" stroke={step.altBranch ? '#f59e0b' : '#fbbf24'}
                strokeWidth={step.altBranch ? 2 : 1.5} />
              {/* Branch highlights */}
              {step.altBranch === 'if' && (
                <rect x={ALT_X + 1} y={ALT_TOP + 1} width={ALT_W - 2}
                  height={ALT_DIVIDER_Y - ALT_TOP - 1} rx={2} fill="rgba(34,197,94,0.08)" />
              )}
              {step.altBranch === 'else' && (
                <rect x={ALT_X + 1} y={ALT_DIVIDER_Y} width={ALT_W - 2}
                  height={ALT_BOTTOM - ALT_DIVIDER_Y - 1} rx={2} fill="rgba(239,68,68,0.08)" />
              )}
              {/* Pentagon */}
              <path d={`M ${ALT_X} ${ALT_TOP} h 38 l -8 14 h -30 z`} fill="#f59e0b" opacity={0.9} />
              <text x={ALT_X + 4} y={ALT_TOP + 10} fontSize={9} fontWeight="bold" fill="white">alt</text>
              <text x={bsX + ACTIVATION_W / 2 + 6} y={ALT_TOP + 12} fontSize={9} fill="#f59e0b" fontWeight="bold">
                [bestand &gt;= menge]
              </text>
              {/* Divider line */}
              <line x1={ALT_X} y1={ALT_DIVIDER_Y} x2={ALT_X + ALT_W} y2={ALT_DIVIDER_Y}
                stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="8 4" />
              <text x={ALT_X + 8} y={ALT_DIVIDER_Y + 12} fontSize={9} fill="#f59e0b" fontWeight="bold">
                [bestand &lt; menge]
              </text>
            </motion.g>
          )}

          {/* Activation bars */}
          {step.showInitial && (
            <motion.rect
              x={bsX - ACTIVATION_W / 2} y={INIT_MSG_Y - 6} width={ACTIVATION_W} rx={2}
              fill="#dbeafe" stroke="#3b82f6" strokeWidth={1}
              initial={{ height: 0 }}
              animate={{ height: step.showFinal ? FINAL_MSG_Y - INIT_MSG_Y + 12 : step.showCheck ? PRUEFE_Y - INIT_MSG_Y + 30 : 16 }}
              transition={{ duration: 0.3 }}
            />
          )}
          {step.showCheck && (
            <motion.rect
              key={`lager-act-${step.iteration}`}
              x={lsX - ACTIVATION_W / 2} y={PRUEFE_Y - 6} width={ACTIVATION_W} rx={2}
              fill="#dbeafe" stroke="#3b82f6" strokeWidth={1}
              initial={{ height: 0 }}
              animate={{ height: step.showResult ? (step.altBranch === 'if' ? RESULT_IF_Y : RESULT_ELSE_Y) - PRUEFE_Y + 12 : 16 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Loop body messages — same positions, labels change per iteration */}
          <AnimatePresence mode="wait">
            {step.showCheck && iterData && (
              <motion.g
                key={`body-${step.iteration}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* pruefeBestand message */}
                <line x1={bsX + ACTIVATION_W / 2} y1={PRUEFE_Y} x2={lsX - ACTIVATION_W / 2} y2={PRUEFE_Y}
                  stroke="#3b82f6" strokeWidth={2} />
                <ArrowHead x={lsX - ACTIVATION_W / 2} y={PRUEFE_Y} direction="right" filled={true} color="#3b82f6" />
                <text x={(bsX + lsX) / 2} y={PRUEFE_Y - 8} textAnchor="middle" fontSize={10} fill="#3b82f6"
                  fontWeight={!step.showResult ? 'bold' : 'normal'}>
                  {checkLabel}
                </text>
                {/* Animated dot for pruefeBestand */}
                {!step.showResult && (
                  <motion.circle r={5} fill="#3b82f6" filter="drop-shadow(0 0 2px rgba(0,0,0,0.25))"
                    initial={{ cx: bsX + ACTIVATION_W / 2, cy: PRUEFE_Y }}
                    animate={{ cx: lsX - ACTIVATION_W / 2, cy: PRUEFE_Y }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }} />
                )}

                {/* reserviere() self-call — only in if-branch */}
                {step.showSelfCall && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <path d={`M ${lsX + ACTIVATION_W / 2} ${RESERVIERE_Y - 6} h 35 v 22 h -35`}
                      fill="none" stroke="#3b82f6" strokeWidth={2} />
                    <ArrowHead x={lsX + ACTIVATION_W / 2} y={RESERVIERE_Y + 16} direction="left" filled={true} color="#3b82f6" />
                    <text x={lsX + ACTIVATION_W / 2 + 39} y={RESERVIERE_Y + 5} fontSize={10} fill="#3b82f6">
                      reserviere()
                    </text>
                  </motion.g>
                )}

                {/* Result: reserviert (if-branch) */}
                {step.showResult && step.altBranch === 'if' && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <line x1={lsX - ACTIVATION_W / 2} y1={RESULT_IF_Y} x2={bsX + ACTIVATION_W / 2} y2={RESULT_IF_Y}
                      stroke="#22c55e" strokeWidth={2} strokeDasharray="8 4" />
                    <ArrowHead x={bsX + ACTIVATION_W / 2} y={RESULT_IF_Y} direction="left" filled={false} color="#22c55e" />
                    <text x={(bsX + lsX) / 2} y={RESULT_IF_Y - 8} textAnchor="middle" fontSize={10} fill="#22c55e" fontWeight="bold">
                      reserviert
                    </text>
                    <motion.circle r={5} fill="#22c55e" filter="drop-shadow(0 0 2px rgba(0,0,0,0.25))"
                      initial={{ cx: lsX - ACTIVATION_W / 2, cy: RESULT_IF_Y }}
                      animate={{ cx: bsX + ACTIVATION_W / 2, cy: RESULT_IF_Y }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }} />
                  </motion.g>
                )}

                {/* Result: nichtVerfuegbar (else-branch) */}
                {step.showResult && step.altBranch === 'else' && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <line x1={lsX - ACTIVATION_W / 2} y1={RESULT_ELSE_Y} x2={bsX + ACTIVATION_W / 2} y2={RESULT_ELSE_Y}
                      stroke="#22c55e" strokeWidth={2} strokeDasharray="8 4" />
                    <ArrowHead x={bsX + ACTIVATION_W / 2} y={RESULT_ELSE_Y} direction="left" filled={false} color="#22c55e" />
                    <text x={(bsX + lsX) / 2} y={RESULT_ELSE_Y - 8} textAnchor="middle" fontSize={10} fill="#22c55e" fontWeight="bold">
                      nichtVerfuegbar
                    </text>
                    <motion.circle r={5} fill="#22c55e" filter="drop-shadow(0 0 2px rgba(0,0,0,0.25))"
                      initial={{ cx: lsX - ACTIVATION_W / 2, cy: RESULT_ELSE_Y }}
                      animate={{ cx: bsX + ACTIVATION_W / 2, cy: RESULT_ELSE_Y }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }} />
                  </motion.g>
                )}
              </motion.g>
            )}
          </AnimatePresence>

          {/* Final message: BestellService → Kunde */}
          {step.showFinal && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <line x1={bsX - ACTIVATION_W / 2} y1={FINAL_MSG_Y} x2={px('kunde')} y2={FINAL_MSG_Y}
                stroke="#22c55e" strokeWidth={2} strokeDasharray="8 4" />
              <ArrowHead x={px('kunde')} y={FINAL_MSG_Y} direction="left" filled={false} color="#22c55e" />
              <text x={(px('kunde') + bsX) / 2} y={FINAL_MSG_Y - 8} textAnchor="middle" fontSize={11} fill="#22c55e" fontWeight="bold">
                pruefungErgebnis(ergebnis)
              </text>
              <motion.circle r={5} fill="#22c55e" filter="drop-shadow(0 0 2px rgba(0,0,0,0.25))"
                initial={{ cx: bsX - ACTIVATION_W / 2, cy: FINAL_MSG_Y }}
                animate={{ cx: px('kunde'), cy: FINAL_MSG_Y }}
                transition={{ duration: 0.5, ease: 'easeInOut' }} />
            </motion.g>
          )}
        </svg>
      </div>

      {/* Description */}
      <div className="min-h-[56px] bg-surface rounded-lg border border-border p-3">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            className="text-sm text-text leading-relaxed"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <span className="font-semibold text-primary">
              Schritt {currentStep + 1}/{totalSteps}: {step.label}
            </span>{' '}
            &mdash; {step.description}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
