import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExerciseFeedback } from '../common/ExerciseFeedback.tsx'
import { useExercise } from '../../hooks/useExercise.ts'
import type { ExerciseBase, ValidationResult } from '../../types/index.ts'

// --- Embedded exercise data ---

const exercise: ExerciseBase = {
  id: 'zd-duel-01',
  version: 2,
  title: 'Zustandsautomat-Duell',
  description:
    'Zwei fast identische Automaten modellieren ein Bankkonto -- finde heraus, ab wann sie sich unterschiedlich verhalten!',
  diagramType: 'zustandsdiagramm',
  exerciseType: 'custom',
  level: 3,
  maxPoints: 3,
  hints: [
    'Vergleiche die Guards an den Transitionen genau.',
    'Verfolge die Variable fehlversuche bei jedem Schritt.',
    'Sobald ein Automat in Geschlossen wechselt, bleibt er dort.',
  ],
}

type DuelState = 'Aktiv' | 'Gesperrt' | 'Geschlossen'

interface DuelEvent {
  id: number
  label: string
  betragKorrekt: boolean
  fehlversucheBefore: number
  resultA: DuelState
  resultB: DuelState
  fehlversucheAfter: number
  diverges: boolean
  explanationA: string
  explanationB: string
}

const events: DuelEvent[] = [
  {
    id: 1,
    label: 'pinEingeben() [korrekt = false]',
    betragKorrekt: false,
    fehlversucheBefore: 0,
    resultA: 'Aktiv',
    resultB: 'Aktiv',
    fehlversucheAfter: 1,
    diverges: false,
    explanationA:
      'PIN falsch. Guard [fehlversuche >= 3] nicht erfuellt (1 < 3). Selbsttransition, fehlversuche wird 1.',
    explanationB:
      'PIN falsch. Guard [fehlversuche >= 3] nicht erfuellt (1 < 3). Selbsttransition, fehlversuche wird 1.',
  },
  {
    id: 2,
    label: 'pinEingeben() [korrekt = false]',
    betragKorrekt: false,
    fehlversucheBefore: 1,
    resultA: 'Aktiv',
    resultB: 'Aktiv',
    fehlversucheAfter: 2,
    diverges: false,
    explanationA:
      'PIN falsch. Guard [fehlversuche >= 3] nicht erfuellt (2 < 3). Selbsttransition, fehlversuche wird 2.',
    explanationB:
      'PIN falsch. Guard [fehlversuche >= 3] nicht erfuellt (2 < 3). Selbsttransition, fehlversuche wird 2.',
  },
  {
    id: 3,
    label: 'pinEingeben() [korrekt = false]',
    betragKorrekt: false,
    fehlversucheBefore: 2,
    resultA: 'Gesperrt',
    resultB: 'Geschlossen',
    fehlversucheAfter: 3,
    diverges: true,
    explanationA:
      'PIN falsch. Guard [fehlversuche >= 3] ERFUELLT (3 >= 3)! Transition Aktiv -> Gesperrt. Konto kann entsperrt werden.',
    explanationB:
      'PIN falsch. Guard [fehlversuche >= 3] ERFUELLT (3 >= 3)! Transition Aktiv -> Geschlossen. Konto ist permanent geschlossen.',
  },
  {
    id: 4,
    label: 'pinEingeben() [korrekt = true]',
    betragKorrekt: true,
    fehlversucheBefore: 3,
    resultA: 'Gesperrt',
    resultB: 'Geschlossen',
    fehlversucheAfter: 3,
    diverges: false,
    explanationA:
      'Automat A ist im Zustand Gesperrt. Das Konto ist gesperrt, aber eine Entsperrung durch den Support waere moeglich. PIN-Eingabe wird ignoriert.',
    explanationB:
      'Automat B ist bereits im Zustand Geschlossen (Endzustand). Keine Transition moeglich, bleibt Geschlossen.',
  },
]

const CORRECT_DIVERGE_EVENT = 3
const CORRECT_END_A: DuelState = 'Gesperrt'
const CORRECT_END_B: DuelState = 'Geschlossen'

interface Answers {
  divergeEvent: number | null
  endStateA: DuelState | null
  endStateB: DuelState | null
}

// --- Helper: draw a single automat SVG ---

function AutomatSVG({
  label,
  guardLabel,
  highlightState,
  variant: _variant,
}: {
  label: string
  guardLabel: string
  highlightState: DuelState | null
  variant: 'A' | 'B'
}) {
  const statePositions: Record<DuelState, { x: number; y: number }> = {
    Aktiv: { x: 80, y: 80 },
    Gesperrt: { x: 280, y: 40 },
    Geschlossen: { x: 280, y: 130 },
  }

  const stateColor = (s: DuelState) =>
    highlightState === s
      ? { fill: '#dbeafe', stroke: '#2563eb', strokeWidth: 3 }
      : { fill: '#f8fafc', stroke: '#94a3b8', strokeWidth: 2 }

  return (
    <div className="flex-1 min-w-0">
      <h5 className="text-sm font-bold text-center mb-2 text-text">{label}</h5>
      <svg viewBox="0 0 380 180" className="w-full" role="img" aria-label={label}>
        {/* Initial state */}
        <circle cx="20" cy="80" r="8" fill="#1e293b" />
        <line x1="28" y1="80" x2="48" y2="80" stroke="#1e293b" strokeWidth="2" markerEnd="url(#ah)" />

        {/* Aktiv */}
        <rect
          x={statePositions.Aktiv.x - 40}
          y={statePositions.Aktiv.y - 25}
          width="80"
          height="50"
          rx="15"
          {...stateColor('Aktiv')}
          className="transition-all duration-300"
        />
        <text x={statePositions.Aktiv.x} y={statePositions.Aktiv.y + 5} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#334155">
          Aktiv
        </text>

        {/* Gesperrt */}
        <rect
          x={statePositions.Gesperrt.x - 45}
          y={statePositions.Gesperrt.y - 20}
          width="90"
          height="40"
          rx="12"
          {...stateColor('Gesperrt')}
          className="transition-all duration-300"
        />
        <text x={statePositions.Gesperrt.x} y={statePositions.Gesperrt.y + 5} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#334155">
          Gesperrt
        </text>

        {/* Geschlossen */}
        <rect
          x={statePositions.Geschlossen.x - 50}
          y={statePositions.Geschlossen.y - 20}
          width="100"
          height="40"
          rx="12"
          {...stateColor('Geschlossen')}
          className="transition-all duration-300"
        />
        <text x={statePositions.Geschlossen.x} y={statePositions.Geschlossen.y + 5} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#334155">
          Geschlossen
        </text>

        {/* Arrow Aktiv -> Gesperrt */}
        <line x1="120" y1="68" x2="235" y2="45" stroke="#16a34a" strokeWidth="2" markerEnd="url(#ahG)" />
        <text x="170" y="44" fontSize="9" fill="#16a34a">
          pinEingeben() {guardLabel}
        </text>

        {/* Arrow Aktiv -> Geschlossen */}
        <line x1="120" y1="95" x2="230" y2="125" stroke="#dc2626" strokeWidth="2" markerEnd="url(#ahR)" />
        <text x="140" y="130" fontSize="9" fill="#dc2626">
          pinEingeben() {guardLabel}
        </text>

        {/* Self-loop Aktiv */}
        <path d="M 60 55 Q 80 20 100 55" fill="none" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#ahP)" />
        <text x="80" y="18" textAnchor="middle" fontSize="8" fill="#6366f1">
          [!korrekt] / fehlversuche++
        </text>

        <defs>
          <marker id="ah" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#1e293b" />
          </marker>
          <marker id="ahG" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#16a34a" />
          </marker>
          <marker id="ahR" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#dc2626" />
          </marker>
          <marker id="ahP" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#6366f1" />
          </marker>
        </defs>
      </svg>
    </div>
  )
}

// --- Main Component ---

export function StateMachineDuel() {
  const { result, showHints, submit, reset, toggleHints } = useExercise<Answers>(exercise)
  const [answers, setAnswers] = useState<Answers>({
    divergeEvent: null,
    endStateA: null,
    endStateB: null,
  })
  const [stepIndex, setStepIndex] = useState(-1) // -1 = not started stepping
  const [showExplanations, setShowExplanations] = useState(false)

  const currentStateA: DuelState =
    stepIndex >= 0 ? events[Math.min(stepIndex, events.length - 1)].resultA : 'Aktiv'
  const currentStateB: DuelState =
    stepIndex >= 0 ? events[Math.min(stepIndex, events.length - 1)].resultB : 'Aktiv'

  const handleStepForward = () => {
    if (stepIndex < events.length - 1) {
      setStepIndex((i) => i + 1)
    }
  }

  const handleStepBack = () => {
    if (stepIndex > -1) {
      setStepIndex((i) => i - 1)
    }
  }

  const handleSubmit = () => {
    submit((): ValidationResult => {
      let score = 0
      const details = []

      // Check diverge event
      const divergeCorrect = answers.divergeEvent === CORRECT_DIVERGE_EVENT
      if (divergeCorrect) score++
      details.push({
        itemId: 'diverge',
        correct: divergeCorrect,
        feedback: divergeCorrect
          ? 'Korrekt: Die Automaten divergieren bei Ereignis 3.'
          : `Falsch: Du hast Ereignis ${answers.divergeEvent} gewaehlt, korrekt waere Ereignis ${CORRECT_DIVERGE_EVENT}.`,
      })

      // Check end state A
      const endACorrect = answers.endStateA === CORRECT_END_A
      if (endACorrect) score++
      details.push({
        itemId: 'endA',
        correct: endACorrect,
        feedback: endACorrect
          ? 'Korrekt: Automat A endet im Zustand Gesperrt.'
          : `Falsch: Automat A endet nicht in ${answers.endStateA}, sondern in ${CORRECT_END_A}.`,
      })

      // Check end state B
      const endBCorrect = answers.endStateB === CORRECT_END_B
      if (endBCorrect) score++
      details.push({
        itemId: 'endB',
        correct: endBCorrect,
        feedback: endBCorrect
          ? 'Korrekt: Automat B endet im Zustand Geschlossen.'
          : `Falsch: Automat B endet nicht in ${answers.endStateB}, sondern in ${CORRECT_END_B}.`,
      })

      return {
        correct: score === exercise.maxPoints,
        score,
        maxScore: exercise.maxPoints,
        feedback:
          score === exercise.maxPoints
            ? 'Hervorragend! Du hast den entscheidenden Unterschied zwischen den Automaten erkannt.'
            : `${score} von ${exercise.maxPoints} Punkten. Der entscheidende Unterschied liegt im Zielzustand der Transition bei fehlversuche >= 3.`,
        details,
      }
    })
    setShowExplanations(true)
  }

  const handleReset = () => {
    reset()
    setAnswers({ divergeEvent: null, endStateA: null, endStateB: null })
    setStepIndex(-1)
    setShowExplanations(false)
  }

  const allAnswered =
    answers.divergeEvent !== null && answers.endStateA !== null && answers.endStateB !== null

  const stateOptions: DuelState[] = ['Aktiv', 'Gesperrt', 'Geschlossen']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light">{exercise.description}</p>
      </div>

      {/* Side-by-side automata */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <AutomatSVG
            label="Automat A (Gesperrt)"
            guardLabel="[fehlversuche >= 3]"
            highlightState={stepIndex >= 0 ? currentStateA : null}
            variant="A"
          />
          <div className="hidden lg:flex items-center">
            <div className="w-px h-full bg-border" />
          </div>
          <div className="lg:hidden">
            <div className="h-px w-full bg-border" />
          </div>
          <AutomatSVG
            label="Automat B (Geschlossen)"
            guardLabel="[fehlversuche >= 3]"
            highlightState={stepIndex >= 0 ? currentStateB : null}
            variant="B"
          />
        </div>

        {/* Key difference callout */}
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          <strong>Aufgabe:</strong> Die Automaten unterscheiden sich in genau einem Guard.
          Verfolge die Ereignissequenz und finde heraus, ab wann sie divergieren.
        </div>
      </div>

      {/* Event stepping */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-text-light uppercase tracking-wide">
            Ereignissequenz (fehlversuche startet bei 0)
          </h4>
          <div className="flex gap-2">
            <button
              onClick={handleStepBack}
              disabled={stepIndex <= -1}
              className="px-3 py-1 text-sm border border-border rounded-md hover:bg-surface-dark disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Einen Schritt zurueck"
            >
              Zurueck
            </button>
            <button
              onClick={handleStepForward}
              disabled={stepIndex >= events.length - 1}
              className="px-3 py-1 text-sm border border-border rounded-md hover:bg-surface-dark disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Einen Schritt vorwaerts"
            >
              Weiter
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {events.map((event, idx) => {
            const isActive = idx <= stepIndex
            const isCurrent = idx === stepIndex
            const isDivergent = event.diverges

            return (
              <motion.div
                key={event.id}
                animate={{
                  opacity: isActive ? 1 : 0.5,
                  scale: isCurrent ? 1.02 : 1,
                }}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  isCurrent
                    ? isDivergent
                      ? 'border-red-400 bg-red-50'
                      : 'border-primary bg-primary/5'
                    : isActive
                      ? 'border-gray-200 bg-gray-50'
                      : 'border-gray-100 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold flex-shrink-0 ${
                      isCurrent ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {event.id}
                  </span>
                  <span className="font-mono text-sm text-text">{event.label}</span>
                  <span className="text-xs text-text-light">
                    (fehlversuche = {event.fehlversucheBefore})
                  </span>
                </div>

                {isActive && (
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-text-light text-xs">Automat A:</span>{' '}
                      <span
                        className={`font-semibold ${
                          event.resultA === 'Geschlossen'
                            ? 'text-red-600'
                            : event.resultA === 'Gesperrt'
                              ? 'text-amber-600'
                              : 'text-blue-600'
                        }`}
                      >
                        {event.resultA}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-light text-xs">Automat B:</span>{' '}
                      <span
                        className={`font-semibold ${
                          event.resultB === 'Geschlossen'
                            ? 'text-red-600'
                            : event.resultB === 'Gesperrt'
                              ? 'text-amber-600'
                              : 'text-blue-600'
                        }`}
                      >
                        {event.resultB}
                      </span>
                    </div>
                  </div>
                )}

                {isDivergent && isActive && (
                  <div className="mt-1 text-xs font-semibold text-red-600">
                    Divergenz! Die Automaten verhalten sich unterschiedlich.
                  </div>
                )}

                {/* Show explanations after submit */}
                <AnimatePresence>
                  {showExplanations && result && isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 grid grid-cols-2 gap-2 text-xs text-text-light"
                    >
                      <div className="bg-blue-50 rounded p-2">
                        <strong>A:</strong> {event.explanationA}
                      </div>
                      <div className="bg-purple-50 rounded p-2">
                        <strong>B:</strong> {event.explanationB}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Questions */}
      <div className="bg-white rounded-xl border border-border p-6 space-y-6">
        <h4 className="text-sm font-semibold text-text-light uppercase tracking-wide">
          Fragen
        </h4>

        {/* Q1: Divergence event */}
        <div>
          <p className="font-medium text-text mb-3">
            1. Ab welchem Ereignis divergieren die Automaten?
          </p>
          <div className="flex gap-2">
            {events.map((event) => (
              <button
                key={event.id}
                onClick={() =>
                  !result && setAnswers((prev) => ({ ...prev, divergeEvent: event.id }))
                }
                disabled={!!result}
                className={`w-12 h-12 rounded-lg border-2 font-bold text-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                  answers.divergeEvent === event.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-400'
                } ${result ? 'cursor-default' : 'cursor-pointer'}`}
                aria-label={`Ereignis ${event.id}`}
                aria-pressed={answers.divergeEvent === event.id}
              >
                {event.id}
              </button>
            ))}
          </div>
          {result && (
            <p
              className={`mt-2 text-sm ${answers.divergeEvent === CORRECT_DIVERGE_EVENT ? 'text-green-600' : 'text-red-600'}`}
            >
              {answers.divergeEvent === CORRECT_DIVERGE_EVENT
                ? 'Korrekt!'
                : `Richtige Antwort: Ereignis ${CORRECT_DIVERGE_EVENT}`}
            </p>
          )}
        </div>

        {/* Q2: End state A */}
        <div>
          <p className="font-medium text-text mb-3">
            2. In welchem Zustand endet Automat A?
          </p>
          <div className="flex gap-2">
            {stateOptions.map((state) => (
              <button
                key={state}
                onClick={() => !result && setAnswers((prev) => ({ ...prev, endStateA: state }))}
                disabled={!!result}
                className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                  answers.endStateA === state
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-400'
                } ${result ? 'cursor-default' : 'cursor-pointer'}`}
                aria-pressed={answers.endStateA === state}
              >
                {state}
              </button>
            ))}
          </div>
          {result && (
            <p
              className={`mt-2 text-sm ${answers.endStateA === CORRECT_END_A ? 'text-green-600' : 'text-red-600'}`}
            >
              {answers.endStateA === CORRECT_END_A
                ? 'Korrekt!'
                : `Richtige Antwort: ${CORRECT_END_A}`}
            </p>
          )}
        </div>

        {/* Q3: End state B */}
        <div>
          <p className="font-medium text-text mb-3">
            3. In welchem Zustand endet Automat B?
          </p>
          <div className="flex gap-2">
            {stateOptions.map((state) => (
              <button
                key={state}
                onClick={() => !result && setAnswers((prev) => ({ ...prev, endStateB: state }))}
                disabled={!!result}
                className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                  answers.endStateB === state
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-400'
                } ${result ? 'cursor-default' : 'cursor-pointer'}`}
                aria-pressed={answers.endStateB === state}
              >
                {state}
              </button>
            ))}
          </div>
          {result && (
            <p
              className={`mt-2 text-sm ${answers.endStateB === CORRECT_END_B ? 'text-green-600' : 'text-red-600'}`}
            >
              {answers.endStateB === CORRECT_END_B
                ? 'Korrekt!'
                : `Richtige Antwort: ${CORRECT_END_B}`}
            </p>
          )}
        </div>
      </div>

      {/* Guard difference explanation after submit */}
      <AnimatePresence>
        {showExplanations && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-50 border border-indigo-200 rounded-xl p-5"
          >
            <h4 className="font-bold text-indigo-800 mb-2">Erklaerung: Der entscheidende Unterschied</h4>
            <p className="text-sm text-indigo-700 mb-2">
              Der einzige Unterschied zwischen den Automaten liegt im <strong>Zielzustand</strong> der Transition
              bei <code className="bg-indigo-100 px-1 rounded">[fehlversuche &gt;= 3]</code>:
            </p>
            <ul className="text-sm text-indigo-700 space-y-1 ml-4 list-disc">
              <li>
                <strong>Automat A:</strong> Aktiv -&gt; <strong>Gesperrt</strong> --
                das Konto wird gesperrt, kann aber durch den Support wieder entsperrt werden
              </li>
              <li>
                <strong>Automat B:</strong> Aktiv -&gt; <strong>Geschlossen</strong> --
                das Konto wird permanent geschlossen, keine Entsperrung moeglich
              </li>
            </ul>
            <p className="text-sm text-indigo-700 mt-2">
              Beide Automaten reagieren bei 3 Fehlversuchen, aber der Zielzustand unterscheidet sich.
              Automat A wechselt in einen reversiblen Zustand (Gesperrt), waehrend Automat B
              in einen irreversiblen Endzustand (Geschlossen) wechselt. Dies hat grosse Auswirkungen
              auf die Benutzerfreundlichkeit des Systems.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit / Feedback */}
      {!result && (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Auswerten
        </button>
      )}

      {result && (
        <ExerciseFeedback
          result={result}
          hints={exercise.hints}
          showHints={showHints}
          onToggleHints={toggleHints}
          onRetry={handleReset}
        />
      )}
    </div>
  )
}
