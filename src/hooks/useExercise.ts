import { useState, useCallback } from 'react'
import { useProgressStore } from '../store/progress-store.ts'
import { useAchievementsStore } from '../store/achievements-store.ts'
import type { ExerciseBase, ValidationResult } from '../types/index.ts'

type ExerciseState = 'idle' | 'in-progress' | 'submitted' | 'completed'

interface UseExerciseReturn<T> {
  state: ExerciseState
  answer: T | null
  result: ValidationResult | null
  attempts: number
  showHints: boolean
  start: () => void
  setAnswer: (answer: T) => void
  submit: (validator: (answer: T) => ValidationResult) => ValidationResult | null
  reset: () => void
  toggleHints: () => void
}

export function useExercise<T>(exercise: ExerciseBase): UseExerciseReturn<T> {
  const [state, setState] = useState<ExerciseState>('idle')
  const [answer, setAnswerState] = useState<T | null>(null)
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [showHints, setShowHints] = useState(false)

  const saveExerciseResult = useProgressStore((s) => s.saveExerciseResult)
  const checkAchievements = useAchievementsStore((s) => s.checkAndUnlock)

  const start = useCallback(() => {
    setState('in-progress')
  }, [])

  const setAnswer = useCallback((newAnswer: T) => {
    setAnswerState(newAnswer)
    if (state === 'idle') {
      setState('in-progress')
    }
  }, [state])

  const submit = useCallback((validator: (answer: T) => ValidationResult) => {
    const validationResult = validator(answer as T)
    setResult(validationResult)
    setAttempts((a) => a + 1)

    if (validationResult.correct) {
      setState('completed')
    } else {
      setState('submitted')
    }

    // Save to progress store
    saveExerciseResult(
      exercise.diagramType,
      exercise.id,
      exercise.version,
      validationResult.score,
      validationResult.maxScore
    )

    // Check for new achievements
    checkAchievements()

    return validationResult
  }, [answer, exercise, saveExerciseResult, checkAchievements])

  const reset = useCallback(() => {
    setState('idle')
    setAnswerState(null)
    setResult(null)
    setShowHints(false)
  }, [])

  const toggleHints = useCallback(() => {
    setShowHints((h) => !h)
  }, [])

  return {
    state,
    answer,
    result,
    attempts,
    showHints,
    start,
    setAnswer,
    submit,
    reset,
    toggleHints,
  }
}
