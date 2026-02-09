import { useMemo } from 'react'
import { useProgressStore } from '../../store/progress-store.ts'
import { useAchievementsStore, allAchievementDefinitions } from '../../store/achievements-store.ts'
import { ProgressBar } from './ProgressBar.tsx'
import { AchievementBadge } from './AchievementBadge.tsx'
import type { DiagramType } from '../../types/index.ts'

interface ChapterInfo {
  diagramType: DiagramType
  title: string
  totalExercises: number
}

const chapters: ChapterInfo[] = [
  { diagramType: 'klassendiagramm', title: 'Klassendiagramm', totalExercises: 4 },
  { diagramType: 'sequenzdiagramm', title: 'Sequenzdiagramm', totalExercises: 4 },
  { diagramType: 'zustandsdiagramm', title: 'Zustandsdiagramm', totalExercises: 3 },
  { diagramType: 'aktivitaetsdiagramm', title: 'Aktivitätsdiagramm', totalExercises: 3 },
  { diagramType: 'usecasediagramm', title: 'Use-Case-Diagramm', totalExercises: 3 },
]

function ChapterProgressRow({ chapter }: { chapter: ChapterInfo }) {
  const chapterProgress = useProgressStore((s) => s.chapters[chapter.diagramType])
  const completed = chapterProgress
    ? Object.values(chapterProgress.exercises).filter((e) => e.completed).length
    : 0

  return (
    <ProgressBar
      current={completed}
      max={chapter.totalExercises}
      label={chapter.title}
      className="mb-3"
    />
  )
}

export function ProgressOverview() {
  const unlockedAchievements = useAchievementsStore((s) => s.achievements)

  const allAchievements = useMemo(
    () => allAchievementDefinitions.map((a) => ({
      ...a,
      ...unlockedAchievements[a.id],
    })),
    [unlockedAchievements]
  )

  return (
    <div className="space-y-8">
      {/* Chapter Progress */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="text-lg font-bold text-text mb-4">Kapitelfortschritt</h3>
        {chapters.map((ch) => (
          <ChapterProgressRow key={ch.diagramType} chapter={ch} />
        ))}
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="text-lg font-bold text-text mb-4">Badges</h3>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
          {allAchievements.map((achievement) => (
            <AchievementBadge key={achievement.id} achievement={achievement} size="sm" />
          ))}
        </div>
      </div>
    </div>
  )
}
