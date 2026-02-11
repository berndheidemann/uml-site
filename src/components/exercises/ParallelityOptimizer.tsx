import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExerciseFeedback } from '../common/ExerciseFeedback.tsx'
import { useExercise } from '../../hooks/useExercise.ts'
import type { ExerciseBase, ValidationResult } from '../../types/index.ts'

// --- Embedded exercise data ---

const exercise: ExerciseBase = {
  id: 'ad-parallel-01',
  version: 2,
  title: 'Parallelitaets-Optimierer',
  description:
    'Identifiziere, welche Pruefschritte bei der TUEV-Inspektion parallel ablaufen koennen.',
  diagramType: 'aktivitaetsdiagramm',
  exerciseType: 'custom',
  level: 2,
  maxPoints: 5,
  hints: [
    'Zwei Aktionen koennen parallel laufen, wenn sie nicht voneinander abhaengen.',
    'Pruefe: Braucht Aktion B ein Ergebnis von Aktion A?',
    'Unabhaengige Aktionen brauchen nur die gleichen Vorbedingungen, nicht das Ergebnis der jeweils anderen.',
  ],
}

interface Action {
  id: string
  label: string
  duration: number // minutes
  dependsOn: string[] // ids of actions this depends on
}

const actions: Action[] = [
  { id: 'a1', label: 'Bremsen pruefen', duration: 4, dependsOn: [] },
  { id: 'a2', label: 'Abgaswerte messen', duration: 3, dependsOn: [] },
  { id: 'a3', label: 'Lichttest', duration: 2, dependsOn: [] },
  { id: 'a4', label: 'Fahrwerk pruefen', duration: 3, dependsOn: [] },
  { id: 'a5', label: 'Protokoll erstellen', duration: 3, dependsOn: ['a1', 'a2', 'a3', 'a4'] },
]

interface ParallelPair {
  id: string
  action1: string
  action2: string
  label: string
  isCorrect: boolean
  explanation: string
}

const parallelPairs: ParallelPair[] = [
  {
    id: 'p1',
    action1: 'a1',
    action2: 'a2',
    label: '"Bremsen pruefen" und "Abgaswerte messen"',
    isCorrect: true,
    explanation:
      'Beide Pruefungen sind unabhaengig voneinander und koennen an verschiedenen Stationen gleichzeitig durchgefuehrt werden.',
  },
  {
    id: 'p2',
    action1: 'a1',
    action2: 'a3',
    label: '"Bremsen pruefen" und "Lichttest"',
    isCorrect: true,
    explanation:
      'Bremsen und Licht werden unabhaengig voneinander geprueft. Parallelisierung ist moeglich.',
  },
  {
    id: 'p3',
    action1: 'a2',
    action2: 'a3',
    label: '"Abgaswerte messen" und "Lichttest"',
    isCorrect: true,
    explanation:
      'Abgaswerte und Licht sind voneinander unabhaengige Pruefungen. Sie koennen parallel ablaufen.',
  },
  {
    id: 'p4',
    action1: 'a1',
    action2: 'a4',
    label: '"Bremsen pruefen" und "Fahrwerk pruefen"',
    isCorrect: true,
    explanation:
      'Bremsen und Fahrwerk koennen an unterschiedlichen Stationen gleichzeitig geprueft werden. Keine Abhaengigkeit.',
  },
  {
    id: 'p5',
    action1: 'a5',
    action2: 'a2',
    label: '"Protokoll erstellen" und "Abgaswerte messen"',
    isCorrect: false,
    explanation:
      'Das Protokoll benoetigt die Ergebnisse aller Pruefungen, auch der Abgaswerte. Es kann erst erstellt werden, wenn alle Pruefungen abgeschlossen sind.',
  },
]

const SEQUENTIAL_TIME = 15 // sum of all durations: 4+3+2+3+3 = 15
// Optimized: max(a1,a2,a3,a4)=4 (all parallel) + a5(3) = 7
const ACTUAL_OPTIMIZED_TIME = 7

// --- Component ---

export function ParallelityOptimizer() {
  const { result, showHints, submit, reset, toggleHints } = useExercise<string[]>(exercise)
  const [selectedPairs, setSelectedPairs] = useState<string[]>([])
  const [showTimeline, setShowTimeline] = useState(false)

  const togglePair = (pairId: string) => {
    if (result) return
    setSelectedPairs((prev) =>
      prev.includes(pairId) ? prev.filter((id) => id !== pairId) : [...prev, pairId]
    )
  }

  const handleSubmit = () => {
    submit((): ValidationResult => {
      let score = 0
      const details = parallelPairs.map((pair) => {
        const isSelected = selectedPairs.includes(pair.id)
        const correct = isSelected === pair.isCorrect
        if (correct) score++
        return {
          itemId: pair.id,
          correct,
          feedback: correct
            ? `${pair.label}: ${isSelected ? 'Korrekt als parallel markiert' : 'Korrekt als nicht parallel erkannt'}.`
            : `${pair.label}: ${isSelected ? 'Falsch -- diese Aktionen koennen NICHT parallel laufen' : 'Diese Aktionen KOENNEN parallel laufen'}.`,
        }
      })

      return {
        correct: score === exercise.maxPoints,
        score,
        maxScore: exercise.maxPoints,
        feedback:
          score === exercise.maxPoints
            ? `Perfekt! Du hast alle Abhaengigkeiten korrekt erkannt. Durch Parallelisierung sinkt die Gesamtzeit von ${SEQUENTIAL_TIME} auf ${ACTUAL_OPTIMIZED_TIME} Minuten!`
            : `${score} von ${exercise.maxPoints} korrekt. Pruefe die Abhaengigkeiten zwischen den Aktionen.`,
        details,
      }
    })
    setShowTimeline(true)
  }

  const handleReset = () => {
    reset()
    setSelectedPairs([])
    setShowTimeline(false)
  }

  // Calculate the percentage saved
  const savingsPercent = Math.round(
    ((SEQUENTIAL_TIME - ACTUAL_OPTIMIZED_TIME) / SEQUENTIAL_TIME) * 100
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light">{exercise.description}</p>
      </div>

      {/* Sequential Process Visualization */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h4 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-4">
          Sequentieller TUEV-Inspektionsprozess (KFZ-Werkstatt)
        </h4>

        <div className="flex flex-col items-center gap-1">
          {/* Start node */}
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
          <div className="w-0.5 h-4 bg-gray-400" />

          {actions.map((action, idx) => (
            <div key={action.id} className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3 bg-blue-50 border-2 border-blue-200 rounded-xl px-5 py-3 min-w-[300px]"
              >
                <div className="flex-1 text-sm font-medium text-blue-900">{action.label}</div>
                <div className="flex-shrink-0 text-xs font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  {action.duration} min
                </div>
              </motion.div>
              {idx < actions.length - 1 && (
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-gray-400" />
                  <svg className="w-3 h-3 text-gray-400" viewBox="0 0 12 12" fill="currentColor">
                    <polygon points="6,12 0,0 12,0" />
                  </svg>
                </div>
              )}
            </div>
          ))}

          <div className="w-0.5 h-4 bg-gray-400" />
          {/* End node */}
          <div className="w-8 h-8 rounded-full border-3 border-gray-800 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-gray-800" />
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-text-light">
          Gesamtzeit sequentiell: <strong className="text-text">{SEQUENTIAL_TIME} Minuten</strong>
        </div>
      </div>

      {/* Dependency Table */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h4 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-3">
          Abhaengigkeiten
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium text-text-light">Aktion</th>
                <th className="text-left py-2 font-medium text-text-light">Haengt ab von</th>
              </tr>
            </thead>
            <tbody>
              {actions.map((action) => (
                <tr key={action.id} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-medium text-text">{action.label}</td>
                  <td className="py-2 text-text-light">
                    {action.dependsOn.length === 0 ? (
                      <span className="text-green-600 text-xs">(Startaktion)</span>
                    ) : (
                      action.dependsOn
                        .map((depId) => actions.find((a) => a.id === depId)?.label || depId)
                        .join(', ')
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parallel Pair Selection */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h4 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-1">
          Welche Aktionen koennen parallel ablaufen?
        </h4>
        <p className="text-sm text-text-light mb-4">
          Waehle alle Aktionspaare aus, die gleichzeitig ausgefuehrt werden koennen.
        </p>

        <div className="space-y-3">
          {parallelPairs.map((pair) => {
            const isSelected = selectedPairs.includes(pair.id)
            const isCorrectAfterSubmit = result
              ? isSelected === pair.isCorrect
              : null

            return (
              <div key={pair.id}>
                <button
                  onClick={() => togglePair(pair.id)}
                  disabled={!!result}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                    result
                      ? isCorrectAfterSubmit
                        ? 'border-green-300 bg-green-50'
                        : 'border-red-300 bg-red-50'
                      : isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 bg-white hover:border-gray-400'
                  } ${result ? 'cursor-default' : 'cursor-pointer'}`}
                  role="checkbox"
                  aria-checked={isSelected}
                >
                  <div className="flex items-center gap-3">
                    {/* Checkbox visual */}
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-primary border-primary'
                          : 'bg-white border-gray-300'
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    <span className="text-sm font-medium text-text">{pair.label}</span>

                    {/* Result indicator */}
                    {result && (
                      <span className="ml-auto flex-shrink-0">
                        {isCorrectAfterSubmit ? (
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </button>

                {/* Explanation after submit */}
                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-1 ml-9 text-sm text-text-light"
                    >
                      {pair.explanation}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      {/* Timeline comparison (shown after submit) */}
      <AnimatePresence>
        {showTimeline && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-border p-6"
          >
            <h4 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-4">
              Zeitvergleich
            </h4>

            {/* Sequential bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-text">Sequentiell</span>
                <span className="text-sm font-mono text-text-light">{SEQUENTIAL_TIME} min</span>
              </div>
              <div className="h-8 bg-gray-100 rounded-lg overflow-hidden flex">
                {actions.map((action, idx) => {
                  const widthPercent = (action.duration / SEQUENTIAL_TIME) * 100
                  const colors = [
                    'bg-blue-400',
                    'bg-blue-500',
                    'bg-indigo-400',
                    'bg-purple-400',
                    'bg-pink-400',
                    'bg-red-400',
                  ]
                  return (
                    <motion.div
                      key={action.id}
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPercent}%` }}
                      transition={{ delay: idx * 0.15, duration: 0.4 }}
                      className={`${colors[idx]} h-full flex items-center justify-center border-r border-white/30`}
                      title={`${action.label} (${action.duration} min)`}
                    >
                      {widthPercent > 8 && (
                        <span className="text-[10px] text-white font-medium truncate px-1">
                          {action.duration}m
                        </span>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Optimized bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-text">Optimiert (parallel)</span>
                <span className="text-sm font-mono text-green-600 font-bold">
                  {ACTUAL_OPTIMIZED_TIME} min
                </span>
              </div>
              <div className="relative h-20 bg-gray-100 rounded-lg overflow-hidden">
                {/* Phase 1 parallel: Bremsen (0-4), Abgaswerte (0-3), Licht (0-2), Fahrwerk (0-3) */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(4 / SEQUENTIAL_TIME) * 100}%` }}
                  transition={{ delay: 0, duration: 0.4 }}
                  className="absolute bg-blue-400 flex items-center justify-center border-b border-white/30"
                  style={{
                    left: '0',
                    top: '0',
                    height: '25%',
                  }}
                  title="Bremsen pruefen (4 min)"
                >
                  <span className="text-[9px] text-white font-medium truncate px-0.5">Bremsen</span>
                </motion.div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(3 / SEQUENTIAL_TIME) * 100}%` }}
                  transition={{ delay: 0, duration: 0.4 }}
                  className="absolute bg-blue-500 flex items-center justify-center border-b border-white/30"
                  style={{
                    left: '0',
                    top: '25%',
                    height: '25%',
                  }}
                  title="Abgaswerte messen (3 min)"
                >
                  <span className="text-[9px] text-white font-medium truncate px-0.5">Abgas</span>
                </motion.div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(2 / SEQUENTIAL_TIME) * 100}%` }}
                  transition={{ delay: 0, duration: 0.4 }}
                  className="absolute bg-indigo-400 flex items-center justify-center border-b border-white/30"
                  style={{
                    left: '0',
                    top: '50%',
                    height: '25%',
                  }}
                  title="Lichttest (2 min)"
                >
                  <span className="text-[9px] text-white font-medium truncate px-0.5">Licht</span>
                </motion.div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(3 / SEQUENTIAL_TIME) * 100}%` }}
                  transition={{ delay: 0, duration: 0.4 }}
                  className="absolute bg-purple-400 flex items-center justify-center"
                  style={{
                    left: '0',
                    top: '75%',
                    height: '25%',
                  }}
                  title="Fahrwerk pruefen (3 min)"
                >
                  <span className="text-[9px] text-white font-medium truncate px-0.5">Fahrwerk</span>
                </motion.div>

                {/* Phase 2: Protokoll (4-7) */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(3 / SEQUENTIAL_TIME) * 100}%` }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="absolute top-0 h-full bg-red-400 flex items-center justify-center"
                  style={{ left: `${(4 / SEQUENTIAL_TIME) * 100}%`, height: '100%' }}
                  title="Protokoll erstellen (3 min)"
                >
                  <span className="text-[9px] text-white font-medium px-0.5 [writing-mode:vertical-lr] rotate-180">
                    Protokoll
                  </span>
                </motion.div>

                {/* Fork/Join labels */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-gray-800"
                  style={{ left: '0' }}
                />
                <div
                  className="absolute top-0 h-full w-0.5 bg-gray-800"
                  style={{ left: `${(4 / SEQUENTIAL_TIME) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-text-light">
                <span>0 min</span>
                <span>{ACTUAL_OPTIMIZED_TIME} min</span>
                <span>{SEQUENTIAL_TIME} min</span>
              </div>
            </div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center"
            >
              <p className="text-lg font-bold text-green-800">
                Sequentiell: {SEQUENTIAL_TIME} min{' '}
                <span className="mx-2">-&gt;</span> Optimiert: {ACTUAL_OPTIMIZED_TIME} min
              </p>
              <p className="text-sm text-green-700 mt-1">
                {savingsPercent}% schneller durch Parallelisierung!
              </p>
              <p className="text-xs text-green-600 mt-2">
                In einem Aktivitaetsdiagramm werden parallele Ablaeufe durch
                <strong> Fork</strong> (Synchronisationsbalken) und <strong>Join</strong> dargestellt.
              </p>
            </motion.div>

            {/* Optimiertes Aktivitaetsdiagramm mit Fork/Join */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mt-6"
            >
              <h4 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-3">
                Optimiertes Aktivitaetsdiagramm
              </h4>
              <div className="bg-slate-50 rounded-lg p-4 flex justify-center">
                <svg viewBox="0 0 560 320" className="w-full max-w-lg" role="img" aria-label="Parallelisiertes Aktivitaetsdiagramm">
                  {/* Start */}
                  <circle cx="280" cy="20" r="10" fill="#1e293b"/>

                  {/* Arrow to Fork */}
                  <line x1="280" y1="30" x2="280" y2="55" stroke="#1e293b" strokeWidth="2"/>
                  <polygon points="280,55 276,48 284,48" fill="#1e293b"/>

                  {/* Fork bar */}
                  <rect x="60" y="58" width="440" height="5" rx="2" fill="#1e293b"/>

                  {/* Branch 1: Bremsen pruefen */}
                  <line x1="120" y1="63" x2="120" y2="90" stroke="#1e293b" strokeWidth="2"/>
                  <polygon points="120,90 116,83 124,83" fill="#1e293b"/>
                  <rect x="55" y="90" width="130" height="36" rx="10" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
                  <text x="120" y="110" textAnchor="middle" fontSize="11" fill="#1e40af" fontWeight="500">Bremsen pruefen</text>
                  <text x="120" y="122" textAnchor="middle" fontSize="9" fill="#3b82f6">(4 min)</text>
                  <line x1="120" y1="126" x2="120" y2="200" stroke="#1e293b" strokeWidth="2"/>
                  <polygon points="120,200 116,193 124,193" fill="#1e293b"/>

                  {/* Branch 2: Abgaswerte messen */}
                  <line x1="240" y1="63" x2="240" y2="90" stroke="#1e293b" strokeWidth="2"/>
                  <polygon points="240,90 236,83 244,83" fill="#1e293b"/>
                  <rect x="175" y="90" width="130" height="36" rx="10" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
                  <text x="240" y="110" textAnchor="middle" fontSize="11" fill="#1e40af" fontWeight="500">Abgaswerte messen</text>
                  <text x="240" y="122" textAnchor="middle" fontSize="9" fill="#3b82f6">(3 min)</text>
                  <line x1="240" y1="126" x2="240" y2="200" stroke="#1e293b" strokeWidth="2"/>
                  <polygon points="240,200 236,193 244,193" fill="#1e293b"/>

                  {/* Branch 3: Lichttest */}
                  <line x1="360" y1="63" x2="360" y2="90" stroke="#1e293b" strokeWidth="2"/>
                  <polygon points="360,90 356,83 364,83" fill="#1e293b"/>
                  <rect x="310" y="90" width="100" height="36" rx="10" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
                  <text x="360" y="110" textAnchor="middle" fontSize="11" fill="#1e40af" fontWeight="500">Lichttest</text>
                  <text x="360" y="122" textAnchor="middle" fontSize="9" fill="#3b82f6">(2 min)</text>
                  <line x1="360" y1="126" x2="360" y2="200" stroke="#1e293b" strokeWidth="2"/>
                  <polygon points="360,200 356,193 364,193" fill="#1e293b"/>

                  {/* Branch 4: Fahrwerk pruefen */}
                  <line x1="460" y1="63" x2="460" y2="90" stroke="#1e293b" strokeWidth="2"/>
                  <polygon points="460,90 456,83 464,83" fill="#1e293b"/>
                  <rect x="395" y="90" width="130" height="36" rx="10" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
                  <text x="460" y="110" textAnchor="middle" fontSize="11" fill="#1e40af" fontWeight="500">Fahrwerk pruefen</text>
                  <text x="460" y="122" textAnchor="middle" fontSize="9" fill="#3b82f6">(3 min)</text>
                  <line x1="460" y1="126" x2="460" y2="200" stroke="#1e293b" strokeWidth="2"/>
                  <polygon points="460,200 456,193 464,193" fill="#1e293b"/>

                  {/* Join bar */}
                  <rect x="60" y="203" width="440" height="5" rx="2" fill="#1e293b"/>

                  {/* Arrow to Protokoll */}
                  <line x1="280" y1="208" x2="280" y2="235" stroke="#1e293b" strokeWidth="2"/>
                  <polygon points="280,235 276,228 284,228" fill="#1e293b"/>

                  {/* Protokoll erstellen */}
                  <rect x="200" y="235" width="160" height="36" rx="10" fill="#fce7f3" stroke="#db2777" strokeWidth="2"/>
                  <text x="280" y="255" textAnchor="middle" fontSize="11" fill="#9d174d" fontWeight="500">Protokoll erstellen</text>
                  <text x="280" y="267" textAnchor="middle" fontSize="9" fill="#db2777">(3 min)</text>

                  {/* Arrow to End */}
                  <line x1="280" y1="271" x2="280" y2="295" stroke="#1e293b" strokeWidth="2"/>
                  <polygon points="280,295 276,288 284,288" fill="#1e293b"/>

                  {/* End node */}
                  <circle cx="280" cy="305" r="10" fill="white" stroke="#1e293b" strokeWidth="2"/>
                  <circle cx="280" cy="305" r="6" fill="#1e293b"/>
                </svg>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit / Feedback */}
      {!result && (
        <div className="flex gap-3 items-center">
          <button
            onClick={handleSubmit}
            disabled={selectedPairs.length === 0}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Auswerten
          </button>
          <span className="text-sm text-text-light">
            {selectedPairs.length === 0
              ? 'Waehle mindestens ein Paar aus.'
              : `${selectedPairs.length} Paar(e) ausgewaehlt`}
          </span>
        </div>
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
