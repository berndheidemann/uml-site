import { useState } from 'react'
import { ExerciseFeedback } from '../../common/ExerciseFeedback.tsx'
import { useExercise } from '../../../hooks/useExercise.ts'
import { evaluateGuard } from '../../../utils/guard-evaluator.ts'
import type { GuardEvaluatorExercise } from '../../../types/index.ts'

interface Props {
  exercise: GuardEvaluatorExercise
  onNext?: () => void
}

export function GuardEvaluatorComponent({ exercise, onNext }: Props) {
  const { result, showHints, submit, reset, toggleHints } = useExercise<Record<number, string | null>>(exercise)
  const [currentScenario, setCurrentScenario] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string | null>>({})
  const [variables, setVariables] = useState<Record<string, number | boolean>>(() => {
    const initial: Record<string, number | boolean> = {}
    for (const v of exercise.variables) {
      initial[v.name] = v.defaultValue
    }
    return initial
  })

  const scenario = exercise.scenarios[currentScenario]

  // Apply scenario variables
  const activeVars = { ...variables, ...scenario.variableValues }

  const handleSelectTransition = (transitionId: string | null) => {
    if (result) return
    setAnswers((prev) => ({ ...prev, [currentScenario]: transitionId }))
  }

  const handleNextScenario = () => {
    if (currentScenario < exercise.scenarios.length - 1) {
      setCurrentScenario((s) => s + 1)
    } else {
      // Submit
      submit(() => {
        let correct = 0
        for (let i = 0; i < exercise.scenarios.length; i++) {
          if (answers[i] === exercise.scenarios[i].correctTransitionId) correct++
        }
        const score = Math.round((correct / exercise.scenarios.length) * exercise.maxPoints)
        return {
          correct: correct === exercise.scenarios.length,
          score,
          maxScore: exercise.maxPoints,
          feedback: `${correct} von ${exercise.scenarios.length} Szenarien korrekt bewertet.`,
        }
      })
    }
  }

  const handleReset = () => {
    reset()
    setCurrentScenario(0)
    setAnswers({})
  }

  // Determine which transitions are possible from the current state
  const availableTransitions = exercise.transitions.filter(
    (t) => t.from === scenario.currentState
  )

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light">{exercise.description}</p>
      </div>

      <div className="text-sm text-text-light">
        Szenario {currentScenario + 1} von {exercise.scenarios.length}
      </div>

      {/* State diagram visualization */}
      <div className="bg-white rounded-lg border border-border p-4">
        <svg viewBox="0 0 750 300" className="w-full max-w-3xl mx-auto" role="img" aria-label="Zustandsdiagramm">
          {/* States */}
          {exercise.states.map((state) => {
            const isCurrent = state.id === scenario.currentState
            return (
              <g key={state.id}>
                <rect
                  x={state.x - 50}
                  y={state.y - 25}
                  width={100}
                  height={50}
                  rx={15}
                  fill={isCurrent ? '#dbeafe' : 'white'}
                  stroke={isCurrent ? '#2563eb' : '#1e293b'}
                  strokeWidth={isCurrent ? 3 : 2}
                />
                <text
                  x={state.x}
                  y={state.y + 5}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={isCurrent ? 'bold' : 'normal'}
                  fill="#1e293b"
                >
                  {state.label}
                </text>
              </g>
            )
          })}

          {/* Transitions */}
          {exercise.transitions.map((t) => {
            const from = exercise.states.find((s) => s.id === t.from)!
            const to = exercise.states.find((s) => s.id === t.to)!
            const isAvailable = t.from === scenario.currentState
            const guardMet = evaluateGuard(t.guardExpression, activeVars)
            const isSelected = answers[currentScenario] === t.id

            let color = '#94a3b8' // disabled
            if (isAvailable && guardMet) color = '#16a34a' // green
            else if (isAvailable && !guardMet) color = '#dc2626' // red - blocked
            if (isSelected) color = '#2563eb' // selected

            const dx = to.x - from.x
            const dy = to.y - from.y
            const len = Math.sqrt(dx * dx + dy * dy)
            const offset = 55
            const x1 = from.x + (dx / len) * offset
            const y1 = from.y + (dy / len) * offset
            const x2 = to.x - (dx / len) * offset
            const y2 = to.y - (dy / len) * offset

            return (
              <g key={t.id} opacity={isAvailable ? 1 : 0.3}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2} />
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 8}
                  textAnchor="middle"
                  fontSize={9}
                  fill={color}
                >
                  {t.event} {t.guard}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Variables display */}
      <div className="bg-surface rounded-lg p-4">
        <h4 className="text-sm font-semibold text-text mb-2">Aktuelle Variablenwerte:</h4>
        <div className="flex flex-wrap gap-4">
          {exercise.variables.map((v) => (
            <div key={v.name} className="flex items-center gap-2">
              <span className="text-sm font-mono text-text">{v.name} =</span>
              {v.type === 'number' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={v.min ?? 0}
                    max={v.max ?? 100}
                    value={activeVars[v.name] as number}
                    onChange={(e) => setVariables((prev) => ({ ...prev, [v.name]: parseInt(e.target.value) }))}
                    disabled={!!result || scenario.variableValues[v.name] !== undefined}
                    className="w-24"
                    aria-label={v.name}
                  />
                  <span className="text-sm font-bold text-primary w-8">{activeVars[v.name] as number}</span>
                </div>
              ) : (
                <span className="text-sm font-bold text-primary">{String(activeVars[v.name])}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Transition selection */}
      <div>
        <p className="text-sm font-medium text-text mb-3">
          Aktueller Zustand: <strong>{scenario.currentState}</strong> — Welche Transition feuert?
        </p>
        <div className="space-y-2">
          {availableTransitions.map((t) => {
            const guardMet = evaluateGuard(t.guardExpression, activeVars)
            const isSelected = answers[currentScenario] === t.id

            return (
              <label
                key={t.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                } ${!guardMet ? 'opacity-60' : ''} ${result ? 'cursor-default' : ''}`}
              >
                <input
                  type="radio"
                  name={`guard-${currentScenario}`}
                  checked={isSelected}
                  onChange={() => handleSelectTransition(t.id)}
                  disabled={!!result}
                />
                <div>
                  <span className="text-text">{t.event} {t.guard}</span>
                  <span className="text-text-light text-sm ml-2">→ {t.to}</span>
                  {!guardMet && <span className="ml-2 text-xs text-error">(Guard nicht erfüllt)</span>}
                </div>
              </label>
            )
          })}
          <label
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
              answers[currentScenario] === null ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            } ${result ? 'cursor-default' : ''}`}
          >
            <input
              type="radio"
              name={`guard-${currentScenario}`}
              checked={answers[currentScenario] === null}
              onChange={() => handleSelectTransition(null)}
              disabled={!!result}
            />
            <span className="text-text">Keine Transition feuert</span>
          </label>
        </div>
      </div>

      {!result && (
        <button
          onClick={handleNextScenario}
          disabled={answers[currentScenario] === undefined}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {currentScenario < exercise.scenarios.length - 1 ? 'Nächstes Szenario' : 'Überprüfen'}
        </button>
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
