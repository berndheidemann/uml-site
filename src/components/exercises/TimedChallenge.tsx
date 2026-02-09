import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExerciseFeedback } from '../common/ExerciseFeedback.tsx'
import { useExercise } from '../../hooks/useExercise.ts'
import { validateTimedChallenge } from '../../utils/exercise-validators.ts'
import type { TimedChallengeExercise } from '../../types/index.ts'

interface Props {
  exercise: TimedChallengeExercise
  onNext?: () => void
}

export function TimedChallenge({ exercise, onNext }: Props) {
  const { result, showHints, submit, reset, toggleHints } = useExercise<Record<string, string>>(exercise)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(exercise.timePerQuestion)
  const [paused, setPaused] = useState(false)
  const [started, setStarted] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const answersRef = useRef(answers)
  answersRef.current = answers

  const question = exercise.questions[currentQ]
  const totalQuestions = exercise.questions.length
  const answeredCount = Object.keys(answers).length

  const advanceQuestion = useCallback(() => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ((q) => q + 1)
      setTimeLeft(exercise.timePerQuestion)
    } else {
      // All done — submit (use ref to get latest answers)
      const correctAnswers: Record<string, string> = {}
      for (const q of exercise.questions) {
        correctAnswers[q.id] = q.correctOptionId
      }
      submit(() => validateTimedChallenge(answersRef.current, correctAnswers, exercise.maxPoints))
    }
  }, [currentQ, totalQuestions, exercise, submit])

  // Timer
  useEffect(() => {
    if (!started || paused || result) return

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          advanceQuestion()
          return exercise.timePerQuestion
        }
        return t - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [started, paused, result, advanceQuestion, exercise.timePerQuestion])

  // Keyboard shortcuts
  useEffect(() => {
    if (!started || paused || result) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key)
      if (num >= 1 && num <= question.options.length) {
        const option = question.options[num - 1]
        handleAnswer(option.id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [started, paused, result, question])

  const handleAnswer = (optionId: string) => {
    if (result) return
    const updated = { ...answersRef.current, [question.id]: optionId }
    setAnswers(updated)
    answersRef.current = updated
    advanceQuestion()
  }

  const handleStart = () => {
    setStarted(true)
    setTimeLeft(exercise.timePerQuestion)
  }

  const handleReset = () => {
    reset()
    setCurrentQ(0)
    setAnswers({})
    setTimeLeft(exercise.timePerQuestion)
    setStarted(false)
    setPaused(false)
  }

  const progressPercentage = (timeLeft / exercise.timePerQuestion) * 100

  if (!started) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
          <p className="text-text-light">{exercise.description}</p>
        </div>
        <div className="text-center p-8 bg-surface rounded-xl">
          <p className="text-text mb-2">{totalQuestions} Fragen, {exercise.timePerQuestion} Sekunden pro Frage</p>
          <p className="text-sm text-text-light mb-6">Tipp: Nutze die Zifferntasten (1-4) zum schnellen Antworten</p>
          <button
            onClick={handleStart}
            className="px-8 py-3 bg-primary text-white rounded-lg text-lg font-semibold hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Start
          </button>
        </div>
      </div>
    )
  }

  if (result) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        </div>
        <ExerciseFeedback
          result={result}
          hints={exercise.hints}
          showHints={showHints}
          onToggleHints={toggleHints}
          onRetry={handleReset}
          onNext={onNext}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-light">
          Frage {currentQ + 1} / {totalQuestions} ({answeredCount} beantwortet)
        </span>
        <button
          onClick={() => setPaused(!paused)}
          className="text-sm px-3 py-1 border border-border rounded-md hover:bg-surface-dark"
          aria-label={paused ? 'Fortsetzen' : 'Pausieren'}
        >
          {paused ? 'Fortsetzen' : 'Pause'}
        </button>
      </div>

      {/* Timer ring */}
      <div className="flex justify-center">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="2" />
            <circle
              cx="18" cy="18" r="16" fill="none"
              stroke={progressPercentage > 30 ? '#2563eb' : '#dc2626'}
              strokeWidth="2"
              strokeDasharray="100.53"
              strokeDashoffset={100.53 * (1 - progressPercentage / 100)}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-text">
            {timeLeft}
          </span>
        </div>
      </div>

      {/* Question */}
      {!paused && (
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            {question.svgContent && (
              <div className="bg-white rounded-lg border border-border p-4 flex justify-center">
                <svg viewBox="0 0 300 60" className="w-64" dangerouslySetInnerHTML={{ __html: question.svgContent }} />
              </div>
            )}

            <p className="text-center font-medium text-text text-lg">{question.question}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
              {question.options.map((option, i) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  className="p-3 bg-white border-2 border-border rounded-lg text-text hover:border-primary hover:bg-primary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-left"
                >
                  <span className="text-text-light mr-2 font-mono">{i + 1}.</span>
                  {option.text}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {paused && (
        <div className="text-center p-8 text-text-light">
          Pausiert — klicke „Fortsetzen" um weiterzumachen
        </div>
      )}
    </div>
  )
}
