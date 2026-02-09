import type { ReactNode } from 'react'

interface Props {
  index: number
  total: number
  children: ReactNode
}

export function ExerciseCard({ index, total, children }: Props) {
  return (
    <section className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-primary/5 to-transparent px-6 py-3 border-b border-border flex items-center gap-3">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-xs font-bold">
          {index}
        </span>
        <span className="text-sm text-text-light">
          Aufgabe {index} von {total}
        </span>
      </div>
      <div className="p-6">
        {children}
      </div>
    </section>
  )
}
