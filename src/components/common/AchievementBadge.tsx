import { motion } from 'framer-motion'
import type { Achievement } from '../../store/achievements-store.ts'

interface Props {
  achievement: Achievement
  size?: 'sm' | 'md'
}

export function AchievementBadge({ achievement, size = 'md' }: Props) {
  const isUnlocked = !!achievement.unlockedAt

  const sizeClasses = size === 'sm'
    ? 'w-12 h-12 text-lg'
    : 'w-16 h-16 text-2xl'

  return (
    <div
      className="flex flex-col items-center gap-1 text-center"
      title={isUnlocked ? `${achievement.title}: ${achievement.description}` : 'Noch nicht freigeschaltet'}
    >
      <motion.div
        className={`${sizeClasses} rounded-full flex items-center justify-center ${
          isUnlocked
            ? 'bg-warning/20 border-2 border-warning'
            : 'bg-surface-dark border-2 border-border grayscale opacity-40'
        }`}
        initial={false}
        animate={isUnlocked ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3 }}
        role="img"
        aria-label={`${achievement.title}${isUnlocked ? ' (freigeschaltet)' : ' (gesperrt)'}`}
      >
        <span aria-hidden="true">{achievement.icon}</span>
      </motion.div>
      <span className={`text-xs font-medium ${
        isUnlocked ? 'text-text' : 'text-text-light'
      }`}>
        {achievement.title}
      </span>
    </div>
  )
}
