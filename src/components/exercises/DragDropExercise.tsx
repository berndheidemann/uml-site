import { useState, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { SortableItem, DroppableZone, DragItemCard } from '../common/DragDropZone.tsx'
import { ExerciseFeedback } from '../common/ExerciseFeedback.tsx'
import { useExercise } from '../../hooks/useExercise.ts'
import { validateDragDropZuordnung, validateDragDropSortierung } from '../../utils/exercise-validators.ts'
import type {
  DragDropZuordnungExercise,
  DragDropSortierungExercise,
  DragDropConnectorExercise,
} from '../../types/index.ts'

// === Zuordnung Mode ===

interface ZuordnungProps {
  exercise: DragDropZuordnungExercise
  onNext?: () => void
}

export function DragDropZuordnung({ exercise, onNext }: ZuordnungProps) {
  const { result, attempts, showHints, submit, reset, toggleHints } = useExercise<Record<string, string>>(exercise)
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [unassigned, setUnassigned] = useState(exercise.items.map((i) => i.id))

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const itemId = active.id as string
    const zoneId = over.id as string

    // Check if the drop target is a valid zone
    const isValidZone = exercise.zones.some((z) => z.id === zoneId)
    if (!isValidZone) return

    setAssignments((prev) => ({ ...prev, [itemId]: zoneId }))
    setUnassigned((prev) => prev.filter((id) => id !== itemId))
  }, [exercise.zones])

  const handleSubmit = () => {
    submit(() => validateDragDropZuordnung(assignments, exercise.correctMapping, exercise.maxPoints))
  }

  const handleReset = () => {
    reset()
    setAssignments({})
    setUnassigned(exercise.items.map((i) => i.id))
  }

  const getItemsInZone = (zoneId: string) =>
    exercise.items.filter((item) => assignments[item.id] === zoneId)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light">{exercise.description}</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {/* Unassigned items */}
        {unassigned.length > 0 && (
          <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
            <p className="text-sm font-bold text-slate-600 mb-3">Elemente zum Zuordnen:</p>
            <SortableContext items={unassigned} strategy={verticalListSortingStrategy}>
              <div className="flex flex-wrap gap-2">
                {unassigned.map((id) => {
                  const item = exercise.items.find((i) => i.id === id)!
                  return (
                    <SortableItem key={id} id={id} disabled={!!result}>
                      <DragItemCard>{item.content}</DragItemCard>
                    </SortableItem>
                  )
                })}
              </div>
            </SortableContext>
          </div>
        )}

        {/* Drop zones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercise.zones.map((zone) => (
            <DroppableZone key={zone.id} id={zone.id} label={zone.label}>
              <SortableContext items={getItemsInZone(zone.id).map((i) => i.id)} strategy={verticalListSortingStrategy}>
                {getItemsInZone(zone.id).map((item) => {
                  const detail = result?.details?.find((d) => d.itemId === item.id)
                  return (
                    <SortableItem key={item.id} id={item.id} disabled={!!result}>
                      <DragItemCard isCorrect={detail?.correct ?? null}>
                        {item.content}
                      </DragItemCard>
                    </SortableItem>
                  )
                })}
              </SortableContext>
            </DroppableZone>
          ))}
        </div>
      </DndContext>

      {!result && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(assignments).length < exercise.items.length}
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

      {attempts > 0 && !result && (
        <p className="text-sm text-text-light">Versuch {attempts + 1}</p>
      )}
    </div>
  )
}

// === Sortierung Mode ===

interface SortierungProps {
  exercise: DragDropSortierungExercise
  onNext?: () => void
}

export function DragDropSortierung({ exercise, onNext }: SortierungProps) {
  const { result, showHints, submit, reset, toggleHints } = useExercise<string[]>(exercise)
  const [orderedIds, setOrderedIds] = useState(
    () => [...exercise.items.map((i) => i.id)].sort(() => Math.random() - 0.5)
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setOrderedIds((items) => {
      const oldIndex = items.indexOf(active.id as string)
      const newIndex = items.indexOf(over.id as string)
      return arrayMove(items, oldIndex, newIndex)
    })
  }, [])

  const handleSubmit = () => {
    submit(() => validateDragDropSortierung(orderedIds, exercise.correctOrder, exercise.maxPoints))
  }

  const handleReset = () => {
    reset()
    setOrderedIds([...exercise.items.map((i) => i.id)].sort(() => Math.random() - 0.5))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light">{exercise.description}</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={orderedIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {orderedIds.map((id, index) => {
              const item = exercise.items.find((i) => i.id === id)!
              const detail = result?.details?.find((d) => d.itemId === id)
              return (
                <SortableItem key={id} id={id} disabled={!!result}>
                  <DragItemCard isCorrect={detail?.correct ?? null} className="flex items-center gap-3">
                    <span className="text-text-light font-mono text-sm w-6">{index + 1}.</span>
                    <span>{item.content}</span>
                  </DragItemCard>
                </SortableItem>
              )
            })}
          </div>
        </SortableContext>
      </DndContext>

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

// === Connector Mode ===

interface ConnectorProps {
  exercise: DragDropConnectorExercise
  onNext?: () => void
}

export function DragDropConnector({ exercise, onNext }: ConnectorProps) {
  const { result, showHints, submit, reset, toggleHints } = useExercise<Record<string, string>>(exercise)
  const [assignments, setAssignments] = useState<Record<string, string>>({})

  const handleAssign = (itemId: string, positionId: string) => {
    setAssignments((prev) => ({ ...prev, [itemId]: positionId }))
  }

  const handleSubmit = () => {
    submit(() => validateDragDropZuordnung(assignments, exercise.correctMapping, exercise.maxPoints))
  }

  const handleReset = () => {
    reset()
    setAssignments({})
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light">{exercise.description}</p>
      </div>

      {/* Items to assign */}
      <div className="space-y-3">
        {exercise.items.map((item) => {
          const assignedTo = assignments[item.id]
          const detail = result?.details?.find((d) => d.itemId === item.id)
          return (
            <div key={item.id} className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              <DragItemCard isCorrect={detail?.correct ?? null} className="shrink-0">
                {item.content}
              </DragItemCard>
              <svg className="w-5 h-5 text-slate-300 shrink-0 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <select
                value={assignedTo ?? ''}
                onChange={(e) => handleAssign(item.id, e.target.value)}
                disabled={!!result}
                className="flex-1 min-w-0 text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                aria-label={`Position für ${item.content}`}
              >
                <option value="">— wählen —</option>
                {exercise.positions.map((pos) => (
                  <option key={pos.id} value={pos.id}>{pos.label}</option>
                ))}
              </select>
            </div>
          )
        })}
      </div>

      {!result && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(assignments).length < exercise.items.length}
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

// === Unified Export ===

type DragDropExerciseType = DragDropZuordnungExercise | DragDropSortierungExercise | DragDropConnectorExercise

export function DragDropExercise({ exercise, onNext }: { exercise: DragDropExerciseType; onNext?: () => void }) {
  switch (exercise.exerciseType) {
    case 'drag-drop-zuordnung':
      return <DragDropZuordnung exercise={exercise} onNext={onNext} />
    case 'drag-drop-sortierung':
      return <DragDropSortierung exercise={exercise} onNext={onNext} />
    case 'drag-drop-connector':
      return <DragDropConnector exercise={exercise} onNext={onNext} />
  }
}
