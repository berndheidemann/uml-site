import { useState } from 'react'
import { ExerciseFeedback } from './ExerciseFeedback.tsx'
import { useExercise } from '../../hooks/useExercise.ts'
import { validateLueckentext } from '../../utils/exercise-validators.ts'
import type { LueckentextExerciseData } from '../../types/index.ts'

interface Props {
  exercise: LueckentextExerciseData
  onNext?: () => void
}

export function Lueckentext({ exercise, onNext }: Props) {
  const { result, showHints, submit, reset, toggleHints } = useExercise<Record<string, string>>(exercise)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const handleChange = (gapId: string, value: string) => {
    if (result) return
    setAnswers((prev) => ({ ...prev, [gapId]: value }))
  }

  const handleSubmit = () => {
    const correctAnswers: Record<string, string[]> = {}
    for (const gap of exercise.gaps) {
      correctAnswers[gap.id] = gap.correctAnswers
    }
    submit(() => validateLueckentext(answers, correctAnswers, exercise.maxPoints))
  }

  const handleReset = () => {
    reset()
    setAnswers({})
  }

  // Parse template and render with input fields
  const renderTemplate = () => {
    const parts = exercise.template.split(/(\{\{[^}]+\}\})/g)
    return parts.map((part, index) => {
      const match = part.match(/^\{\{(.+)\}\}$/)
      if (match) {
        const gapId = match[1]
        const gap = exercise.gaps.find((g) => g.id === gapId)
        if (!gap) return <span key={index}>{part}</span>

        const detail = result?.details?.find((d) => d.itemId === gapId)
        let inputClass = 'border-border focus:border-primary'
        if (detail) {
          inputClass = detail.correct ? 'border-success bg-green-50' : 'border-error bg-red-50'
        }

        return (
          <span key={index} className="inline-block mx-1">
            <input
              type="text"
              value={answers[gapId] ?? ''}
              onChange={(e) => handleChange(gapId, e.target.value)}
              disabled={!!result}
              placeholder={gap.placeholder ?? '...'}
              className={`border-b-2 px-1 py-0.5 text-center bg-transparent outline-none w-32 text-sm ${inputClass}`}
              aria-label={gap.placeholder ?? `Lücke ${gapId}`}
            />
            {detail && !detail.correct && result && (
              <span className="text-xs text-success ml-1">({gap.correctAnswers[0]})</span>
            )}
          </span>
        )
      }
      return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light">{exercise.description}</p>
      </div>

      <div className="bg-white rounded-lg border border-border p-6 leading-loose text-text">
        {renderTemplate()}
      </div>

      {!result && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < exercise.gaps.length}
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
