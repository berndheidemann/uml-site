import { useState } from 'react'
import { ExerciseFeedback } from '../common/ExerciseFeedback.tsx'
import { useExercise } from '../../hooks/useExercise.ts'
import { validateHotspot } from '../../utils/exercise-validators.ts'
import type { HotspotExerciseData, HotspotRegion } from '../../types/index.ts'

interface Props {
  exercise: HotspotExerciseData
  onNext?: () => void
}

export function HotspotExercise({ exercise, onNext }: Props) {
  const { result, showHints, submit, reset, toggleHints } = useExercise<string[]>(exercise)
  const [clickedIds, setClickedIds] = useState<string[]>([])

  const handleRegionClick = (region: HotspotRegion) => {
    if (result) return
    if (exercise.multiSelect) {
      setClickedIds((prev) =>
        prev.includes(region.id) ? prev.filter((id) => id !== region.id) : [...prev, region.id]
      )
    } else {
      setClickedIds([region.id])
    }
  }

  const handleSubmit = () => {
    const correctIds = exercise.regions.filter((r) => r.isCorrect).map((r) => r.id)
    submit(() => validateHotspot(clickedIds, correctIds, exercise.maxPoints))
  }

  const handleReset = () => {
    reset()
    setClickedIds([])
  }

  const renderRegion = (region: HotspotRegion) => {
    const isClicked = clickedIds.includes(region.id)
    let fill = 'transparent'
    let stroke = 'transparent'

    if (result) {
      if (isClicked && region.isCorrect) {
        fill = 'rgba(22, 163, 74, 0.2)'
        stroke = '#16a34a'
      } else if (isClicked && !region.isCorrect) {
        fill = 'rgba(220, 38, 38, 0.2)'
        stroke = '#dc2626'
      } else if (!isClicked && region.isCorrect) {
        fill = 'rgba(22, 163, 74, 0.1)'
        stroke = '#16a34a'
      }
    } else if (isClicked) {
      fill = 'rgba(37, 99, 235, 0.2)'
      stroke = '#2563eb'
    }

    const commonProps = {
      fill,
      stroke,
      strokeWidth: 2,
      className: `cursor-pointer transition-colors ${result ? 'cursor-default' : 'hover:fill-primary/10'}`,
      onClick: () => handleRegionClick(region),
      role: 'button' as const,
      tabIndex: 0,
      'aria-label': region.label,
      'aria-pressed': isClicked,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleRegionClick(region)
        }
      },
    }

    switch (region.shape) {
      case 'rect':
        return <rect key={region.id} x={region.coords[0]} y={region.coords[1]} width={region.coords[2]} height={region.coords[3]} {...commonProps} />
      case 'circle':
        return <circle key={region.id} cx={region.coords[0]} cy={region.coords[1]} r={region.coords[2]} {...commonProps} />
      case 'polygon':
        return <polygon key={region.id} points={region.coords.reduce((acc, val, i) => acc + (i % 2 === 0 ? (i > 0 ? ' ' : '') + val : ',' + val), '')} {...commonProps} />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light mb-2">{exercise.description}</p>
        <p className="font-medium text-text">{exercise.question}</p>
      </div>

      <div className="bg-white rounded-lg border border-border p-4 overflow-x-auto">
        <svg
          viewBox={`0 0 800 600`}
          className="w-full max-w-3xl mx-auto"
          role="img"
          aria-label={exercise.title}
        >
          <g dangerouslySetInnerHTML={{ __html: exercise.svgContent }} />
          {exercise.regions.map(renderRegion)}
        </svg>
      </div>

      {!result && (
        <button
          onClick={handleSubmit}
          disabled={clickedIds.length === 0}
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
