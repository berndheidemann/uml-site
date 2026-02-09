import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { evaluateGuard, evaluateExpression } from '../../../utils/guard-evaluator.ts'
import { ExerciseFeedback } from '../../common/ExerciseFeedback.tsx'
import { useExercise } from '../../../hooks/useExercise.ts'
import type { SimulatorExercise, SimulatorTransition } from '../../../types/index.ts'

interface HistoryEntry {
  event: string
  fromState: string
  toState: string
  action?: string
  guardInfo?: string
}

interface Props {
  exercise: SimulatorExercise
  onNext?: () => void
}

export function ZustandsautomatSimulator({ exercise, onNext }: Props) {
  const { result, showHints, submit, reset, toggleHints } = useExercise<HistoryEntry[]>(exercise)
  const [currentState, setCurrentState] = useState(exercise.states.find((s) => s.isInitial)?.id ?? exercise.states[0].id)
  const [variables, setVariables] = useState<Record<string, number | boolean>>(() => {
    const initial: Record<string, number | boolean> = {}
    for (const v of exercise.variables) {
      initial[v.name] = v.defaultValue
    }
    return initial
  })
  const [history, setHistory] = useState<HistoryEntry[]>([])

  const currentStateObj = exercise.states.find((s) => s.id === currentState)!
  const isFinalState = currentStateObj.isFinal

  // Get available events from current state
  const availableEvents = [...new Set(
    exercise.transitions
      .filter((t) => t.from === currentState)
      .map((t) => t.event)
  )]

  const fireEvent = useCallback((event: string) => {
    if (result || isFinalState) return

    // Find matching transitions
    const candidates = exercise.transitions.filter(
      (t) => t.from === currentState && t.event === event
    )

    // Evaluate guards
    let firedTransition: SimulatorTransition | null = null
    for (const t of candidates) {
      if (!t.guardExpression || evaluateGuard(t.guardExpression, variables)) {
        firedTransition = t
        break
      }
    }

    if (!firedTransition) {
      setHistory((h) => [...h, {
        event,
        fromState: currentState,
        toState: currentState,
        guardInfo: 'Kein Guard erfüllt — Transition blockiert',
      }])
      return
    }

    // Apply variable updates
    const newVars = { ...variables }
    if (firedTransition.variableUpdates) {
      for (const [varName, expr] of Object.entries(firedTransition.variableUpdates)) {
        newVars[varName] = evaluateExpression(expr, variables)
      }
    }

    const entry: HistoryEntry = {
      event,
      fromState: currentState,
      toState: firedTransition.to,
      action: firedTransition.action,
      guardInfo: firedTransition.guard,
    }

    setVariables(newVars)
    setCurrentState(firedTransition.to)
    setHistory((h) => [...h, entry])
  }, [currentState, variables, exercise.transitions, result, isFinalState])

  const handleSubmit = () => {
    submit(() => {
      if (!exercise.expectedSequence) {
        return {
          correct: !!isFinalState,
          score: isFinalState ? exercise.maxPoints : Math.round(exercise.maxPoints * 0.5),
          maxScore: exercise.maxPoints,
          feedback: isFinalState ? 'Endzustand erreicht!' : 'Der Automat ist noch nicht im Endzustand.',
        }
      }

      let correct = 0
      for (let i = 0; i < exercise.expectedSequence.length; i++) {
        if (i < history.length && history[i].toState === exercise.expectedSequence[i].expectedState) {
          correct++
        }
      }
      const score = Math.round((correct / exercise.expectedSequence.length) * exercise.maxPoints)
      return {
        correct: correct === exercise.expectedSequence.length,
        score,
        maxScore: exercise.maxPoints,
        feedback: correct === exercise.expectedSequence.length
          ? 'Perfekt! Alle erwarteten Zustandsübergänge korrekt durchlaufen.'
          : `${correct} von ${exercise.expectedSequence.length} erwarteten Übergängen korrekt.`,
      }
    })
  }

  const handleReset = () => {
    reset()
    setCurrentState(exercise.states.find((s) => s.isInitial)?.id ?? exercise.states[0].id)
    const initial: Record<string, number | boolean> = {}
    for (const v of exercise.variables) {
      initial[v.name] = v.defaultValue
    }
    setVariables(initial)
    setHistory([])
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light">{exercise.description}</p>
      </div>

      {/* State diagram */}
      <div className="bg-white rounded-lg border border-border p-4 overflow-x-auto">
        <svg viewBox="0 0 850 500" className="w-full max-w-4xl mx-auto" role="img" aria-label="Interaktiver Zustandsautomat">
          {/* Transitions */}
          {exercise.transitions.map((t) => {
            const from = exercise.states.find((s) => s.id === t.from)!
            const to = exercise.states.find((s) => s.id === t.to)!
            const isFromCurrent = t.from === currentState
            const canFire = isFromCurrent && (!t.guardExpression || evaluateGuard(t.guardExpression, variables))

            // Self-transition
            if (t.from === t.to) {
              const cx = from.x
              const cy = from.y - 50
              return (
                <g key={t.id} opacity={isFromCurrent ? 1 : 0.3}>
                  <path
                    d={`M ${from.x - 20} ${from.y - 25} C ${cx - 40} ${cy - 30}, ${cx + 40} ${cy - 30}, ${from.x + 20} ${from.y - 25}`}
                    fill="none"
                    stroke={canFire ? '#16a34a' : '#94a3b8'}
                    strokeWidth={2}
                  />
                  <text x={cx} y={cy - 20} textAnchor="middle" fontSize={9} fill={canFire ? '#16a34a' : '#94a3b8'}>
                    {t.event} {t.guard ?? ''}
                  </text>
                </g>
              )
            }

            const dx = to.x - from.x
            const dy = to.y - from.y
            const len = Math.sqrt(dx * dx + dy * dy)
            const offset = 55
            const x1 = from.x + (dx / len) * offset
            const y1 = from.y + (dy / len) * offset
            const x2 = to.x - (dx / len) * offset
            const y2 = to.y - (dy / len) * offset

            const color = canFire ? '#16a34a' : isFromCurrent ? '#dc2626' : '#94a3b8'

            return (
              <g key={t.id} opacity={isFromCurrent ? 1 : 0.3}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2} />
                {/* Arrow */}
                <polygon
                  points={`${x2},${y2} ${x2 - (dx / len) * 10 + (dy / len) * 5},${y2 - (dy / len) * 10 - (dx / len) * 5} ${x2 - (dx / len) * 10 - (dy / len) * 5},${y2 - (dy / len) * 10 + (dx / len) * 5}`}
                  fill={color}
                />
                <text
                  x={(x1 + x2) / 2 + (dy / len) * 12}
                  y={(y1 + y2) / 2 - (dx / len) * 12}
                  textAnchor="middle"
                  fontSize={9}
                  fill={color}
                >
                  {t.event} {t.guard ?? ''}
                </text>
                {t.action && (
                  <text
                    x={(x1 + x2) / 2 + (dy / len) * 12}
                    y={(y1 + y2) / 2 - (dx / len) * 12 + 12}
                    textAnchor="middle"
                    fontSize={8}
                    fill="#64748b"
                  >
                    / {t.action}
                  </text>
                )}
              </g>
            )
          })}

          {/* States */}
          {exercise.states.map((state) => {
            const isCurrent = state.id === currentState
            const hasActions = state.entryAction || state.doAction || state.exitAction
            const height = hasActions ? 70 : 50

            return (
              <g key={state.id}>
                {isCurrent && (
                  <motion.rect
                    x={state.x - 55}
                    y={state.y - height / 2 - 5}
                    width={110}
                    height={height + 10}
                    rx={18}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth={3}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                <rect
                  x={state.x - 50}
                  y={state.y - height / 2}
                  width={100}
                  height={height}
                  rx={15}
                  fill={isCurrent ? '#dbeafe' : state.isFinal ? '#f0fdf4' : 'white'}
                  stroke={isCurrent ? '#2563eb' : state.isFinal ? '#16a34a' : '#1e293b'}
                  strokeWidth={2}
                />
                <text
                  x={state.x}
                  y={state.y - (hasActions ? 10 : 0) + 5}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight="bold"
                  fill="#1e293b"
                >
                  {state.label}
                </text>
                {hasActions && (
                  <>
                    <line x1={state.x - 48} y1={state.y} x2={state.x + 48} y2={state.y} stroke="#e2e8f0" strokeWidth={1} />
                    {state.entryAction && (
                      <text x={state.x - 45} y={state.y + 14} fontSize={8} fill="#64748b">entry / {state.entryAction}</text>
                    )}
                    {state.doAction && (
                      <text x={state.x - 45} y={state.y + 24} fontSize={8} fill="#64748b">do / {state.doAction}</text>
                    )}
                  </>
                )}
                {/* Initial state indicator */}
                {state.isInitial && (
                  <>
                    <circle cx={state.x - 80} cy={state.y} r={8} fill="#1e293b" />
                    <line x1={state.x - 72} y1={state.y} x2={state.x - 52} y2={state.y} stroke="#1e293b" strokeWidth={2} />
                  </>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Variables & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Variables */}
        <div className="bg-surface rounded-lg p-4">
          <h4 className="text-sm font-semibold text-text mb-3">Variablen:</h4>
          {exercise.variables.map((v) => (
            <div key={v.name} className="flex items-center justify-between mb-2">
              <span className="text-sm font-mono text-text">{v.name}</span>
              {v.type === 'boolean' ? (
                <button
                  onClick={() => setVariables((prev) => ({ ...prev, [v.name]: !prev[v.name] }))}
                  disabled={!!result}
                  className={`px-3 py-1 rounded text-sm font-bold ${
                    variables[v.name] ? 'bg-success text-white' : 'bg-error text-white'
                  } disabled:opacity-50`}
                >
                  {String(variables[v.name])}
                </button>
              ) : (
                <span className="text-lg font-bold text-primary">{variables[v.name] as number}</span>
              )}
            </div>
          ))}
        </div>

        {/* Event buttons */}
        <div className="bg-surface rounded-lg p-4">
          <h4 className="text-sm font-semibold text-text mb-3">Ereignisse auslösen:</h4>
          <div className="flex flex-wrap gap-2">
            {availableEvents.map((event) => {
              const transitions = exercise.transitions.filter(
                (t) => t.from === currentState && t.event === event
              )
              const canFire = transitions.some(
                (t) => !t.guardExpression || evaluateGuard(t.guardExpression, variables)
              )

              return (
                <button
                  key={event}
                  onClick={() => fireEvent(event)}
                  disabled={!!result || isFinalState}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    canFire
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'bg-surface-dark text-text-light cursor-not-allowed'
                  } disabled:opacity-50`}
                  title={canFire ? '' : 'Guard nicht erfüllt'}
                >
                  {event}
                </button>
              )
            })}
            {isFinalState && (
              <p className="text-sm text-success font-medium w-full">Endzustand erreicht</p>
            )}
          </div>
        </div>
      </div>

      {/* History log */}
      {history.length > 0 && (
        <div className="bg-surface rounded-lg p-4">
          <h4 className="text-sm font-semibold text-text mb-2">Verlauf:</h4>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {history.map((entry, i) => (
              <div key={i} className="text-sm flex items-center gap-2">
                <span className="text-text-light font-mono w-6">{i + 1}.</span>
                <span className="text-text">{entry.event}</span>
                <span className="text-text-light">:</span>
                <span className="font-medium text-primary">{entry.fromState}</span>
                <span className="text-text-light">→</span>
                <span className="font-medium text-primary">{entry.toState}</span>
                {entry.action && <span className="text-text-light text-xs">/ {entry.action}</span>}
                {entry.guardInfo?.includes('blockiert') && (
                  <span className="text-xs text-error">(blockiert)</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!result && (
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={history.length === 0 && !isFinalState}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Auswerten
          </button>
          {history.length > 0 && (
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-border text-text rounded-lg hover:bg-surface-dark"
            >
              Zurücksetzen
            </button>
          )}
        </div>
      )}

      {result && (
        <ExerciseFeedback
          result={result}
          hints={exercise.hints}
          showHints={showHints}
          onToggleHints={toggleHints}
          onRetry={handleReset}
          onNext={onNext}
        />
      )}
    </div>
  )
}
