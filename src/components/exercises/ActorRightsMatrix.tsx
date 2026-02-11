import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExerciseFeedback } from '../common/ExerciseFeedback.tsx'
import { useExercise } from '../../hooks/useExercise.ts'
import type { ExerciseBase, ValidationResult } from '../../types/index.ts'

// === Embedded Exercise Data ===

const exercise: ExerciseBase = {
  id: 'uc-matrix-01',
  version: 2,
  title: 'Akteur-Rechte-Matrix',
  description:
    'Bestimme, welcher Akteur auf welchen Use Case Zugriff hat. Beachte die Vererbung!',
  diagramType: 'usecasediagramm',
  exerciseType: 'custom',
  level: 2,
  maxPoints: 6,
  hints: [
    'Schulleiter erbt alle Rechte von Lehrer.',
    'Jeder Akteur hat nur Zugriff auf die Use Cases, die direkt oder ueber Vererbung verbunden sind.',
  ],
}

interface Actor {
  id: string
  label: string
  inheritsFrom?: string
}

interface UseCase {
  id: string
  label: string
}

const actors: Actor[] = [
  { id: 'schueler', label: 'Schueler' },
  { id: 'lehrer', label: 'Lehrer' },
  { id: 'schulleiter', label: 'Schulleiter', inheritsFrom: 'lehrer' },
]

const useCases: UseCase[] = [
  { id: 'uc-noten-einsehen', label: 'Noten einsehen' },
  { id: 'uc-noten-vergeben', label: 'Noten vergeben' },
  { id: 'uc-stundenplan', label: 'Stundenplan einsehen' },
  { id: 'uc-klassenarbeit', label: 'Klassenarbeit anlegen' },
  { id: 'uc-zeugnis', label: 'Zeugnis erstellen' },
  { id: 'uc-statistik', label: 'Statistik abrufen' },
]

// Correct direct mappings (not inherited)
const correctDirectAccess: Record<string, Set<string>> = {
  schueler: new Set(['uc-noten-einsehen', 'uc-stundenplan']),
  lehrer: new Set(['uc-noten-vergeben', 'uc-klassenarbeit', 'uc-stundenplan']),
  schulleiter: new Set(['uc-zeugnis', 'uc-statistik']),
}

// Build full correct access including inherited rights
function buildFullAccess(): Record<string, Set<string>> {
  const full: Record<string, Set<string>> = {}
  for (const actor of actors) {
    full[actor.id] = new Set(correctDirectAccess[actor.id])
    if (actor.inheritsFrom && correctDirectAccess[actor.inheritsFrom]) {
      for (const uc of correctDirectAccess[actor.inheritsFrom]) {
        full[actor.id].add(uc)
      }
    }
  }
  return full
}

const correctFullAccess = buildFullAccess()

// Determine which use cases are inherited for each actor
function getInheritedUseCases(actorId: string): Set<string> {
  const actor = actors.find((a) => a.id === actorId)
  if (!actor?.inheritsFrom) return new Set()
  return new Set(correctDirectAccess[actor.inheritsFrom] ?? [])
}

// Cell key helper
function cellKey(actorId: string, ucId: string): string {
  return `${actorId}::${ucId}`
}

// === Inheritance Diagram Component ===

function InheritanceDiagram() {
  return (
    <div className="flex items-center justify-center gap-4 py-3">
      <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-blue-300 rounded-lg">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="10" cy="6" r="3" stroke="#2563eb" strokeWidth="1.5" />
          <path d="M10 9 L10 15" stroke="#2563eb" strokeWidth="1.5" />
          <path d="M6 12 L10 9 L14 12" stroke="#2563eb" strokeWidth="1.5" fill="none" />
          <path d="M6 18 L10 15 L14 18" stroke="#2563eb" strokeWidth="1.5" fill="none" />
        </svg>
        <span className="text-sm font-semibold text-blue-800">Schulleiter</span>
      </div>

      <div className="flex flex-col items-center">
        <svg
          width="80"
          height="28"
          viewBox="0 0 80 28"
          aria-hidden="true"
        >
          <defs>
            <marker
              id="triangle-inherit"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="10"
              markerHeight="10"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="none" stroke="#475569" strokeWidth="1.5" />
            </marker>
          </defs>
          <line
            x1="0"
            y1="14"
            x2="60"
            y2="14"
            stroke="#475569"
            strokeWidth="2"
            markerEnd="url(#triangle-inherit)"
          />
        </svg>
        <span className="text-xs text-text-light mt-0.5">erbt von</span>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-blue-300 rounded-lg">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="10" cy="6" r="3" stroke="#2563eb" strokeWidth="1.5" />
          <path d="M10 9 L10 15" stroke="#2563eb" strokeWidth="1.5" />
          <path d="M6 12 L10 9 L14 12" stroke="#2563eb" strokeWidth="1.5" fill="none" />
          <path d="M6 18 L10 15 L14 18" stroke="#2563eb" strokeWidth="1.5" fill="none" />
        </svg>
        <span className="text-sm font-semibold text-blue-800">Lehrer</span>
      </div>
    </div>
  )
}

// === Matrix Cell Component ===

interface MatrixCellProps {
  actorId: string
  ucId: string
  checked: boolean
  inherited: boolean
  disabled: boolean
  resultState: 'none' | 'correct' | 'wrong-checked' | 'wrong-unchecked'
  onToggle: () => void
}

function MatrixCell({
  actorId,
  ucId,
  checked,
  inherited,
  disabled,
  resultState,
  onToggle,
}: MatrixCellProps) {
  const isInherited = inherited && checked

  let bgClass = 'bg-white hover:bg-gray-50'
  if (resultState === 'correct') {
    bgClass = 'bg-green-50'
  } else if (resultState === 'wrong-checked') {
    bgClass = 'bg-red-50'
  } else if (resultState === 'wrong-unchecked') {
    bgClass = 'bg-yellow-50'
  } else if (isInherited) {
    bgClass = 'bg-amber-50'
  }

  const borderClass =
    resultState === 'correct'
      ? 'ring-2 ring-green-400'
      : resultState === 'wrong-checked'
        ? 'ring-2 ring-red-400'
        : resultState === 'wrong-unchecked'
          ? 'ring-2 ring-yellow-400'
          : ''

  return (
    <td className={`text-center p-2 border border-border ${bgClass} ${borderClass}`}>
      <button
        onClick={onToggle}
        disabled={disabled || isInherited}
        className={`w-8 h-8 rounded border-2 flex items-center justify-center mx-auto transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
          isInherited
            ? 'border-amber-300 bg-amber-100 cursor-not-allowed'
            : checked
              ? 'border-primary bg-primary text-white'
              : 'border-gray-300 bg-white hover:border-primary/50'
        } ${disabled && !isInherited ? 'cursor-default' : ''}`}
        role="checkbox"
        aria-checked={checked}
        aria-label={`${actors.find((a) => a.id === actorId)?.label} hat Zugriff auf ${useCases.find((u) => u.id === ucId)?.label}${isInherited ? ' (geerbt)' : ''}`}
        title={isInherited ? '(geerbt)' : undefined}
      >
        {checked && (
          <svg
            className={`w-5 h-5 ${isInherited ? 'text-amber-500' : 'text-white'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      {isInherited && (
        <span className="text-xs text-amber-600 block mt-0.5">(geerbt)</span>
      )}
    </td>
  )
}

// === Main Component ===

type MatrixState = Record<string, boolean>

export function ActorRightsMatrix() {
  const { result, showHints, submit, reset, toggleHints } =
    useExercise<MatrixState>(exercise)
  const [matrix, setMatrix] = useState<MatrixState>({})

  // Compute inherited states: if Mitarbeiter cell is checked and Admin inherits,
  // Admin gets auto-filled
  function getEffectiveMatrix(): MatrixState {
    const effective = { ...matrix }
    for (const actor of actors) {
      if (actor.inheritsFrom) {
        for (const uc of useCases) {
          const parentKey = cellKey(actor.inheritsFrom, uc.id)
          const childKey = cellKey(actor.id, uc.id)
          if (matrix[parentKey]) {
            effective[childKey] = true
          }
        }
      }
    }
    return effective
  }

  const effectiveMatrix = getEffectiveMatrix()

  function isInheritedCell(actorId: string, ucId: string): boolean {
    const actor = actors.find((a) => a.id === actorId)
    if (!actor?.inheritsFrom) return false
    const parentKey = cellKey(actor.inheritsFrom, ucId)
    return !!matrix[parentKey]
  }

  const handleToggle = (actorId: string, ucId: string) => {
    if (result) return
    // Prevent toggling inherited cells
    if (isInheritedCell(actorId, ucId)) return

    const key = cellKey(actorId, ucId)
    setMatrix((prev) => {
      const next = { ...prev }
      if (next[key]) {
        delete next[key]
      } else {
        next[key] = true
      }
      return next
    })
  }

  const handleSubmit = () => {
    const effective = getEffectiveMatrix()

    submit((): ValidationResult => {
      let score = 0
      let totalCells = 0
      const wrongCells: string[] = []

      for (const actor of actors) {
        for (const uc of useCases) {
          totalCells++
          const key = cellKey(actor.id, uc.id)
          const isChecked = !!effective[key]
          const shouldBeChecked = correctFullAccess[actor.id]?.has(uc.id) ?? false

          if (isChecked === shouldBeChecked) {
            score++
          } else {
            wrongCells.push(key)
          }
        }
      }

      // Scale score to maxPoints
      const scaledScore = Math.round((score / totalCells) * exercise.maxPoints)

      return {
        correct: wrongCells.length === 0,
        score: scaledScore,
        maxScore: exercise.maxPoints,
        feedback:
          wrongCells.length === 0
            ? 'Perfekt! Du hast alle Zuordnungen korrekt erkannt -- auch die Vererbung.'
            : `${wrongCells.length} Zelle(n) sind falsch. Beachte, welche Use Cases direkt zugeordnet sind und welche ueber Vererbung weitergegeben werden.`,
        details: wrongCells.map((key) => ({
          itemId: key,
          correct: false,
          feedback: 'Falsche Zuordnung',
        })),
      }
    })
  }

  const handleReset = () => {
    reset()
    setMatrix({})
  }

  // Determine result state for a cell after submission
  function getCellResultState(
    actorId: string,
    ucId: string,
  ): 'none' | 'correct' | 'wrong-checked' | 'wrong-unchecked' {
    if (!result) return 'none'
    const key = cellKey(actorId, ucId)
    const isChecked = !!effectiveMatrix[key]
    const shouldBeChecked = correctFullAccess[actorId]?.has(ucId) ?? false

    if (isChecked === shouldBeChecked) return 'correct'
    if (isChecked && !shouldBeChecked) return 'wrong-checked'
    return 'wrong-unchecked'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light">{exercise.description}</p>
      </div>

      {/* Inheritance Diagram */}
      <div className="bg-white rounded-xl border border-border p-4">
        <p className="text-sm font-semibold text-text mb-2">
          Vererbungshierarchie der Akteure:
        </p>
        <InheritanceDiagram />
        <p className="text-xs text-text-light text-center mt-1">
          Schulleiter erbt alle Rechte von Lehrer (Generalisierung)
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-text-light">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-5 h-5 rounded border-2 border-primary bg-primary" aria-hidden="true">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          Direkt zugeordnet
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-5 h-5 rounded border-2 border-amber-300 bg-amber-100" aria-hidden="true">
            <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          Geerbt (automatisch)
        </span>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse border border-border bg-white rounded-lg overflow-hidden"
          role="grid"
          aria-label="Akteur-Rechte-Matrix"
        >
          <thead>
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-text bg-surface-dark border border-border">
                Akteur / Use Case
              </th>
              {useCases.map((uc) => (
                <th
                  key={uc.id}
                  className="p-3 text-center text-sm font-semibold text-text bg-surface-dark border border-border min-w-[120px]"
                >
                  {uc.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {actors.map((actor, rowIndex) => (
              <motion.tr
                key={actor.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIndex * 0.08 }}
                className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
              >
                <td className="p-3 font-medium text-text border border-border bg-surface-dark/30">
                  <div className="flex items-center gap-2">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle cx="10" cy="6" r="3" stroke="#2563eb" strokeWidth="1.5" />
                      <path d="M10 9 L10 15" stroke="#2563eb" strokeWidth="1.5" />
                      <path d="M6 12 L10 9 L14 12" stroke="#2563eb" strokeWidth="1.5" fill="none" />
                      <path d="M6 18 L10 15 L14 18" stroke="#2563eb" strokeWidth="1.5" fill="none" />
                    </svg>
                    <span>{actor.label}</span>
                    {actor.inheritsFrom && (
                      <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                        erbt von{' '}
                        {actors.find((a) => a.id === actor.inheritsFrom)?.label}
                      </span>
                    )}
                  </div>
                </td>
                {useCases.map((uc) => (
                  <MatrixCell
                    key={uc.id}
                    actorId={actor.id}
                    ucId={uc.id}
                    checked={!!effectiveMatrix[cellKey(actor.id, uc.id)]}
                    inherited={isInheritedCell(actor.id, uc.id)}
                    disabled={!!result}
                    resultState={getCellResultState(actor.id, uc.id)}
                    onToggle={() => handleToggle(actor.id, uc.id)}
                  />
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Explanation after submit */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2"
          >
            <p className="font-semibold text-blue-800 text-sm">
              Vererbung bei Akteuren:
            </p>
            <p className="text-sm text-blue-700">
              In UML-Use-Case-Diagrammen bedeutet eine Generalisierung (Vererbung)
              zwischen Akteuren, dass der spezialisiertere Akteur (hier: Schulleiter) alle
              Use Cases des allgemeineren Akteurs (hier: Lehrer) erbt. Der Schulleiter
              kann also alles, was der Lehrer kann -- plus eigene, zusaetzliche Use
              Cases.
            </p>
            <div className="mt-3 space-y-1">
              <p className="text-xs font-semibold text-blue-800">
                Korrekte Zuordnung:
              </p>
              {actors.map((actor) => (
                <p key={actor.id} className="text-xs text-blue-700">
                  <span className="font-medium">{actor.label}:</span>{' '}
                  {useCases
                    .filter((uc) => correctFullAccess[actor.id]?.has(uc.id))
                    .map((uc) => {
                      const inherited = getInheritedUseCases(actor.id).has(uc.id)
                      return inherited ? `${uc.label} (geerbt)` : uc.label
                    })
                    .join(', ') || 'keine'}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      {!result && (
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Auswerten
        </button>
      )}

      {/* Feedback */}
      {result && (
        <ExerciseFeedback
          result={result}
          hints={exercise.hints}
          showHints={showHints}
          onToggleHints={toggleHints}
          onRetry={handleReset}
        />
      )}
    </div>
  )
}
