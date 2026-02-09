import { useState } from 'react'
import { ExerciseFeedback } from '../common/ExerciseFeedback.tsx'
import { useExercise } from '../../hooks/useExercise.ts'
import { validateTextExtraction } from '../../utils/exercise-validators.ts'
import type { TextExtractionExerciseData } from '../../types/index.ts'

interface Props {
  exercise: TextExtractionExerciseData
  onNext?: () => void
}

export function TextExtractionExercise({ exercise, onNext }: Props) {
  const { result, showHints, submit, reset, toggleHints } = useExercise<Record<string, string>>(exercise)
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [activeCategory, setActiveCategory] = useState<string>(exercise.categories[0]?.id ?? '')

  const handlePhraseClick = (phraseId: string) => {
    if (result) return
    setSelections((prev) => {
      const current = prev[phraseId]
      if (current === activeCategory) {
        // Deselect
        const next = { ...prev }
        delete next[phraseId]
        return next
      }
      return { ...prev, [phraseId]: activeCategory }
    })
  }

  const handleSubmit = () => {
    const correctCategories: Record<string, string> = {}
    for (const phrase of exercise.phrases) {
      correctCategories[phrase.id] = phrase.correctCategory
    }
    submit(() => validateTextExtraction(selections, correctCategories, exercise.maxPoints))
  }

  const handleReset = () => {
    reset()
    setSelections({})
  }

  // Build text with clickable phrases
  const buildAnnotatedText = () => {
    const sortedPhrases = [...exercise.phrases].sort((a, b) => a.startIndex - b.startIndex)
    const parts: React.ReactNode[] = []
    let lastIndex = 0

    for (const phrase of sortedPhrases) {
      // Text before this phrase
      if (phrase.startIndex > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {exercise.sourceText.slice(lastIndex, phrase.startIndex)}
          </span>
        )
      }

      const selectedCategory = selections[phrase.id]
      const category = exercise.categories.find((c) => c.id === selectedCategory)

      let bgColor = 'bg-surface-dark hover:bg-primary/10'
      if (result) {
        const isCorrect = selectedCategory === phrase.correctCategory
        if (selectedCategory) {
          bgColor = isCorrect ? 'bg-green-100 ring-2 ring-success' : 'bg-red-100 ring-2 ring-error'
        } else {
          const correctCat = exercise.categories.find((c) => c.id === phrase.correctCategory)
          bgColor = `bg-yellow-100 ring-2 ring-warning`
          // Show what it should have been
          if (correctCat) {
            bgColor = 'bg-yellow-100 ring-2 ring-warning'
          }
        }
      } else if (category) {
        bgColor = `ring-2`
        bgColor += ` bg-opacity-20`
      }

      parts.push(
        <button
          key={phrase.id}
          onClick={() => handlePhraseClick(phrase.id)}
          disabled={!!result}
          className={`inline px-1 py-0.5 rounded cursor-pointer transition-colors ${bgColor} ${result ? 'cursor-default' : ''}`}
          style={category && !result ? { backgroundColor: category.color + '30', borderColor: category.color } : undefined}
          aria-label={`${phrase.text}${category ? ` — markiert als ${category.label}` : ''}`}
          title={category?.label}
        >
          {exercise.sourceText.slice(phrase.startIndex, phrase.endIndex)}
        </button>
      )

      lastIndex = phrase.endIndex
    }

    // Remaining text
    if (lastIndex < exercise.sourceText.length) {
      parts.push(
        <span key={`text-end`}>
          {exercise.sourceText.slice(lastIndex)}
        </span>
      )
    }

    return parts
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light">{exercise.description}</p>
      </div>

      {/* Category selector */}
      {!result && (
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Kategorie auswählen">
          {exercise.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-colors ${
                activeCategory === cat.id
                  ? 'border-current text-white'
                  : 'border-border text-text-light hover:border-current'
              }`}
              style={{
                backgroundColor: activeCategory === cat.id ? cat.color : 'transparent',
                borderColor: cat.color,
                color: activeCategory === cat.id ? 'white' : cat.color,
              }}
              role="radio"
              aria-checked={activeCategory === cat.id}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Text with clickable phrases */}
      <div className="bg-white rounded-lg border border-border p-6 leading-relaxed text-text">
        {buildAnnotatedText()}
      </div>

      {!result && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(selections).length === 0}
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
