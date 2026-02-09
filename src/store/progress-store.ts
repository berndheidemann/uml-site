import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DiagramType, ExerciseProgress, ChapterProgress } from '../types/index.ts'

interface ProgressState {
  chapters: Record<string, ChapterProgress>
  markTheoryRead: (diagramType: DiagramType) => void
  saveExerciseResult: (
    diagramType: DiagramType,
    exerciseId: string,
    version: number,
    score: number,
    maxScore: number
  ) => void
  resetExercise: (diagramType: DiagramType, exerciseId: string) => void
  resetAll: () => void
  getChapterProgress: (diagramType: DiagramType) => ChapterProgress
  getOverallProgress: () => { completed: number; total: number; percentage: number }
  isExerciseCompleted: (diagramType: DiagramType, exerciseId: string) => boolean
  getExerciseProgress: (diagramType: DiagramType, exerciseId: string) => ExerciseProgress | undefined
}

const defaultChapterProgress = (diagramType: DiagramType): ChapterProgress => ({
  diagramType,
  theoryRead: false,
  exercises: {},
})

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      chapters: {},

      markTheoryRead: (diagramType) =>
        set((state) => {
          const chapter = state.chapters[diagramType] ?? defaultChapterProgress(diagramType)
          return {
            chapters: {
              ...state.chapters,
              [diagramType]: { ...chapter, theoryRead: true },
            },
          }
        }),

      saveExerciseResult: (diagramType, exerciseId, version, score, maxScore) =>
        set((state) => {
          const chapter = state.chapters[diagramType] ?? defaultChapterProgress(diagramType)
          const existing = chapter.exercises[exerciseId]

          // Version check: reset if version mismatch
          if (existing && existing.version !== version) {
            const newProgress: ExerciseProgress = {
              exerciseId,
              version,
              completed: score === maxScore,
              score,
              maxScore,
              attempts: 1,
              lastAttempt: new Date().toISOString(),
            }
            return {
              chapters: {
                ...state.chapters,
                [diagramType]: {
                  ...chapter,
                  exercises: { ...chapter.exercises, [exerciseId]: newProgress },
                },
              },
            }
          }

          const newProgress: ExerciseProgress = {
            exerciseId,
            version,
            completed: score === maxScore || (existing?.completed ?? false),
            score: Math.max(score, existing?.score ?? 0),
            maxScore,
            attempts: (existing?.attempts ?? 0) + 1,
            lastAttempt: new Date().toISOString(),
          }

          return {
            chapters: {
              ...state.chapters,
              [diagramType]: {
                ...chapter,
                exercises: { ...chapter.exercises, [exerciseId]: newProgress },
              },
            },
          }
        }),

      resetExercise: (diagramType, exerciseId) =>
        set((state) => {
          const chapter = state.chapters[diagramType]
          if (!chapter) return state
          const exercises = { ...chapter.exercises }
          delete exercises[exerciseId]
          return {
            chapters: {
              ...state.chapters,
              [diagramType]: { ...chapter, exercises },
            },
          }
        }),

      resetAll: () => set({ chapters: {} }),

      getChapterProgress: (diagramType) => {
        return get().chapters[diagramType] ?? defaultChapterProgress(diagramType)
      },

      getOverallProgress: () => {
        const chapters = get().chapters
        let completed = 0
        let total = 0
        for (const chapter of Object.values(chapters)) {
          for (const ex of Object.values(chapter.exercises)) {
            total++
            if (ex.completed) completed++
          }
        }
        return {
          completed,
          total,
          percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
        }
      },

      isExerciseCompleted: (diagramType, exerciseId) => {
        const chapter = get().chapters[diagramType]
        return chapter?.exercises[exerciseId]?.completed ?? false
      },

      getExerciseProgress: (diagramType, exerciseId) => {
        const chapter = get().chapters[diagramType]
        return chapter?.exercises[exerciseId]
      },
    }),
    {
      name: 'uml-learning-progress',
    }
  )
)
