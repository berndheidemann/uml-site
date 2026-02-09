import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ReactNode } from 'react'

interface SortableItemProps {
  id: string
  children: ReactNode
  disabled?: boolean
}

export function SortableItem({ id, children, disabled }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: disabled ? 'default' : 'grab',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

interface DroppableZoneProps {
  id: string
  label: string
  children: ReactNode
  isOver?: boolean
  className?: string
}

export function DroppableZone({ label, children, isOver, className }: DroppableZoneProps) {
  return (
    <div
      className={`min-h-[90px] p-4 rounded-xl border-2 border-dashed transition-all ${
        isOver
          ? 'border-primary bg-primary/5 shadow-inner'
          : 'border-slate-300 bg-slate-50/50'
      } ${className ?? ''}`}
      aria-label={`Ablagebereich: ${label}`}
    >
      <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">{label}</p>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  )
}

interface DragItemCardProps {
  children: ReactNode
  isCorrect?: boolean | null
  className?: string
}

export function DragItemCard({ children, isCorrect, className }: DragItemCardProps) {
  const stateStyles = isCorrect === true
    ? 'border-success bg-green-50 shadow-sm'
    : isCorrect === false
      ? 'border-error bg-red-50 shadow-sm'
      : 'border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-primary/40 transition-all'

  return (
    <div className={`px-3 py-2 rounded-lg border ${stateStyles} text-sm flex items-center gap-2 ${className ?? ''}`}>
      {isCorrect === null || isCorrect === undefined ? (
        <svg className="w-4 h-4 text-slate-300 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="5" cy="6" r="1.5" />
          <circle cx="5" cy="10" r="1.5" />
          <circle cx="5" cy="14" r="1.5" />
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="9" cy="10" r="1.5" />
          <circle cx="9" cy="14" r="1.5" />
        </svg>
      ) : null}
      <span className="flex-1">{children}</span>
    </div>
  )
}
