import { useProgressStore } from '../store/progress-store.ts'
import type { DiagramType } from '../types/index.ts'

export function useProgress(diagramType: DiagramType) {
  const chapter = useProgressStore((s) => s.getChapterProgress(diagramType))
  const markTheoryRead = useProgressStore((s) => s.markTheoryRead)
  const isExerciseCompleted = useProgressStore((s) => s.isExerciseCompleted)
  const getExerciseProgress = useProgressStore((s) => s.getExerciseProgress)

  return {
    chapter,
    theoryRead: chapter.theoryRead,
    markTheoryRead: () => markTheoryRead(diagramType),
    isExerciseCompleted: (exerciseId: string) => isExerciseCompleted(diagramType, exerciseId),
    getExerciseProgress: (exerciseId: string) => getExerciseProgress(diagramType, exerciseId),
  }
}
