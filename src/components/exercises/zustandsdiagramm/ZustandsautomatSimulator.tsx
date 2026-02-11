import { useState, useCallback, useEffect } from 'react'
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

interface Goal {
  id: string
  label: string
  achieved: boolean
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
  const [goals, setGoals] = useState<Goal[]>([
    { id: 'goal-kaufen', label: 'Kaufe ein Getränk erfolgreich', achieved: false },
    { id: 'goal-guard-block', label: 'Erlebe eine Guard-Blockierung', achieved: false },
    { id: 'goal-wartung', label: 'Löse den Wartungszustand aus', achieved: false },
  ])

  const currentStateObj = exercise.states.find((s) => s.id === currentState)!
  const isFinalState = currentStateObj.isFinal

  // Get available events from current state
  const availableEvents = [...new Set(
    exercise.transitions
      .filter((t) => t.from === currentState)
      .map((t) => t.event)
  )]

  // Check if all goals are achieved
  const allGoalsAchieved = goals.every((g) => g.achieved)

  // Auto-submit when all goals are achieved
  useEffect(() => {
    if (allGoalsAchieved && !result) {
      handleSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allGoalsAchieved])

  const fireEvent = useCallback((event: string) => {
    if (result) return

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

    // Check for guard-block goal: self-transition with a guard that acts as a block
    // (e.g. bezahlen() with guthaben < 2 stays in same state with error action)
    if (firedTransition.from === firedTransition.to && firedTransition.guard && firedTransition.action) {
      setGoals((prev) => prev.map((g) =>
        g.id === 'goal-guard-block' ? { ...g, achieved: true } : g
      ))
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

    // Check goal: reached "ausgabe" state (successful purchase)
    if (firedTransition.to === 'ausgabe') {
      setGoals((prev) => prev.map((g) =>
        g.id === 'goal-kaufen' ? { ...g, achieved: true } : g
      ))
    }

    // Check goal: reached "wartung" state
    if (firedTransition.to === 'wartung') {
      setGoals((prev) => prev.map((g) =>
        g.id === 'goal-wartung' ? { ...g, achieved: true } : g
      ))
    }
  }, [currentState, variables, exercise.transitions, result])

  const handleSubmit = () => {
    submit(() => {
      const achievedCount = goals.filter((g) => g.achieved).length
      const score = achievedCount
      return {
        correct: achievedCount === exercise.maxPoints,
        score,
        maxScore: exercise.maxPoints,
        feedback: achievedCount === exercise.maxPoints
          ? 'Perfekt! Alle drei Aufgaben gelöst. Du hast den Kaffeeautomaten in allen Szenarien erprobt.'
          : `${achievedCount} von ${exercise.maxPoints} Aufgaben gelöst. Setze den Simulator zurück und probiere die fehlenden Szenarien aus.`,
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
    setGoals([
      { id: 'goal-kaufen', label: 'Kaufe ein Getränk erfolgreich', achieved: false },
      { id: 'goal-guard-block', label: 'Erlebe eine Guard-Blockierung', achieved: false },
      { id: 'goal-wartung', label: 'Löse den Wartungszustand aus', achieved: false },
    ])
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light">{exercise.description}</p>
      </div>

      {/* Goals checklist */}
      <div className="bg-surface rounded-lg p-4">
        <h4 className="text-sm font-semibold text-text mb-3">Aufgaben:</h4>
        <div className="space-y-2">
          {goals.map((goal) => (
            <div key={goal.id} className="flex items-center gap-3">
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full border-2 text-sm font-bold transition-colors ${
                  goal.achieved
                    ? 'bg-success border-success text-white'
                    : 'border-border text-text-light'
                }`}
                aria-label={goal.achieved ? 'Erledigt' : 'Offen'}
              >
                {goal.achieved ? '\u2713' : ''}
              </span>
              <span className={`text-sm ${goal.achieved ? 'text-success font-medium line-through' : 'text-text'}`}>
                {goal.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* State diagram */}
      <div className="bg-white rounded-lg border border-border p-4 overflow-x-auto">
        <svg viewBox="0 0 900 500" className="w-full max-w-4xl mx-auto" role="img" aria-label="Interaktiver Zustandsautomat: Kaffeeautomat">
          {/* Transitions */}
          {exercise.transitions.map((t) => {
            const from = exercise.states.find((s) => s.id === t.from)!
            const to = exercise.states.find((s) => s.id === t.to)!
            const isFromCurrent = t.from === currentState
            const canFire = isFromCurrent && (!t.guardExpression || evaluateGuard(t.guardExpression, variables))

            // Self-transition
            if (t.from === t.to) {
              // Check if there are multiple self-transitions on this state
              const selfTransitions = exercise.transitions.filter(
                (tr) => tr.from === t.from && tr.to === t.to
              )
              const selfIndex = selfTransitions.indexOf(t)

              // Offset each self-transition to avoid overlap
              const baseAngle = -90 // top of the state
              const angleOffset = selfIndex * 60 - ((selfTransitions.length - 1) * 30)
              const angleRad = ((baseAngle + angleOffset) * Math.PI) / 180
              const cx = from.x + Math.cos(angleRad) * 60
              const cy = from.y + Math.sin(angleRad) * 60

              const startAngle = angleRad - 0.4
              const endAngle = angleRad + 0.4
              const startX = from.x + Math.cos(startAngle) * 50
              const startY = from.y + Math.sin(startAngle) * 50
              const endX = from.x + Math.cos(endAngle) * 50
              const endY = from.y + Math.sin(endAngle) * 50

              const cp1x = from.x + Math.cos(angleRad - 0.2) * 110
              const cp1y = from.y + Math.sin(angleRad - 0.2) * 110
              const cp2x = from.x + Math.cos(angleRad + 0.2) * 110
              const cp2y = from.y + Math.sin(angleRad + 0.2) * 110

              return (
                <g key={t.id} opacity={isFromCurrent ? 1 : 0.3}>
                  <path
                    d={`M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`}
                    fill="none"
                    stroke={canFire ? '#16a34a' : '#94a3b8'}
                    strokeWidth={2}
                    markerEnd={canFire ? 'url(#arrow-green)' : 'url(#arrow-gray)'}
                  />
                  <text x={cx} y={cy - 8} textAnchor="middle" fontSize={8} fill={canFire ? '#16a34a' : '#94a3b8'}>
                    {t.event}
                  </text>
                  {t.guard && (
                    <text x={cx} y={cy + 3} textAnchor="middle" fontSize={7} fill={canFire ? '#16a34a' : '#94a3b8'}>
                      {t.guard}
                    </text>
                  )}
                </g>
              )
            }

            // Check for duplicate transitions between same pair of states
            const parallelTransitions = exercise.transitions.filter(
              (tr) => tr.from === t.from && tr.to === t.to && tr.from !== tr.to
            )
            const parallelIndex = parallelTransitions.indexOf(t)
            const hasParallel = parallelTransitions.length > 1

            const dx = to.x - from.x
            const dy = to.y - from.y
            const len = Math.sqrt(dx * dx + dy * dy)
            const offset = 55

            // Perpendicular offset for parallel transitions
            const perpOffset = hasParallel ? (parallelIndex - (parallelTransitions.length - 1) / 2) * 20 : 0
            const perpX = -(dy / len) * perpOffset
            const perpY = (dx / len) * perpOffset

            const x1 = from.x + (dx / len) * offset + perpX
            const y1 = from.y + (dy / len) * offset + perpY
            const x2 = to.x - (dx / len) * offset + perpX
            const y2 = to.y - (dy / len) * offset + perpY

            const color = canFire ? '#16a34a' : isFromCurrent ? '#dc2626' : '#94a3b8'

            // Use a curved path for parallel transitions
            const midX = (x1 + x2) / 2 + perpX
            const midY = (y1 + y2) / 2 + perpY

            return (
              <g key={t.id} opacity={isFromCurrent ? 1 : 0.3}>
                {hasParallel ? (
                  <path
                    d={`M ${x1} ${y1} Q ${midX + perpX} ${midY + perpY}, ${x2} ${y2}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                  />
                ) : (
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2} />
                )}
                {/* Arrow */}
                <polygon
                  points={`${x2},${y2} ${x2 - (dx / len) * 10 + (dy / len) * 5},${y2 - (dy / len) * 10 - (dx / len) * 5} ${x2 - (dx / len) * 10 - (dy / len) * 5},${y2 - (dy / len) * 10 + (dx / len) * 5}`}
                  fill={color}
                />
                <text
                  x={hasParallel ? midX + perpX : (x1 + x2) / 2 + (dy / len) * 12}
                  y={hasParallel ? midY + perpY - 8 : (y1 + y2) / 2 - (dx / len) * 12}
                  textAnchor="middle"
                  fontSize={8}
                  fill={color}
                >
                  {t.event} {t.guard ?? ''}
                </text>
                {t.action && (
                  <text
                    x={hasParallel ? midX + perpX : (x1 + x2) / 2 + (dy / len) * 12}
                    y={hasParallel ? midY + perpY + 4 : (y1 + y2) / 2 - (dx / len) * 12 + 12}
                    textAnchor="middle"
                    fontSize={7}
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
            const actionCount = [state.entryAction, state.doAction, state.exitAction].filter(Boolean).length
            const height = hasActions ? 50 + actionCount * 12 : 50

            return (
              <g key={state.id}>
                {isCurrent && (
                  <motion.rect
                    x={state.x - 60}
                    y={state.y - height / 2 - 5}
                    width={120}
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
                  x={state.x - 55}
                  y={state.y - height / 2}
                  width={110}
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
                    <line x1={state.x - 53} y1={state.y} x2={state.x + 53} y2={state.y} stroke="#e2e8f0" strokeWidth={1} />
                    {state.entryAction && (
                      <text x={state.x - 48} y={state.y + 14} fontSize={7} fill="#64748b">entry / {state.entryAction}</text>
                    )}
                    {state.doAction && (
                      <text x={state.x - 48} y={state.y + 14 + (state.entryAction ? 11 : 0)} fontSize={7} fill="#64748b">do / {state.doAction}</text>
                    )}
                  </>
                )}
                {/* Initial state indicator */}
                {state.isInitial && (
                  <>
                    <circle cx={state.x - 85} cy={state.y} r={8} fill="#1e293b" />
                    <line x1={state.x - 77} y1={state.y} x2={state.x - 57} y2={state.y} stroke="#1e293b" strokeWidth={2} />
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
            <div key={v.name} className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-mono text-text">{v.name}</span>
                <span className="text-lg font-bold text-primary">{variables[v.name] as number}</span>
              </div>
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setVariables((prev) => ({
                        ...prev,
                        [v.name]: Math.max(v.min ?? 0, (prev[v.name] as number) - 1),
                      }))
                    }
                    disabled={!!result || (variables[v.name] as number) <= (v.min ?? 0)}
                    className="w-8 h-8 flex items-center justify-center rounded bg-surface-dark text-text font-bold text-lg hover:bg-border disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                    aria-label={`${v.name} verringern`}
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min={v.min ?? 0}
                    max={v.max ?? 100}
                    value={variables[v.name] as number}
                    onChange={(e) =>
                      setVariables((prev) => ({
                        ...prev,
                        [v.name]: parseInt(e.target.value, 10),
                      }))
                    }
                    disabled={!!result}
                    className="flex-1 h-2 accent-primary disabled:opacity-50"
                    aria-label={`${v.name} Wert`}
                  />
                  <button
                    onClick={() =>
                      setVariables((prev) => ({
                        ...prev,
                        [v.name]: Math.min(v.max ?? 100, (prev[v.name] as number) + 1),
                      }))
                    }
                    disabled={!!result || (variables[v.name] as number) >= (v.max ?? 100)}
                    className="w-8 h-8 flex items-center justify-center rounded bg-surface-dark text-text font-bold text-lg hover:bg-border disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                    aria-label={`${v.name} erhöhen`}
                  >
                    +
                  </button>
                  <span className="text-xs text-text-light w-16 text-right">
                    ({v.min ?? 0}–{v.max ?? 100})
                  </span>
                </div>
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
                  disabled={!!result || !!isFinalState}
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
                <span className="text-text-light">{'\u2192'}</span>
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
            disabled={history.length === 0}
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
