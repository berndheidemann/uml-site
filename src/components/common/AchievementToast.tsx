import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAchievementsStore } from '../../store/achievements-store.ts'

export function AchievementToast() {
  const newlyUnlocked = useAchievementsStore((s) => s.newlyUnlocked)
  const achievements = useAchievementsStore((s) => s.achievements)
  const dismissToast = useAchievementsStore((s) => s.dismissToast)

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (newlyUnlocked.length === 0) return
    const timer = setTimeout(() => {
      dismissToast(newlyUnlocked[0])
    }, 5000)
    return () => clearTimeout(timer)
  }, [newlyUnlocked, dismissToast])

  const currentId = newlyUnlocked[0]
  const current = currentId ? achievements[currentId] : null

  return (
    <div className="fixed top-4 right-4 z-50" aria-live="polite">
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="bg-white rounded-xl shadow-lg border-2 border-warning p-4 flex items-center gap-3 min-w-[280px]"
          >
            <span className="text-3xl" aria-hidden="true">{current.icon}</span>
            <div className="flex-1">
              <p className="text-xs font-semibold text-warning uppercase tracking-wide">
                Badge freigeschaltet!
              </p>
              <p className="text-sm font-bold text-text">{current.title}</p>
              <p className="text-xs text-text-light">{current.description}</p>
            </div>
            <button
              onClick={() => dismissToast(current.id)}
              className="text-text-light hover:text-text p-1 focus:outline-none focus:ring-2 focus:ring-primary rounded"
              aria-label="Benachrichtigung schließen"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
