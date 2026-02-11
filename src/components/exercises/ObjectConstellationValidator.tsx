import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExerciseFeedback } from '../common/ExerciseFeedback.tsx'
import { useExercise } from '../../hooks/useExercise.ts'
import type { ExerciseBase, ValidationResult } from '../../types/index.ts'

// === Embedded Exercise Data ===

const exercise: ExerciseBase = {
  id: 'kd-constellation-01',
  version: 2,
  title: 'Objekt-Konstellation-Validator',
  description: 'Pruefe, ob die gegebenen Objekt-Konstellationen mit dem Klassendiagramm eines Sportvereins vereinbar sind.',
  diagramType: 'klassendiagramm',
  exerciseType: 'custom',
  level: 3,
  maxPoints: 5,
  hints: [
    'Achte genau auf die Multiplizitaeten an beiden Enden jeder Assoziation.',
    'Komposition (gefuellte Raute) bedeutet: das Teil kann nicht ohne das Ganze existieren.',
    '"0..*" bedeutet: null oder beliebig viele Objekte sind erlaubt. "1..*" erfordert mindestens eines.',
  ],
}

interface Scenario {
  id: string
  description: string
  correct: 'erlaubt' | 'nicht-erlaubt'
  explanation: string
  rule: string
}

const scenarios: Scenario[] = [
  {
    id: 's1',
    description:
      'Verein "FC Adler" hat 3 Mannschaften (A-Jugend, B-Jugend, Herren). Mannschaft "Herren" hat 11 Spieler und 1 Trainer.',
    correct: 'erlaubt',
    explanation:
      'Alle Multiplizitaeten sind erfuellt: Der Verein hat 1..* Mannschaften (hier 3), die Mannschaft hat 0..* Spieler (hier 11), und die Mannschaft hat 0..1 Trainer (hier 1).',
    rule: 'Verein "1" *-- "1..*" Mannschaft, Mannschaft "1" o-- "0..*" Spieler, Mannschaft "1" -- "0..1" Trainer',
  },
  {
    id: 's2',
    description: 'Mannschaft "A-Jugend" hat 0 Spieler.',
    correct: 'erlaubt',
    explanation:
      'Die Multiplizitaet auf der Spieler-Seite ist "0..*". Das bedeutet, eine Mannschaft darf null oder beliebig viele Spieler haben. Null ist also erlaubt.',
    rule: 'Mannschaft "1" o-- "0..*" Spieler → 0 Spieler sind erlaubt',
  },
  {
    id: 's3',
    description: 'Eine Mannschaft hat keinen Trainer zugewiesen.',
    correct: 'erlaubt',
    explanation:
      'Die Multiplizitaet auf der Trainer-Seite ist "0..1". Das bedeutet, eine Mannschaft darf null oder einen Trainer haben. Kein Trainer ist also erlaubt.',
    rule: 'Mannschaft "1" -- "0..1" Trainer → 0 Trainer sind erlaubt',
  },
  {
    id: 's4',
    description: 'Ein Verein hat 0 Mannschaften.',
    correct: 'nicht-erlaubt',
    explanation:
      'Die Multiplizitaet auf der Mannschafts-Seite ist "1..*" (Komposition). Das bedeutet, ein Verein muss mindestens eine Mannschaft besitzen. Null Mannschaften ist nicht erlaubt.',
    rule: 'Verein "1" *-- "1..*" Mannschaft → Mindestens 1 Mannschaft erforderlich',
  },
  {
    id: 's5',
    description: 'Eine Mannschaft gehoert zu keinem Verein.',
    correct: 'nicht-erlaubt',
    explanation:
      'Die Beziehung zwischen Verein und Mannschaft ist eine Komposition mit Multiplizitaet "1" auf der Vereins-Seite. Jede Mannschaft muss genau einem Verein zugeordnet sein — sie kann nicht ohne Verein existieren.',
    rule: 'Verein "1" *-- "1..*" Mannschaft → Komposition: Mannschaft MUSS zu genau 1 Verein gehoeren',
  },
]

// === Class Diagram SVG Component ===

function ClassDiagram() {
  return (
    <div className="bg-white rounded-xl border border-border p-6 overflow-x-auto">
      <svg viewBox="0 0 780 200" className="w-full max-w-3xl mx-auto" role="img" aria-label="Klassendiagramm: Verein, Mannschaft, Spieler, Trainer">
        {/* Verein */}
        <rect x="10" y="50" width="150" height="80" fill="#f0f9ff" stroke="#2563eb" strokeWidth="2" rx="4" />
        <line x1="10" y1="82" x2="160" y2="82" stroke="#2563eb" strokeWidth="1" />
        <text x="85" y="72" textAnchor="middle" className="text-sm font-bold" fill="#1e3a5f" fontSize="14">Verein</text>
        <text x="85" y="105" textAnchor="middle" fill="#475569" fontSize="11">- name : String</text>
        <text x="85" y="122" textAnchor="middle" fill="#475569" fontSize="11">- gruendungsjahr : int</text>

        {/* Komposition Verein *-- Mannschaft */}
        <line x1="160" y1="90" x2="270" y2="90" stroke="#334155" strokeWidth="2" />
        {/* Filled diamond for composition */}
        <polygon points="160,90 170,84 180,90 170,96" fill="#334155" stroke="#334155" strokeWidth="1" />
        <text x="188" y="82" fill="#1e3a5f" fontSize="12" fontWeight="bold">1</text>
        <text x="238" y="82" fill="#1e3a5f" fontSize="12" fontWeight="bold">1..*</text>

        {/* Mannschaft */}
        <rect x="270" y="50" width="170" height="80" fill="#f0f9ff" stroke="#2563eb" strokeWidth="2" rx="4" />
        <line x1="270" y1="82" x2="440" y2="82" stroke="#2563eb" strokeWidth="1" />
        <text x="355" y="72" textAnchor="middle" className="text-sm font-bold" fill="#1e3a5f" fontSize="14">Mannschaft</text>
        <text x="355" y="105" textAnchor="middle" fill="#475569" fontSize="11">- name : String</text>
        <text x="355" y="122" textAnchor="middle" fill="#475569" fontSize="11">- liga : String</text>

        {/* Aggregation Mannschaft o-- Spieler */}
        <line x1="440" y1="90" x2="550" y2="90" stroke="#334155" strokeWidth="2" />
        {/* Open diamond for aggregation */}
        <polygon points="440,90 450,84 460,90 450,96" fill="white" stroke="#334155" strokeWidth="1.5" />
        <text x="468" y="82" fill="#1e3a5f" fontSize="12" fontWeight="bold">1</text>
        <text x="518" y="82" fill="#1e3a5f" fontSize="12" fontWeight="bold">0..*</text>

        {/* Spieler */}
        <rect x="550" y="50" width="140" height="80" fill="#f0f9ff" stroke="#2563eb" strokeWidth="2" rx="4" />
        <line x1="550" y1="82" x2="690" y2="82" stroke="#2563eb" strokeWidth="1" />
        <text x="620" y="72" textAnchor="middle" className="text-sm font-bold" fill="#1e3a5f" fontSize="14">Spieler</text>
        <text x="620" y="105" textAnchor="middle" fill="#475569" fontSize="11">- name : String</text>
        <text x="620" y="122" textAnchor="middle" fill="#475569" fontSize="11">- rueckennummer : int</text>

        {/* Assoziation Mannschaft -- Trainer */}
        <line x1="355" y1="130" x2="355" y2="170" stroke="#334155" strokeWidth="2" />
        <text x="365" y="145" fill="#1e3a5f" fontSize="12" fontWeight="bold">1</text>
        <text x="365" y="168" fill="#1e3a5f" fontSize="12" fontWeight="bold">0..1</text>

        {/* Trainer */}
        <rect x="280" y="170" width="150" height="30" fill="#f0f9ff" stroke="#2563eb" strokeWidth="2" rx="4" />
        <text x="355" y="190" textAnchor="middle" className="text-sm font-bold" fill="#1e3a5f" fontSize="14">Trainer</text>
      </svg>
    </div>
  )
}

// === Main Component ===

type Answer = 'erlaubt' | 'nicht-erlaubt'
type Answers = Record<string, Answer>

export function ObjectConstellationValidator() {
  const { result, showHints, submit, reset, toggleHints } = useExercise<Answers>(exercise)
  const [answers, setAnswers] = useState<Answers>({})

  const allAnswered = scenarios.every((s) => answers[s.id] !== undefined)

  const handleSelect = (scenarioId: string, value: Answer) => {
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
            ? 'Richtig!'
            : `Falsch. Die Konstellation ist ${s.correct === 'erlaubt' ? 'erlaubt' : 'nicht erlaubt'}.`,
        }
      })

      return {
        correct: score === exercise.maxPoints,
        score,
        maxScore: exercise.maxPoints,
        feedback:
          score === exercise.maxPoints
            ? 'Perfekt! Du hast alle Konstellationen korrekt bewertet.'
            : `Du hast ${score} von ${exercise.maxPoints} Konstellationen richtig bewertet. Pruefe die Multiplizitaeten nochmals.`,
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

      {/* Class Diagram */}
      <div>
        <p className="text-sm font-semibold text-text mb-2">Klassendiagramm (Sportverein):</p>
        <ClassDiagram />
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-text-light">
        <span className="flex items-center gap-1">
          <svg width="20" height="12" aria-hidden="true"><line x1="0" y1="6" x2="20" y2="6" stroke="#334155" strokeWidth="2" /></svg>
          Assoziation
        </span>
        <span className="flex items-center gap-1">
          <svg width="20" height="12" aria-hidden="true"><polygon points="0,6 8,2 16,6 8,10" fill="#334155" /><line x1="16" y1="6" x2="20" y2="6" stroke="#334155" strokeWidth="2" /></svg>
          Komposition
        </span>
        <span className="flex items-center gap-1">
          <svg width="20" height="12" aria-hidden="true"><polygon points="0,6 8,2 16,6 8,10" fill="white" stroke="#334155" strokeWidth="1" /><line x1="16" y1="6" x2="20" y2="6" stroke="#334155" strokeWidth="2" /></svg>
          Aggregation
        </span>
      </div>

      {/* Scenarios */}
      <div className="space-y-4">
        <p className="font-semibold text-text">Sind die folgenden Objekt-Konstellationen gueltig?</p>

        {scenarios.map((scenario, index) => {
          const selected = answers[scenario.id]
          const detail = result?.details?.find((d) => d.itemId === scenario.id)

          return (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-xl border-2 transition-colors ${
                result
                  ? detail?.correct
                    ? 'border-green-400 bg-green-50'
                    : 'border-red-400 bg-red-50'
                  : 'border-border bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <div className="flex-1 space-y-3">
                  <p className="text-text">{scenario.description}</p>

                  {/* Buttons */}
                  <div className="flex gap-2" role="radiogroup" aria-label={`Bewertung Szenario ${index + 1}`}>
                    <button
                      onClick={() => handleSelect(scenario.id, 'erlaubt')}
                      disabled={!!result}
                      className={`px-4 py-2 text-sm rounded-lg border-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        selected === 'erlaubt'
                          ? 'border-primary bg-primary text-white'
                          : 'border-border bg-white text-text hover:border-primary/50'
                      } ${result ? 'cursor-default' : ''}`}
                      role="radio"
                      aria-checked={selected === 'erlaubt'}
                    >
                      Erlaubt
                    </button>
                    <button
                      onClick={() => handleSelect(scenario.id, 'nicht-erlaubt')}
                      disabled={!!result}
                      className={`px-4 py-2 text-sm rounded-lg border-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        selected === 'nicht-erlaubt'
                          ? 'border-primary bg-primary text-white'
                          : 'border-border bg-white text-text hover:border-primary/50'
                      } ${result ? 'cursor-default' : ''}`}
                      role="radio"
                      aria-checked={selected === 'nicht-erlaubt'}
                    >
                      Nicht erlaubt
                    </button>
                  </div>

                  {/* Explanation after submit */}
                  <AnimatePresence>
                    {result && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm space-y-1 overflow-hidden"
                      >
                        <p className={detail?.correct ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                          {detail?.correct ? 'Korrekt!' : 'Leider falsch.'}
                        </p>
                        <p className="text-text-light">{scenario.explanation}</p>
                        <p className="text-xs text-text-light/70 font-mono">{scenario.rule}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
