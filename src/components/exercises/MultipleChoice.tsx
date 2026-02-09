import { useState } from 'react'
import { ExerciseFeedback } from '../common/ExerciseFeedback.tsx'
import { useExercise } from '../../hooks/useExercise.ts'
import { validateMultipleChoice } from '../../utils/exercise-validators.ts'
import type { MultipleChoiceExercise, DecisionExercise } from '../../types/index.ts'

// === Multiple Choice ===

interface MCProps {
  exercise: MultipleChoiceExercise
  onNext?: () => void
}

export function MultipleChoiceComponent({ exercise, onNext }: MCProps) {
  const { result, showHints, submit, reset, toggleHints } = useExercise<string[]>(exercise)
  const [selected, setSelected] = useState<string[]>([])

  const toggleOption = (optionId: string) => {
    if (result) return
    if (exercise.multiSelect) {
      setSelected((prev) =>
        prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
      )
    } else {
      setSelected([optionId])
    }
  }

  const handleSubmit = () => {
    submit(() => validateMultipleChoice(selected, exercise.correctOptionIds, exercise.maxPoints))
  }

  const handleReset = () => {
    reset()
    setSelected([])
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light mb-4">{exercise.description}</p>
        <p className="font-medium text-text">{exercise.question}</p>
      </div>

      <fieldset>
        <legend className="sr-only">{exercise.question}</legend>
        <div className="space-y-2">
          {exercise.options.map((option) => {
            const isSelected = selected.includes(option.id)
            const isCorrectOption = exercise.correctOptionIds.includes(option.id)
            let borderColor = 'border-border'
            if (result) {
              if (isSelected && isCorrectOption) borderColor = 'border-success bg-green-50'
              else if (isSelected && !isCorrectOption) borderColor = 'border-error bg-red-50'
              else if (!isSelected && isCorrectOption) borderColor = 'border-success/50 bg-green-50/50'
            } else if (isSelected) {
              borderColor = 'border-primary bg-primary/5'
            }

            return (
              <label
                key={option.id}
                className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${borderColor} ${
                  result ? 'cursor-default' : 'hover:border-primary/50'
                }`}
              >
                <input
                  type={exercise.multiSelect ? 'checkbox' : 'radio'}
                  name={exercise.id}
                  checked={isSelected}
                  onChange={() => toggleOption(option.id)}
                  disabled={!!result}
                  className="mt-1"
                />
                <div>
                  <span className="text-text">{option.text}</span>
                  {result && option.explanation && (
                    <p className="text-sm text-text-light mt-1">{option.explanation}</p>
                  )}
                </div>
              </label>
            )
          })}
        </div>
      </fieldset>

      {!result && (
        <button
          onClick={handleSubmit}
          disabled={selected.length === 0}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Überprüfen
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

// === Decision (Scenario-based) ===

interface DecisionProps {
  exercise: DecisionExercise
  onNext?: () => void
}

export function DecisionComponent({ exercise, onNext }: DecisionProps) {
  const { result, showHints, submit, reset, toggleHints } = useExercise<Record<string, string>>(exercise)
  const [currentScenario, setCurrentScenario] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [criteriaAnswers, setCriteriaAnswers] = useState<Record<string, Record<string, string>>>({})

  const scenario = exercise.scenarios[currentScenario]

  const handleSelect = (optionId: string) => {
    if (result) return
    setAnswers((prev) => ({ ...prev, [scenario.id]: optionId }))
  }

  const handleCriteria = (criterionId: string, value: string) => {
    if (result) return
    setCriteriaAnswers((prev) => ({
      ...prev,
      [scenario.id]: { ...(prev[scenario.id] ?? {}), [criterionId]: value },
    }))
  }

  const handleNext = () => {
    if (currentScenario < exercise.scenarios.length - 1) {
      setCurrentScenario((c) => c + 1)
    } else {
      // Submit all
      submit(() => {
        let correctCount = 0
        for (const s of exercise.scenarios) {
          if (answers[s.id] === s.correctOptionId) correctCount++
        }
        const score = Math.round((correctCount / exercise.scenarios.length) * exercise.maxPoints)
        return {
          correct: correctCount === exercise.scenarios.length,
          score,
          maxScore: exercise.maxPoints,
          feedback: `${correctCount} von ${exercise.scenarios.length} Szenarien korrekt bewertet.`,
        }
      })
    }
  }

  const handleReset = () => {
    reset()
    setCurrentScenario(0)
    setAnswers({})
    setCriteriaAnswers({})
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light">{exercise.description}</p>
      </div>

      {/* Scenario progress */}
      <div className="text-sm text-text-light">
        Szenario {currentScenario + 1} von {exercise.scenarios.length}
      </div>

      {/* Current scenario */}
      <div className="bg-white p-6 rounded-xl border border-border">
        <p className="text-text mb-4">{scenario.description}</p>

        <div className="space-y-2">
          {scenario.options.map((option) => {
            const isSelected = answers[scenario.id] === option.id
            return (
              <label
                key={option.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                } ${result ? 'cursor-default' : ''}`}
              >
                <input
                  type="radio"
                  name={`decision-${scenario.id}`}
                  checked={isSelected}
                  onChange={() => handleSelect(option.id)}
                  disabled={!!result}
                />
                <span className="text-text">{option.text}</span>
              </label>
            )
          })}
        </div>

        {/* Criteria selection */}
        {scenario.criteria && answers[scenario.id] && (
          <div className="mt-4 p-4 bg-surface rounded-lg">
            <p className="text-sm font-semibold text-text mb-3">Begründung wählen:</p>
            {scenario.criteria.map((criterion) => (
              <div key={criterion.id} className="mb-2">
                <label className="text-sm text-text-light">{criterion.label}</label>
                <select
                  value={criteriaAnswers[scenario.id]?.[criterion.id] ?? ''}
                  onChange={(e) => handleCriteria(criterion.id, e.target.value)}
                  disabled={!!result}
                  className="ml-2 text-sm border border-border rounded px-2 py-1"
                >
                  <option value="">— wählen —</option>
                  <option value="ja">Ja</option>
                  <option value="nein">Nein</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      {!result && (
        <button
          onClick={handleNext}
          disabled={!answers[scenario.id]}
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
