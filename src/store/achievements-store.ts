import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useProgressStore } from './progress-store.ts'
import type { DiagramType } from '../types/index.ts'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
}

interface AchievementsState {
  achievements: Record<string, Achievement>
  newlyUnlocked: string[] // IDs of achievements that haven't been shown as toast yet
  checkAndUnlock: () => string[] // returns newly unlocked achievement IDs
  dismissToast: (id: string) => void
  getUnlocked: () => Achievement[]
  getAll: () => Achievement[]
}

export const allAchievementDefinitions: Achievement[] = [
  {
    id: 'erste-schritte',
    title: 'Erste Schritte',
    description: 'Erste Übung abgeschlossen',
    icon: '🎯',
  },
  {
    id: 'klassenmeister',
    title: 'Klassenmeister',
    description: 'Alle Klassendiagramm-Übungen abgeschlossen',
    icon: '🏗️',
  },
  {
    id: 'sequenz-profi',
    title: 'Sequenz-Profi',
    description: 'Alle Sequenzdiagramm-Übungen abgeschlossen',
    icon: '🔄',
  },
  {
    id: 'zustandskenner',
    title: 'Zustandskenner',
    description: 'Alle Zustandsdiagramm-Übungen abgeschlossen',
    icon: '🔀',
  },
  {
    id: 'aktivitaets-held',
    title: 'Aktivitäts-Held',
    description: 'Alle Aktivitätsdiagramm-Übungen abgeschlossen',
    icon: '⚡',
  },
  {
    id: 'usecase-experte',
    title: 'Use-Case-Experte',
    description: 'Alle Use-Case-Diagramm-Übungen abgeschlossen',
    icon: '👥',
  },
  {
    id: 'perfektionist',
    title: 'Perfektionist',
    description: 'Eine Übung mit voller Punktzahl abgeschlossen',
    icon: '⭐',
  },
  {
    id: 'uml-meister',
    title: 'UML-Meister',
    description: 'Alle Übungen aller Kapitel abgeschlossen',
    icon: '🏆',
  },
]

const chapterAchievementMap: Record<string, DiagramType> = {
  'klassenmeister': 'klassendiagramm',
  'sequenz-profi': 'sequenzdiagramm',
  'zustandskenner': 'zustandsdiagramm',
  'aktivitaets-held': 'aktivitaetsdiagramm',
  'usecase-experte': 'usecasediagramm',
}

// Expected exercise counts per chapter
const expectedExerciseCounts: Partial<Record<DiagramType, number>> = {
  klassendiagramm: 4,
  sequenzdiagramm: 4,
  zustandsdiagramm: 3,
  aktivitaetsdiagramm: 3,
  usecasediagramm: 3,
}

export const useAchievementsStore = create<AchievementsState>()(
  persist(
    (set, get) => ({
      achievements: {},
      newlyUnlocked: [],

      checkAndUnlock: () => {
        const progressState = useProgressStore.getState()
        const current = get().achievements
        const newlyUnlockedIds: string[] = []

        const unlock = (achievement: Achievement) => {
          if (!current[achievement.id]) {
            current[achievement.id] = {
              ...achievement,
              unlockedAt: new Date().toISOString(),
            }
            newlyUnlockedIds.push(achievement.id)
          }
        }

        // Check "Erste Schritte" — any exercise completed
        const chapters = progressState.chapters
        let anyCompleted = false
        let anyPerfect = false
        const allChaptersDone: DiagramType[] = []

        for (const chapter of Object.values(chapters)) {
          const exercises = Object.values(chapter.exercises)
          const completedExercises = exercises.filter((e) => e.completed)

          if (completedExercises.length > 0) {
            anyCompleted = true
          }

          if (completedExercises.some((e) => e.score === e.maxScore)) {
            anyPerfect = true
          }

          // Check chapter-specific achievements
          const expected = expectedExerciseCounts[chapter.diagramType]
          if (expected && completedExercises.length >= expected) {
            allChaptersDone.push(chapter.diagramType)
          }
        }

        if (anyCompleted) {
          unlock(allAchievementDefinitions.find((a) => a.id === 'erste-schritte')!)
        }

        if (anyPerfect) {
          unlock(allAchievementDefinitions.find((a) => a.id === 'perfektionist')!)
        }

        // Chapter-specific
        for (const [achievementId, diagramType] of Object.entries(chapterAchievementMap)) {
          if (allChaptersDone.includes(diagramType)) {
            unlock(allAchievementDefinitions.find((a) => a.id === achievementId)!)
          }
        }

        // UML-Meister: all chapters done
        const requiredChapters: DiagramType[] = ['klassendiagramm', 'sequenzdiagramm', 'zustandsdiagramm', 'aktivitaetsdiagramm', 'usecasediagramm']
        if (requiredChapters.every((c) => allChaptersDone.includes(c))) {
          unlock(allAchievementDefinitions.find((a) => a.id === 'uml-meister')!)
        }

        if (newlyUnlockedIds.length > 0) {
          set({
            achievements: { ...current },
            newlyUnlocked: [...get().newlyUnlocked, ...newlyUnlockedIds],
          })
        }

        return newlyUnlockedIds
      },

      dismissToast: (id) =>
        set((state) => ({
          newlyUnlocked: state.newlyUnlocked.filter((i) => i !== id),
        })),

      getUnlocked: () => {
        return Object.values(get().achievements).filter((a) => a.unlockedAt)
      },

      getAll: () => allAchievementDefinitions.map((a) => ({
        ...a,
        ...get().achievements[a.id],
      })),
    }),
    {
      name: 'uml-learning-achievements',
    }
  )
)
