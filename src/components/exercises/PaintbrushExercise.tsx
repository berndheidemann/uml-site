import { useState } from 'react'
import { ExerciseFeedback } from '../common/ExerciseFeedback.tsx'
import { useExercise } from '../../hooks/useExercise.ts'
import type { PaintbrushExerciseData, LineStyle, ArrowHead, DiamondStyle } from '../../types/index.ts'

interface LineState {
  lineStyle: LineStyle
  arrowHead: ArrowHead
  diamond: DiamondStyle
}

interface Props {
  exercise: PaintbrushExerciseData
  onNext?: () => void
}

const lineStyleOptions: { value: LineStyle; label: string }[] = [
  { value: 'solid', label: 'Durchgezogen' },
  { value: 'dashed', label: 'Gestrichelt' },
]

const arrowHeadOptions: { value: ArrowHead; label: string }[] = [
  { value: 'none', label: 'Keine' },
  { value: 'open', label: 'Offen' },
  { value: 'closed', label: 'Geschlossen (leer)' },
  { value: 'filled', label: 'Gefüllt' },
]

const diamondOptions: { value: DiamondStyle; label: string }[] = [
  { value: 'none', label: 'Keine' },
  { value: 'empty', label: 'Leere Raute' },
  { value: 'filled', label: 'Gefüllte Raute' },
]

export function PaintbrushExercise({ exercise, onNext }: Props) {
  const { result, showHints, submit, reset, toggleHints } = useExercise<Record<string, LineState>>(exercise)
  const [selectedLine, setSelectedLine] = useState<string | null>(null)
  const [lineStates, setLineStates] = useState<Record<string, LineState>>(() => {
    const initial: Record<string, LineState> = {}
    for (const line of exercise.lines) {
      initial[line.id] = { lineStyle: 'solid', arrowHead: 'none', diamond: 'none' }
    }
    return initial
  })

  const updateLine = (field: keyof LineState, value: string) => {
    if (!selectedLine || result) return
    setLineStates((prev) => ({
      ...prev,
      [selectedLine]: { ...prev[selectedLine], [field]: value },
    }))
  }

  const handleSubmit = () => {
    submit(() => {
      let correct = 0
      const total = exercise.lines.length

      for (const line of exercise.lines) {
        const state = lineStates[line.id]
        if (
          state.lineStyle === line.correctLineStyle &&
          state.arrowHead === line.correctArrowHead &&
          state.diamond === line.correctDiamond
        ) {
          correct++
        }
      }

      const score = Math.round((correct / total) * exercise.maxPoints)
      return {
        correct: correct === total,
        score,
        maxScore: exercise.maxPoints,
        feedback: correct === total
          ? 'Alle Notationen korrekt!'
          : `${correct} von ${total} Linien korrekt notiert.`,
      }
    })
  }

  const handleReset = () => {
    reset()
    setSelectedLine(null)
    const initial: Record<string, LineState> = {}
    for (const line of exercise.lines) {
      initial[line.id] = { lineStyle: 'solid', arrowHead: 'none', diamond: 'none' }
    }
    setLineStates(initial)
  }

  const renderLine = (line: typeof exercise.lines[0]) => {
    const state = lineStates[line.id]
    const isSelected = selectedLine === line.id
    const strokeDash = state.lineStyle === 'dashed' ? '8,4' : 'none'
    const strokeColor = isSelected ? '#2563eb' : '#64748b'

    // Check correctness for result display
    let resultColor = strokeColor
    if (result) {
      const isCorrect =
        state.lineStyle === line.correctLineStyle &&
        state.arrowHead === line.correctArrowHead &&
        state.diamond === line.correctDiamond
      resultColor = isCorrect ? '#16a34a' : '#dc2626'
    }

    // Arrow head
    const dx = line.x2 - line.x1
    const dy = line.y2 - line.y1
    const len = Math.sqrt(dx * dx + dy * dy)
    const ux = dx / len
    const uy = dy / len

    return (
      <g
        key={line.id}
        onClick={() => !result && setSelectedLine(line.id)}
        className={`cursor-pointer ${result ? 'cursor-default' : ''}`}
        role="button"
        tabIndex={0}
        aria-label={line.label ?? `Linie ${line.id}`}
        aria-pressed={isSelected}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (!result) setSelectedLine(line.id)
          }
        }}
      >
        {/* Click target (wider) */}
        <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="transparent" strokeWidth={20} />

        {/* Visible line */}
        <line
          x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
          stroke={resultColor}
          strokeWidth={isSelected ? 3 : 2}
          strokeDasharray={strokeDash}
        />

        {/* Arrow head at end */}
        {state.arrowHead !== 'none' && (
          <polygon
            points={`
              ${line.x2},${line.y2}
              ${line.x2 - ux * 12 + uy * 6},${line.y2 - uy * 12 - ux * 6}
              ${line.x2 - ux * 12 - uy * 6},${line.y2 - uy * 12 + ux * 6}
            `}
            fill={state.arrowHead === 'filled' ? resultColor : state.arrowHead === 'closed' ? 'white' : 'none'}
            stroke={resultColor}
            strokeWidth={2}
          />
        )}

        {/* Diamond at start */}
        {state.diamond !== 'none' && (
          <polygon
            points={`
              ${line.x1},${line.y1}
              ${line.x1 + ux * 10 + uy * 6},${line.y1 + uy * 10 - ux * 6}
              ${line.x1 + ux * 20},${line.y1 + uy * 20}
              ${line.x1 + ux * 10 - uy * 6},${line.y1 + uy * 10 + ux * 6}
            `}
            fill={state.diamond === 'filled' ? resultColor : 'white'}
            stroke={resultColor}
            strokeWidth={2}
          />
        )}

        {/* Label */}
        {line.label && (
          <text
            x={(line.x1 + line.x2) / 2}
            y={(line.y1 + line.y2) / 2 - 10}
            textAnchor="middle"
            className="text-xs fill-text-light pointer-events-none"
          >
            {line.label}
          </text>
        )}
      </g>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light">{exercise.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SVG Canvas */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-border p-4">
          <svg
            viewBox={`0 0 ${exercise.svgWidth} ${exercise.svgHeight}`}
            className="w-full"
            aria-label="Diagramm zum Bearbeiten"
          >
            {/* Class boxes */}
            {exercise.classes?.map((cls) => (
              <g key={cls.name}>
                <rect x={cls.x} y={cls.y} width={cls.width} height={cls.height} fill="white" stroke="#1e293b" strokeWidth={2} rx={2} />
                <text x={cls.x + cls.width / 2} y={cls.y + cls.height / 2 + 5} textAnchor="middle" className="text-sm font-bold fill-text">{cls.name}</text>
              </g>
            ))}
            {exercise.lines.map(renderLine)}
          </svg>
        </div>

        {/* Toolbar */}
        <div className="bg-surface rounded-lg p-4 space-y-4">
          <h4 className="font-semibold text-text">
            {selectedLine ? `Linie: ${exercise.lines.find((l) => l.id === selectedLine)?.label ?? selectedLine}` : 'Linie auswählen'}
          </h4>

          {selectedLine && !result && (
            <>
              <div>
                <label className="text-sm font-medium text-text-light block mb-1">Linienart:</label>
                <div className="space-y-1">
                  {lineStyleOptions.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="lineStyle"
                        checked={lineStates[selectedLine].lineStyle === opt.value}
                        onChange={() => updateLine('lineStyle', opt.value)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-text-light block mb-1">Pfeilspitze:</label>
                <div className="space-y-1">
                  {arrowHeadOptions.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="arrowHead"
                        checked={lineStates[selectedLine].arrowHead === opt.value}
                        onChange={() => updateLine('arrowHead', opt.value)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-text-light block mb-1">Raute:</label>
                <div className="space-y-1">
                  {diamondOptions.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="diamond"
                        checked={lineStates[selectedLine].diamond === opt.value}
                        onChange={() => updateLine('diamond', opt.value)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {!result && (
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
