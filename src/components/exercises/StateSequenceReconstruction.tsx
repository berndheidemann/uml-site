import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExerciseFeedback } from '../common/ExerciseFeedback.tsx'
import { useExercise } from '../../hooks/useExercise.ts'
import type { ExerciseBase, ValidationResult } from '../../types/index.ts'

// --- Embedded exercise data ---

const exercise: ExerciseBase = {
  id: 'zd-sequence-01',
  version: 3,
  title: 'Zustandsfolge-Rekonstruktion',
  description:
    'Verfolge die Ereignissequenz durch den Zustandsautomaten und bestimme den resultierenden Zustand nach jedem Ereignis.',
  diagramType: 'zustandsdiagramm',
  exerciseType: 'custom',
  level: 2,
  maxPoints: 6,
  hints: [
    'Pruefe zuerst den Guard, dann fuehre die Aktion aus.',
    'Die Variable ep wird bei jedem spielen()-Aufruf um den angegebenen Wert erhoeht.',
    'Eine Degradierung von Experte zurueck zu Fortgeschritten ist moeglich, wenn ep unter 500 faellt.',
  ],
}

type StateName = 'Anfaenger' | 'Fortgeschritten' | 'Experte'

interface EventStep {
  id: number
  event: string
  variableBefore: number
  guardEvaluated: string
  guardMet: boolean
  correctState: StateName
  variableAfter: number
  explanation: string
}

const INITIAL_STATE: StateName = 'Anfaenger'
const INITIAL_VARIABLE = 70

const eventSteps: EventStep[] = [
  {
    id: 1,
    event: 'spielen(+20)',
    variableBefore: 70,
    guardEvaluated: '[ep >= 100] => 90 >= 100?',
    guardMet: false,
    correctState: 'Anfaenger',
    variableAfter: 90,
    explanation:
      'ep ist nach Erhoehung 90, Guard [>= 100] nicht erfuellt. Zustand bleibt Anfaenger.',
  },
  {
    id: 2,
    event: 'spielen(+15)',
    variableBefore: 90,
    guardEvaluated: '[ep >= 100] => 105 >= 100?',
    guardMet: true,
    correctState: 'Fortgeschritten',
    variableAfter: 105,
    explanation:
      'ep ist nach Erhoehung 105, Guard [>= 100] erfuellt! Transition Anfaenger -> Fortgeschritten.',
  },
  {
    id: 3,
    event: 'spielen(+400)',
    variableBefore: 105,
    guardEvaluated: '[ep >= 500] => 505 >= 500?',
    guardMet: true,
    correctState: 'Experte',
    variableAfter: 505,
    explanation:
      'ep ist nach Erhoehung 505, Guard [>= 500] erfuellt! Transition Fortgeschritten -> Experte.',
  },
  {
    id: 4,
    event: 'spielen(+10)',
    variableBefore: 505,
    guardEvaluated: 'Kein ausgehender Guard in Experte fuer Aufstieg — ep bleibt ueber 500',
    guardMet: false,
    correctState: 'Experte',
    variableAfter: 515,
    explanation:
      'Im Zustand Experte: ep steigt auf 515. Kein weiterer Aufstieg moeglich, kein Abstieg (ep >= 500). Zustand bleibt Experte.',
  },
  {
    id: 5,
    event: 'strafe(-50)',
    variableBefore: 515,
    guardEvaluated: '[ep < 500] => 465 < 500?',
    guardMet: true,
    correctState: 'Fortgeschritten',
    variableAfter: 465,
    explanation:
      'ep sinkt auf 465. Guard [ep < 500] ist erfuellt! Degradierung: Experte -> Fortgeschritten.',
  },
  {
    id: 6,
    event: 'spielen(+40)',
    variableBefore: 465,
    guardEvaluated: '[ep >= 500] => 505 >= 500?',
    guardMet: true,
    correctState: 'Experte',
    variableAfter: 505,
    explanation:
      'ep steigt auf 505, Guard [>= 500] erfuellt! Transition Fortgeschritten -> Experte.',
  },
]

const STATES: StateName[] = ['Anfaenger', 'Fortgeschritten', 'Experte']

const stateColors: Record<StateName, { bg: string; border: string; text: string; glow: string }> = {
  Anfaenger: {
    bg: 'bg-green-100',
    border: 'border-green-400',
    text: 'text-green-800',
    glow: 'ring-green-400',
  },
  Fortgeschritten: {
    bg: 'bg-blue-100',
    border: 'border-blue-400',
    text: 'text-blue-700',
    glow: 'ring-blue-400',
  },
  Experte: {
    bg: 'bg-purple-100',
    border: 'border-purple-500',
    text: 'text-purple-800',
    glow: 'ring-purple-500',
  },
}

const MAX_ATTEMPTS_PER_STEP = 2

// --- Component ---

interface StepResult {
  correct: boolean
  answer: StateName
}

export function StateSequenceReconstruction() {
  const { result, showHints, submit, reset, toggleHints } = useExercise<Record<number, StateName>>(
    exercise
  )

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [attemptsPerStep, setAttemptsPerStep] = useState<Record<number, number>>({})
  const [stepResults, setStepResults] = useState<Record<number, StepResult>>({})
  const [shakeStep, setShakeStep] = useState<number | null>(null)
  const [isAdvancing, setIsAdvancing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Derive the current correct highlight state from resolved steps
  const currentHighlight: StateName = (() => {
    // Show the correct state of the last resolved step
    for (let i = currentStepIndex - 1; i >= 0; i--) {
      const step = eventSteps[i]
      if (stepResults[step.id]) {
        return step.correctState
      }
    }
    return INITIAL_STATE
  })()

  // Derive the current variable value from resolved steps
  const currentVariable: number = (() => {
    for (let i = currentStepIndex - 1; i >= 0; i--) {
      const step = eventSteps[i]
      if (stepResults[step.id]) {
        return step.variableAfter
      }
    }
    return INITIAL_VARIABLE
  })()

  // Calculate accumulated score
  const score = Object.values(stepResults).filter((r) => r.correct).length

  // Auto-submit when all steps are complete
  useEffect(() => {
    if (isComplete && !result) {
      submit((): ValidationResult => {
        const details = eventSteps.map((step) => {
          const stepResult = stepResults[step.id]
          const correct = stepResult?.correct ?? false
          return {
            itemId: String(step.id),
            correct,
            feedback: correct
              ? `Ereignis ${step.id}: Korrekt (${step.correctState})`
              : `Ereignis ${step.id}: ${stepResult?.answer || 'Nicht beantwortet'} — richtig waere ${step.correctState}`,
          }
        })
        return {
          correct: score === exercise.maxPoints,
          score,
          maxScore: exercise.maxPoints,
          feedback:
            score === exercise.maxPoints
              ? 'Perfekt! Du hast alle Zustandsuebergaenge korrekt nachvollzogen.'
              : `${score} von ${exercise.maxPoints} Zustaenden korrekt. Pruefe die Guard-Bedingungen genau.`,
          details,
        }
      })
    }
  }, [isComplete, result, submit, stepResults, score])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current)
      }
    }
  }, [])

  const advanceToNextStep = useCallback(() => {
    setIsAdvancing(false)
    const nextIndex = currentStepIndex + 1
    if (nextIndex >= eventSteps.length) {
      setIsComplete(true)
    } else {
      setCurrentStepIndex(nextIndex)
    }
  }, [currentStepIndex])

  const handleSelectState = useCallback(
    (stepId: number, state: StateName) => {
      if (result || isAdvancing) return
      if (stepResults[stepId]) return // Already resolved

      const step = eventSteps.find((s) => s.id === stepId)
      if (!step) return

      const currentAttempts = (attemptsPerStep[stepId] || 0) + 1
      setAttemptsPerStep((prev) => ({ ...prev, [stepId]: currentAttempts }))

      if (state === step.correctState) {
        // Correct answer
        setStepResults((prev) => ({ ...prev, [stepId]: { correct: true, answer: state } }))
        setIsAdvancing(true)
        advanceTimeoutRef.current = setTimeout(advanceToNextStep, 1200)
      } else {
        // Wrong answer
        setShakeStep(stepId)
        setTimeout(() => setShakeStep(null), 500)

        if (currentAttempts >= MAX_ATTEMPTS_PER_STEP) {
          // Max attempts reached, reveal correct answer and advance
          setStepResults((prev) => ({
            ...prev,
            [stepId]: { correct: false, answer: state },
          }))
          setIsAdvancing(true)
          advanceTimeoutRef.current = setTimeout(advanceToNextStep, 2000)
        }
      }
    },
    [result, isAdvancing, stepResults, attemptsPerStep, advanceToNextStep]
  )

  const handleReset = () => {
    reset()
    setCurrentStepIndex(0)
    setAttemptsPerStep({})
    setStepResults({})
    setShakeStep(null)
    setIsAdvancing(false)
    setIsComplete(false)
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current)
    }
  }

  const getStepStatus = (index: number): 'resolved' | 'active' | 'future' => {
    if (index < currentStepIndex || stepResults[eventSteps[index].id]) return 'resolved'
    if (index === currentStepIndex && !isComplete) return 'active'
    return 'future'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light">{exercise.description}</p>
      </div>

      {/* State Diagram (SVG) */}
      <div className="bg-white rounded-xl border border-border p-6 overflow-x-auto">
        <h4 className="text-sm font-semibold text-text-light mb-4 uppercase tracking-wide">
          Zustandsautomat: Online-Spiel Spielerrang
        </h4>
        <svg
          viewBox="0 0 700 220"
          className="w-full max-w-2xl mx-auto"
          role="img"
          aria-label="Zustandsdiagramm mit den Zustaenden Anfaenger, Fortgeschritten und Experte"
        >
          {/* Initial pseudo-state */}
          <circle cx="40" cy="110" r="10" fill="#1e293b" />
          <line x1="50" y1="110" x2="100" y2="110" stroke="#1e293b" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* Anfaenger */}
          <g>
            <rect
              x="100"
              y="70"
              width="150"
              height="80"
              rx="20"
              ry="20"
              fill={currentHighlight === 'Anfaenger' ? '#dcfce7' : '#f0fdf4'}
              stroke={currentHighlight === 'Anfaenger' ? '#22c55e' : '#4ade80'}
              strokeWidth={currentHighlight === 'Anfaenger' ? 3 : 2}
              className="transition-all duration-300"
            />
            <text x="175" y="105" textAnchor="middle" fontWeight="bold" fontSize="15" fill="#166534">
              Anfaenger
            </text>
            <text x="175" y="125" textAnchor="middle" fontSize="11" fill="#15803d">
              spielen() / ep += x
            </text>
          </g>

          {/* Arrow Anfaenger -> Fortgeschritten */}
          <line x1="250" y1="110" x2="310" y2="110" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <text x="280" y="98" textAnchor="middle" fontSize="10" fill="#475569">
            spielen()
          </text>
          <text x="280" y="85" textAnchor="middle" fontSize="10" fill="#6366f1" fontWeight="bold">
            [ep &gt;= 100]
          </text>

          {/* Fortgeschritten */}
          <g>
            <rect
              x="310"
              y="70"
              width="150"
              height="80"
              rx="20"
              ry="20"
              fill={currentHighlight === 'Fortgeschritten' ? '#dbeafe' : '#eff6ff'}
              stroke={currentHighlight === 'Fortgeschritten' ? '#3b82f6' : '#60a5fa'}
              strokeWidth={currentHighlight === 'Fortgeschritten' ? 3 : 2}
              className="transition-all duration-300"
            />
            <text x="385" y="105" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#1e40af">
              Fortgeschritten
            </text>
            <text x="385" y="125" textAnchor="middle" fontSize="11" fill="#2563eb">
              spielen() / ep += x
            </text>
          </g>

          {/* Arrow Fortgeschritten -> Experte */}
          <line x1="460" y1="110" x2="520" y2="110" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <text x="490" y="98" textAnchor="middle" fontSize="10" fill="#475569">
            spielen()
          </text>
          <text x="490" y="85" textAnchor="middle" fontSize="10" fill="#6366f1" fontWeight="bold">
            [ep &gt;= 500]
          </text>

          {/* Experte */}
          <g>
            <rect
              x="520"
              y="70"
              width="150"
              height="80"
              rx="20"
              ry="20"
              fill={currentHighlight === 'Experte' ? '#f3e8ff' : '#faf5ff'}
              stroke={currentHighlight === 'Experte' ? '#a855f7' : '#c084fc'}
              strokeWidth={currentHighlight === 'Experte' ? 3 : 2}
              className="transition-all duration-300"
            />
            <text x="595" y="105" textAnchor="middle" fontWeight="bold" fontSize="16" fill="#6b21a8">
              Experte
            </text>
            <text x="595" y="125" textAnchor="middle" fontSize="11" fill="#7c3aed">
              spielen() / ep += x
            </text>
          </g>

          {/* Arrow Experte -> Fortgeschritten (degradation) */}
          <path
            d="M 520 155 Q 450 200 390 155"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="6 3"
            markerEnd="url(#arrowheadRed)"
          />
          <text x="455" y="195" textAnchor="middle" fontSize="10" fill="#ef4444">
            strafe() [ep &lt; 500]
          </text>

          {/* Arrowhead definitions */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
            </marker>
            <marker id="arrowheadRed" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
            </marker>
          </defs>
        </svg>

        {/* Variable display */}
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-center">
            <span className="text-xs text-text-light block">Aktueller Zustand</span>
            <span
              className={`text-lg font-bold ${stateColors[currentHighlight].text}`}
            >
              {currentHighlight}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-center">
            <span className="text-xs text-text-light block">ep (Erfahrungspunkte)</span>
            <span className="text-lg font-mono font-bold text-text">
              {currentVariable}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-center">
            <span className="text-xs text-text-light block">Punkte</span>
            <span className="text-lg font-mono font-bold text-primary">
              {score} / {exercise.maxPoints}
            </span>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-1">
        {eventSteps.map((step, index) => {
          const status = getStepStatus(index)
          const stepResult = stepResults[step.id]
          return (
            <div key={step.id} className="flex items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  status === 'resolved'
                    ? stepResult?.correct
                      ? 'bg-green-500 text-white'
                      : 'bg-red-400 text-white'
                    : status === 'active'
                      ? 'bg-primary text-white ring-2 ring-primary/30 ring-offset-2'
                      : 'bg-gray-200 text-gray-400'
                }`}
                aria-label={`Schritt ${step.id}: ${
                  status === 'resolved'
                    ? stepResult?.correct ? 'korrekt' : 'falsch'
                    : status === 'active' ? 'aktuell' : 'ausstehend'
                }`}
              >
                {status === 'resolved' ? (
                  stepResult?.correct ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )
                ) : (
                  step.id
                )}
              </div>
              {index < eventSteps.length - 1 && (
                <div
                  className={`w-6 h-0.5 transition-colors duration-300 ${
                    status === 'resolved' ? 'bg-gray-400' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Event Sequence */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-text-light uppercase tracking-wide">
          Ereignissequenz (Startzustand: Anfaenger, ep = {INITIAL_VARIABLE})
        </h4>

        <AnimatePresence mode="popLayout">
          {eventSteps.map((step, index) => {
            const status = getStepStatus(index)
            const stepResult = stepResults[step.id]
            const isResolved = status === 'resolved'
            const isActive = status === 'active'
            const isFuture = status === 'future'
            const currentAttempts = attemptsPerStep[step.id] || 0
            const isShaking = shakeStep === step.id

            if (isFuture) {
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.4, y: 0 }}
                  className="bg-gray-50 rounded-lg border-2 border-gray-200 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-400 font-bold text-sm flex-shrink-0">
                      {step.id}
                    </span>
                    <span className="font-mono text-sm text-gray-400">
                      {step.event}
                    </span>
                    <span className="text-xs text-gray-300 italic ml-auto">
                      Noch nicht freigeschaltet
                    </span>
                  </div>
                </motion.div>
              )
            }

            return (
              <motion.div
                key={step.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: isShaking ? [0, -8, 8, -6, 6, -3, 3, 0] : 0,
                }}
                transition={
                  isShaking
                    ? { duration: 0.4, ease: 'easeInOut' }
                    : { duration: 0.3, delay: isActive ? 0.1 : 0 }
                }
                className={`rounded-lg border-2 p-4 transition-colors duration-300 ${
                  isResolved
                    ? stepResult?.correct
                      ? 'bg-green-50 border-green-300'
                      : 'bg-red-50 border-red-300'
                    : isActive
                      ? 'bg-white border-primary shadow-md shadow-primary/10'
                      : 'bg-white border-border'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Step number & event */}
                  <div className="flex items-center gap-3 flex-shrink-0 min-w-0 sm:min-w-[220px]">
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm flex-shrink-0 transition-colors ${
                        isResolved
                          ? stepResult?.correct
                            ? 'bg-green-500 text-white'
                            : 'bg-red-400 text-white'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {isResolved ? (
                        stepResult?.correct ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )
                      ) : (
                        step.id
                      )}
                    </span>
                    <div>
                      <span className="font-mono text-sm font-semibold text-text">
                        {step.event}
                      </span>
                      <span className="block text-xs text-text-light">
                        ep = {step.variableBefore}
                      </span>
                    </div>
                  </div>

                  {/* State selection buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {STATES.map((state) => {
                      const colors = stateColors[state]
                      const isCorrectOption = isResolved && state === step.correctState
                      const isWrongSelection =
                        isResolved && !stepResult?.correct && state === stepResult?.answer

                      return (
                        <button
                          key={state}
                          onClick={() => handleSelectState(step.id, state)}
                          disabled={isResolved || isFuture || isAdvancing}
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${colors.glow.replace('ring-', 'focus:ring-')} ${
                            isCorrectOption
                              ? `${colors.bg} ${colors.border} ${colors.text} ring-2 ring-green-500`
                              : isWrongSelection
                                ? 'bg-red-100 border-red-400 text-red-700 ring-2 ring-red-400'
                                : isResolved
                                  ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-default'
                                  : isActive
                                    ? `bg-white border-gray-200 text-gray-600 hover:${colors.bg} hover:${colors.border} hover:${colors.text} cursor-pointer`
                                    : 'bg-gray-50 border-gray-200 text-gray-400 cursor-default'
                          }`}
                          aria-label={`Zustand ${state} fuer Ereignis ${step.id}`}
                        >
                          {state}
                        </button>
                      )
                    })}
                  </div>

                  {/* Attempt indicator for active step */}
                  {isActive && currentAttempts > 0 && !stepResult && (
                    <span className="text-xs text-red-500 font-medium ml-auto flex-shrink-0">
                      Versuch {currentAttempts} / {MAX_ATTEMPTS_PER_STEP}
                    </span>
                  )}
                </div>

                {/* Guard evaluation and explanation -- only shown after resolved */}
                <AnimatePresence>
                  {isResolved && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 text-xs text-text-light font-mono bg-slate-50 rounded p-2 space-y-1">
                        <div>
                          Guard: {step.guardEvaluated}{' '}
                          <span
                            className={
                              step.guardMet ? 'text-green-600 font-bold' : 'text-red-500 font-bold'
                            }
                          >
                            {step.guardMet ? 'ERFUELLT' : 'NICHT ERFUELLT'}
                          </span>
                        </div>
                        <div className="text-sm text-text-light mt-1">
                          {step.explanation}
                        </div>
                        {!stepResult?.correct && (
                          <div className="text-sm text-red-600 mt-1 font-sans font-medium">
                            Richtige Antwort: {step.correctState}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Final Feedback */}
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
