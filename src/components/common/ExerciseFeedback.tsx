import { motion } from 'framer-motion'
import type { ValidationResult } from '../../types/index.ts'

interface Props {
  result: ValidationResult
  hints?: string[]
  showHints: boolean
  onToggleHints: () => void
  onRetry: () => void
  onNext?: () => void
}

export function ExerciseFeedback({ result, hints, showHints, onToggleHints, onRetry, onNext }: Props) {
  const isCorrect = result.correct

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-6 p-6 rounded-xl border-2 ${
        isCorrect
          ? 'bg-green-50 border-success'
          : 'bg-red-50 border-error'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {/* Icon - not just color-coded for WCAG */}
        <span className="flex-shrink-0 text-2xl" aria-hidden="true">
          {isCorrect ? (
            <svg className="w-8 h-8 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-error" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
        </span>

        <div className="flex-1">
          <p className={`font-semibold text-lg ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
            {isCorrect ? 'Richtig!' : 'Noch nicht ganz richtig'}
          </p>
          <p className={`mt-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {result.feedback}
          </p>
          <p className="mt-2 text-sm text-text-light">
            Punkte: {result.score} / {result.maxScore}
          </p>
        </div>
      </div>

      {/* Hints */}
      {!isCorrect && hints && hints.length > 0 && (
        <div className="mt-4">
          <button
            onClick={onToggleHints}
            className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            {showHints ? 'Hinweise verbergen' : 'Hinweis anzeigen'}
          </button>
          {showHints && (
            <ul className="mt-2 space-y-1">
              {hints.map((hint, i) => (
                <li key={i} className="text-sm text-text-light flex items-start gap-2">
                  <span className="text-warning" aria-hidden="true">*</span>
                  {hint}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex gap-3">
        {!isCorrect && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-white border border-border rounded-lg text-sm text-text hover:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Nochmal versuchen
          </button>
        )}
        {onNext && (
          <button
            onClick={onNext}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {isCorrect ? 'Weiter' : 'Überspringen'}
          </button>
        )}
      </div>
    </motion.div>
  )
}
