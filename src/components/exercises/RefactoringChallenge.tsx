import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExerciseFeedback } from '../common/ExerciseFeedback.tsx'
import { useExercise } from '../../hooks/useExercise.ts'
import type { ExerciseBase, ValidationResult } from '../../types/index.ts'

// === Embedded Exercise Data ===

const exercise: ExerciseBase = {
  id: 'kd-refactoring-01',
  version: 3,
  title: 'Refactoring-Challenge: Vererbung extrahieren',
  description: 'Verschiebe gemeinsame Attribute und Methoden in die Superklasse.',
  diagramType: 'klassendiagramm',
  exerciseType: 'custom',
  level: 3,
  maxPoints: 3,
  hints: [
    'Gemeinsame Attribute und Methoden gehoeren in die Superklasse.',
    'Spezifische Member, die nur eine Subklasse betreffen, bleiben in der Subklasse.',
    'Vergleiche die beiden Subklassen: Welche Eintraege tauchen in beiden auf?',
  ],
}

interface ClassMember {
  id: string
  content: string
  isShared: boolean // Should be moved to superclass
}

interface SubclassData {
  name: string
  members: ClassMember[]
}

const subclasses: SubclassData[] = [
  {
    name: 'PKW',
    members: [
      { id: 'pkw-kenn', content: '- kennzeichen : String', isShared: true },
      { id: 'pkw-bj', content: '- baujahr : int', isShared: true },
      { id: 'pkw-sitze', content: '- anzahlSitze : int', isShared: false },
      { id: 'pkw-kofferraum', content: '- kofferraumVolumen : double', isShared: false },
      { id: 'pkw-alter', content: '+ getAlter() : int', isShared: true },
    ],
  },
  {
    name: 'LKW',
    members: [
      { id: 'lkw-kenn', content: '- kennzeichen : String', isShared: true },
      { id: 'lkw-bj', content: '- baujahr : int', isShared: true },
      { id: 'lkw-lade', content: '- ladekapazitaet : double', isShared: false },
      { id: 'lkw-achsen', content: '- anzahlAchsen : int', isShared: false },
      { id: 'lkw-alter', content: '+ getAlter() : int', isShared: true },
    ],
  },
]

// The shared items (by content) that should be in the superclass
const sharedContents = new Set([
  '- kennzeichen : String',
  '- baujahr : int',
  '+ getAlter() : int',
])

// === Main Component ===

export function RefactoringChallenge() {
  const { result, showHints, submit, reset, toggleHints } = useExercise<string[]>(exercise)

  // Track which items have been moved to superclass (by id)
  const [movedToSuper, setMovedToSuper] = useState<string[]>([])

  const handleMoveToSuper = useCallback(
    (memberId: string) => {
      if (result) return
      setMovedToSuper((prev) => (prev.includes(memberId) ? prev : [...prev, memberId]))
    },
    [result]
  )

  const handleMoveBack = useCallback(
    (memberId: string) => {
      if (result) return
      setMovedToSuper((prev) => prev.filter((id) => id !== memberId))
    },
    [result]
  )

  // Get all members currently in the superclass
  const superclassMembers: ClassMember[] = movedToSuper
    .map((id) => {
      for (const sc of subclasses) {
        const member = sc.members.find((m) => m.id === id)
        if (member) return member
      }
      return null
    })
    .filter((m): m is ClassMember => m !== null)

  // Deduplicate superclass display by content
  const seenContents = new Set<string>()
  const uniqueSuperMembers = superclassMembers.filter((m) => {
    if (seenContents.has(m.content)) return false
    seenContents.add(m.content)
    return true
  })

  // For each subclass, get remaining members (not moved)
  const getRemainingMembers = (sc: SubclassData) =>
    sc.members.filter((m) => !movedToSuper.includes(m.id))

  const handleSubmit = () => {
    submit((): ValidationResult => {
      // Get the set of contents in the superclass
      const movedContents = new Set(superclassMembers.map((m) => m.content))

      // Check: all shared items should be in the superclass
      let correctMoves = 0
      for (const content of sharedContents) {
        if (movedContents.has(content)) correctMoves++
      }

      // Check: no non-shared items should be in the superclass
      let wrongMoves = 0
      for (const content of movedContents) {
        if (!sharedContents.has(content)) wrongMoves++
      }

      const score = Math.max(0, correctMoves - wrongMoves)
      const maxScore = exercise.maxPoints

      const allCorrect = correctMoves === sharedContents.size && wrongMoves === 0

      return {
        correct: allCorrect,
        score: Math.min(score, maxScore),
        maxScore,
        feedback: allCorrect
          ? 'Perfekt! Du hast alle gemeinsamen Member korrekt in die Superklasse verschoben.'
          : wrongMoves > 0
            ? `Du hast ${wrongMoves} spezifische(n) Member faelschlicherweise in die Superklasse verschoben. Nur gemeinsame Member gehoeren dorthin.`
            : `Du hast ${correctMoves} von ${sharedContents.size} gemeinsamen Membern gefunden. Schau nochmal genau hin!`,
      }
    })
  }

  const handleReset = () => {
    reset()
    setMovedToSuper([])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light">{exercise.description}</p>
        <p className="text-sm text-text-light mt-1">
          Klicke auf ein Element in einer Subklasse, um es in die Superklasse zu verschieben.
          Klicke auf ein Element in der Superklasse, um es zurueckzuverschieben.
        </p>
      </div>

      {/* Fahrzeugverwaltung Scenario context */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <span className="font-semibold">Szenario:</span> In einer Fahrzeugverwaltung gibt es verschiedene Fahrzeugtypen.
        PKW transportieren Personen, LKW transportieren Gueter.
        Extrahiere die gemeinsamen Eigenschaften in die Superklasse „Fahrzeug".
      </div>

      {/* Diagram Layout */}
      <div className="flex flex-col items-center gap-2">
        {/* Superclass */}
        <div className="w-full max-w-md">
          <div
            className={`rounded-xl border-2 overflow-hidden transition-colors ${
              result
                ? 'border-slate-300'
                : movedToSuper.length > 0
                  ? 'border-primary'
                  : 'border-dashed border-slate-300'
            }`}
          >
            {/* Class header */}
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-2 text-center font-bold text-lg">
              Fahrzeug
            </div>

            {/* Members area / Drop zone */}
            <div className="bg-white min-h-[80px] p-3 space-y-1">
              {uniqueSuperMembers.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4 italic">
                  Klicke auf gemeinsame Member, um sie hierher zu verschieben
                </p>
              ) : (
                <AnimatePresence>
                  {uniqueSuperMembers.map((member) => {
                    const isWrong = result && !member.isShared
                    const isRight = result && member.isShared
                    return (
                      <motion.button
                        key={member.content}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => {
                          // Find all ids with this content and move them back
                          const idsToRemove = superclassMembers
                            .filter((m) => m.content === member.content)
                            .map((m) => m.id)
                          idsToRemove.forEach((id) => handleMoveBack(id))
                        }}
                        disabled={!!result}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-sm font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                          isWrong
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : isRight
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200 cursor-pointer'
                        } ${result ? 'cursor-default' : ''}`}
                        aria-label={`${member.content} zurueck in Subklasse verschieben`}
                      >
                        {member.content}
                      </motion.button>
                    )
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        {/* Inheritance arrows */}
        <div className="flex justify-center gap-24 w-full max-w-2xl relative">
          <svg
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-12"
            viewBox="0 0 400 48"
            aria-hidden="true"
          >
            {/* Left arrow */}
            <line x1="120" y1="48" x2="180" y2="4" stroke="#6366f1" strokeWidth="2" />
            <polygon points="180,4 174,14 184,12" fill="white" stroke="#6366f1" strokeWidth="2" />
            {/* Right arrow */}
            <line x1="280" y1="48" x2="220" y2="4" stroke="#6366f1" strokeWidth="2" />
            <polygon points="220,4 216,12 226,14" fill="white" stroke="#6366f1" strokeWidth="2" />
          </svg>
          <div className="h-12" />
        </div>

        {/* Subclasses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          {subclasses.map((sc) => {
            const remaining = getRemainingMembers(sc)
            return (
              <div key={sc.name} className="rounded-xl border-2 border-slate-300 overflow-hidden">
                {/* Class header */}
                <div className="bg-gradient-to-r from-slate-500 to-slate-600 text-white px-4 py-2 text-center font-bold">
                  {sc.name}
                </div>

                {/* Members */}
                <div className="bg-white min-h-[60px] p-3 space-y-1">
                  <AnimatePresence>
                    {remaining.map((member) => {
                      const shouldBeInSuper = member.isShared
                      const isWrong = result && shouldBeInSuper // Left behind but should have been moved
                      return (
                        <motion.button
                          key={member.id}
                          layout
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -20 }}
                          onClick={() => handleMoveToSuper(member.id)}
                          disabled={!!result}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-sm font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                            isWrong
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : result
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-slate-50 text-slate-700 hover:bg-primary/10 hover:text-primary border border-slate-200 cursor-pointer'
                          } ${result ? 'cursor-default' : ''}`}
                          aria-label={`${member.content} in Superklasse verschieben`}
                        >
                          {member.content}
                          {result && isWrong && (
                            <span className="ml-2 text-xs text-amber-600">(gehoert nach oben)</span>
                          )}
                        </motion.button>
                      )
                    })}
                  </AnimatePresence>
                  {remaining.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-2 italic">Alle Member verschoben</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Info about move count */}
      {!result && (
        <p className="text-sm text-text-light text-center">
          {uniqueSuperMembers.length} Member in der Superklasse
        </p>
      )}

      {/* Submit Button */}
      {!result && (
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={movedToSuper.length === 0}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Auswerten
          </button>
        </div>
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
