import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExerciseFeedback } from '../common/ExerciseFeedback.tsx'
import { useExercise } from '../../hooks/useExercise.ts'
import type { ExerciseBase, ValidationResult } from '../../types/index.ts'

// === Embedded Exercise Data ===

const exercise: ExerciseBase = {
  id: 'sd-fragment-01',
  version: 2,
  title: 'Fragment-Wrapper: Das richtige Fragment waehlen',
  description: 'Ordne jeder Nachrichtengruppe im Reisebuero-Szenario das korrekte UML-Fragment zu.',
  diagramType: 'sequenzdiagramm',
  exerciseType: 'custom',
  level: 2,
  maxPoints: 4,
  hints: [
    'alt = zwei oder mehr Alternativen (if/else)',
    'opt = optional, nur ein Zweig (if ohne else)',
    'loop = Wiederholung (for, while, foreach)',
  ],
}

type FragmentType = 'alt' | 'loop' | 'opt'

interface FragmentScenario {
  id: string
  description: string
  correct: FragmentType
  guards: string[]
  explanation: string
}

const fragmentOptions: { value: FragmentType; label: string; description: string }[] = [
  { value: 'alt', label: 'alt', description: 'Alternative (if/else)' },
  { value: 'loop', label: 'loop', description: 'Schleife (Wiederholung)' },
  { value: 'opt', label: 'opt', description: 'Optional (if ohne else)' },
]

const scenarios: FragmentScenario[] = [
  {
    id: 'f1',
    description:
      'Der Kunde waehlt zwischen Flug und Bahnfahrt. Je nach Wahl werden unterschiedliche Buchungsschritte ausgefuehrt.',
    correct: 'alt',
    guards: ['[Flug gewaehlt]', '[Bahn gewaehlt]'],
    explanation:
      'Es gibt zwei sich ausschliessende Alternativen (Flug oder Bahn). Das ist ein klassischer alt-Fragment mit zwei Operanden, getrennt durch eine gestrichelte Linie.',
  },
  {
    id: 'f2',
    description:
      'Optional kann der Kunde einen Mietwagen dazu buchen.',
    correct: 'opt',
    guards: ['[Mietwagen gewuenscht]'],
    explanation:
      'Es gibt nur eine Bedingung ohne Alternative (kein „sonst"-Fall). Wenn der Kunde keinen Mietwagen moechte, passiert einfach nichts. Das ist ein opt-Fragment.',
  },
  {
    id: 'f3',
    description:
      'Fuer jeden Reiseteilnehmer werden Name und Passnummer erfasst.',
    correct: 'loop',
    guards: ['[fuer jeden Teilnehmer]'],
    explanation:
      'Die Nachrichtengruppe wird fuer jeden Teilnehmer wiederholt. Das Schluesselwort „fuer jeden" zeigt eine Iteration an — also ein loop-Fragment.',
  },
  {
    id: 'f4',
    description:
      'Falls der Kunde Vielflieger ist, wird automatisch ein Upgrade geprueft.',
    correct: 'opt',
    guards: ['[Vielflieger-Status]'],
    explanation:
      'Es gibt nur eine Bedingung ohne Alternative. Wenn der Kunde kein Vielflieger ist, wird kein Upgrade geprueft — es passiert nichts. Das ist ein opt-Fragment.',
  },
]

// === Fragment Badge Colors ===

const fragmentColors: Record<FragmentType, { bg: string; border: string; text: string }> = {
  alt: { bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-700' },
  loop: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-700' },
  opt: { bg: 'bg-cyan-50', border: 'border-cyan-400', text: 'text-cyan-700' },
}

// === Main Component ===

export function FragmentWrapperExercise() {
  const { result, showHints, submit, reset, toggleHints } = useExercise<Record<string, FragmentType>>(exercise)
  const [answers, setAnswers] = useState<Record<string, FragmentType>>({})

  const allAnswered = scenarios.every((s) => answers[s.id] !== undefined)

  const handleSelect = (scenarioId: string, value: FragmentType) => {
    if (result) return
    setAnswers((prev) => ({ ...prev, [scenarioId]: value }))
  }

  const handleSubmit = () => {
    submit((): ValidationResult => {
      let score = 0
      const details = scenarios.map((s) => {
        const isCorrect = answers[s.id] === s.correct
        if (isCorrect) score++
        return {
          itemId: s.id,
          correct: isCorrect,
          feedback: isCorrect
            ? `Richtig: ${s.correct}`
            : `Falsch. Richtig waere: ${s.correct}`,
        }
      })

      return {
        correct: score === exercise.maxPoints,
        score,
        maxScore: exercise.maxPoints,
        feedback:
          score === exercise.maxPoints
            ? 'Perfekt! Du hast alle Fragmente korrekt zugeordnet.'
            : `${score} von ${exercise.maxPoints} Fragmenten richtig. Ueberlege bei den falschen, ob es eine Alternative, eine Option oder eine Schleife ist.`,
        details,
      }
    })
  }

  const handleReset = () => {
    reset()
    setAnswers({})
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light">{exercise.description}</p>
      </div>

      {/* Reisebuero context */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <span className="font-semibold">Szenario:</span> Ein Reisebuero verwaltet Buchungen fuer Fluege, Bahnfahrten und Mietwagen.
        In Sequenzdiagrammen werden bestimmte Nachrichtengruppen mit Fragmenten umrahmt.
        Waehle fuer jede Situation das passende Fragment.
      </div>

      {/* Fragment Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {fragmentOptions.map((opt) => {
          const colors = fragmentColors[opt.value]
          return (
            <div
              key={opt.value}
              className={`p-3 rounded-lg border-2 ${colors.bg} ${colors.border}`}
            >
              <div className="flex items-center gap-2">
                <span className={`font-mono font-bold text-lg ${colors.text}`}>{opt.label}</span>
              </div>
              <p className={`text-xs mt-1 ${colors.text}`}>{opt.description}</p>
            </div>
          )
        })}
      </div>

      {/* Scenarios */}
      <div className="space-y-4">
        {scenarios.map((scenario, index) => {
          const selected = answers[scenario.id]
          const detail = result?.details?.find((d) => d.itemId === scenario.id)
          const isCorrectAnswer = detail?.correct

          return (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`p-5 rounded-xl border-2 transition-colors ${
                result
                  ? isCorrectAnswer
                    ? 'border-green-400 bg-green-50'
                    : 'border-red-400 bg-red-50'
                  : 'border-border bg-white'
              }`}
            >
              <div className="space-y-3">
                {/* Scenario number and description */}
                <div className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <p className="text-text leading-relaxed">{scenario.description}</p>
                </div>

                {/* Fragment selection buttons */}
                <div className="flex gap-2 ml-10" role="radiogroup" aria-label={`Fragment fuer Szenario ${index + 1}`}>
                  {fragmentOptions.map((opt) => {
                    const isSelected = selected === opt.value
                    const isCorrectOption = result && opt.value === scenario.correct
                    const isWrongSelection = result && isSelected && !isCorrectAnswer
                    const colors = fragmentColors[opt.value]

                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelect(scenario.id, opt.value)}
                        disabled={!!result}
                        className={`px-4 py-2 rounded-lg border-2 font-mono font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                          result
                            ? isCorrectOption
                              ? `${colors.border} ${colors.bg} ${colors.text} ring-2 ring-green-400`
                              : isWrongSelection
                                ? 'border-red-400 bg-red-100 text-red-700'
                                : 'border-slate-200 bg-slate-50 text-slate-400'
                            : isSelected
                              ? `${colors.border} ${colors.bg} ${colors.text} shadow-sm`
                              : 'border-border bg-white text-text hover:border-slate-400'
                        } ${result ? 'cursor-default' : 'cursor-pointer'}`}
                        role="radio"
                        aria-checked={isSelected}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>

                {/* Guard conditions and explanation (shown after submit) */}
                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-10 space-y-2 overflow-hidden"
                    >
                      {/* Guard conditions */}
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-semibold text-text-light">Guard-Bedingungen:</span>
                        {scenario.guards.map((guard, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded text-xs font-mono ${
                              fragmentColors[scenario.correct].bg
                            } ${fragmentColors[scenario.correct].text}`}
                          >
                            {guard}
                          </span>
                        ))}
                      </div>

                      {/* Explanation */}
                      <p className={`text-sm ${isCorrectAnswer ? 'text-green-700' : 'text-red-700'}`}>
                        {scenario.explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Submit Button */}
      {!result && (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
