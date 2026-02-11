import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExerciseFeedback } from '../common/ExerciseFeedback.tsx'
import { useExercise } from '../../hooks/useExercise.ts'
import type { ExerciseBase, ValidationResult } from '../../types/index.ts'

// --- Embedded exercise data ---

const exercise: ExerciseBase = {
  id: 'ad-guard-check-01',
  version: 3,
  title: 'Guard-Vollstaendigkeits-Pruefer',
  description:
    'Pruefe, ob die Guards an den Entscheidungsknoten fuer den Konzertticket-Verkauf vollstaendig und gegenseitig ausschliessend sind.',
  diagramType: 'aktivitaetsdiagramm',
  exerciseType: 'custom',
  level: 3,
  maxPoints: 6,
  hints: [
    'Guards muessen alle moeglichen Faelle abdecken (vollstaendig).',
    'Guards duerfen sich nicht ueberlappen (gegenseitig ausschliessend).',
    'Achte besonders auf die Grenzwerte und Gleichheitszeichen.',
  ],
}

type ProblemType = 'korrekt' | 'nicht-vollstaendig' | 'nicht-ausschliessend'

interface FixOption {
  id: string
  label: string
  isCorrect: boolean
}

interface GuardScenario {
  id: string
  title: string
  contextAction: string
  guards: { label: string; target: string }[]
  correctProblem: ProblemType
  problemExplanation: string
  fixOptions: FixOption[]
  detailedExplanation: string
}

const scenarios: GuardScenario[] = [
  {
    id: 's1',
    title: 'Szenario 1: Ticketpreis berechnen',
    contextAction: 'Ticketpreis berechnen',
    guards: [
      { label: '[Alter > 12]', target: 'Normalpreis' },
      { label: '[Alter < 12]', target: 'Kinderpreis' },
    ],
    correctProblem: 'nicht-vollstaendig',
    problemExplanation:
      'Der Fall Alter == 12 ist nicht abgedeckt. Beide Guards zusammen decken nicht alle moeglichen Werte ab.',
    fixOptions: [
      {
        id: 's1-fix1',
        label: 'Ersten Guard aendern zu [Alter >= 12]',
        isCorrect: true,
      },
      {
        id: 's1-fix2',
        label: 'Zweiten Guard aendern zu [Alter <= 12]',
        isCorrect: false, // Would create overlap
      },
      {
        id: 's1-fix3',
        label: '[Alter == 12] als dritten Zweig hinzufuegen',
        isCorrect: false, // Valid but not the simplest fix
      },
    ],
    detailedExplanation:
      'Bei den Guards [> 12] und [< 12] fehlt der Wert 12. Die einfachste Loesung ist, einen Guard zu [>= 12] oder [<= 12] zu aendern. Einen dritten Zweig hinzuzufuegen waere unnoetig komplex. Achtung: Beide Guards gleichzeitig mit Gleichheitszeichen zu versehen wuerde zu einer Ueberlappung fuehren.',
  },
  {
    id: 's2',
    title: 'Szenario 2: Einlass pruefen',
    contextAction: 'Einlass pruefen',
    guards: [
      { label: '[Alter >= 16]', target: 'Einlass' },
      { label: '[Alter <= 16]', target: 'Kein Einlass' },
    ],
    correctProblem: 'nicht-ausschliessend',
    problemExplanation:
      'Bei Alter == 16 sind BEIDE Guards erfuellt. Ein Entscheidungsknoten darf nur genau einen Ausgang haben.',
    fixOptions: [
      {
        id: 's2-fix1',
        label: 'Zweiten Guard aendern zu [Alter < 16]',
        isCorrect: true,
      },
      {
        id: 's2-fix2',
        label: 'Ersten Guard aendern zu [Alter >= 17]',
        isCorrect: false, // Changes semantics
      },
      {
        id: 's2-fix3',
        label: 'Beide Guards so lassen, aber Prioritaet festlegen',
        isCorrect: false, // Not valid UML
      },
    ],
    detailedExplanation:
      'Die Guards [>= 16] und [<= 16] ueberlappen sich bei Alter == 16. Im UML-Aktivitaetsdiagramm muss an einem Entscheidungsknoten immer genau ein Guard zutreffen. Die einfachste Loesung: den zweiten Guard zu [< 16] aendern. Prioritaeten an Entscheidungsknoten sind in UML nicht vorgesehen.',
  },
  {
    id: 's3',
    title: 'Szenario 3: Sitzplatz zuweisen',
    contextAction: 'Sitzplatz zuweisen',
    guards: [
      { label: '[Ticketnummer > 0]', target: 'Platz zuweisen' },
      { label: '[Ticketnummer == 0]', target: 'Stehplatz' },
    ],
    correctProblem: 'korrekt',
    problemExplanation:
      'Die Guards sind vollstaendig (jede moegliche Ticketnummer >= 0 ist abgedeckt) und gegenseitig ausschliessend (kein Wert erfuellt beide Guards gleichzeitig).',
    fixOptions: [],
    detailedExplanation:
      'Ticketnummer > 0 und Ticketnummer == 0 decken alle nicht-negativen Werte ab und ueberlappen sich nicht. Dies ist ein korrektes Guard-Paar fuer einen Entscheidungsknoten. Annahme: Die Ticketnummer ist nie negativ.',
  },
]

const problemOptions: { value: ProblemType; label: string }[] = [
  { value: 'korrekt', label: 'Korrekt' },
  { value: 'nicht-vollstaendig', label: 'Nicht vollstaendig' },
  { value: 'nicht-ausschliessend', label: 'Nicht gegenseitig ausschliessend' },
]

interface ScenarioAnswer {
  problem: ProblemType | null
  fix: string | null
}

type AllAnswers = Record<string, ScenarioAnswer>

// --- Decision Node SVG ---

function DecisionNodeSVG({
  contextAction,
  guards,
}: {
  contextAction: string
  guards: { label: string; target: string }[]
}) {
  const width = 440
  const height = 180

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-md" role="img" aria-label="Entscheidungsknoten">
      {/* Context action (rounded rect) */}
      <rect x="140" y="5" width="160" height="36" rx="10" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
      <text x="220" y="28" textAnchor="middle" fontSize="12" fill="#1e40af" fontWeight="bold">
        {contextAction}
      </text>

      {/* Arrow down to diamond */}
      <line x1="220" y1="41" x2="220" y2="62" stroke="#475569" strokeWidth="2" markerEnd="url(#gcArrow)" />

      {/* Diamond */}
      <polygon
        points="220,62 260,90 220,118 180,90"
        fill="#fef9c3"
        stroke="#ca8a04"
        strokeWidth="2"
      />

      {/* Arrow to right target */}
      <line x1="260" y1="90" x2="330" y2="90" stroke="#475569" strokeWidth="2" markerEnd="url(#gcArrow)" />
      <rect x="330" y="72" width="105" height="36" rx="10" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
      <text x="382" y="95" textAnchor="middle" fontSize="11" fill="#166534">
        {guards[0]?.target || ''}
      </text>
      {/* Guard label right */}
      <text x="295" y="80" textAnchor="middle" fontSize="10" fill="#6366f1" fontWeight="bold">
        {guards[0]?.label || ''}
      </text>

      {/* Arrow to bottom target */}
      <line x1="220" y1="118" x2="220" y2="140" stroke="#475569" strokeWidth="2" markerEnd="url(#gcArrow)" />
      <rect x="150" y="140" width="140" height="36" rx="10" fill="#fce7f3" stroke="#db2777" strokeWidth="1.5" />
      <text x="220" y="163" textAnchor="middle" fontSize="11" fill="#9d174d">
        {guards[1]?.target || ''}
      </text>
      {/* Guard label bottom */}
      <text x="260" y="135" fontSize="10" fill="#6366f1" fontWeight="bold">
        {guards[1]?.label || ''}
      </text>

      <defs>
        <marker id="gcArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#475569" />
        </marker>
      </defs>
    </svg>
  )
}

// --- Main Component ---

export function GuardCompletenessChecker() {
  const { result, showHints, submit, reset, toggleHints } = useExercise<AllAnswers>(exercise)
  const [answers, setAnswers] = useState<AllAnswers>(() => {
    const initial: AllAnswers = {}
    for (const s of scenarios) {
      initial[s.id] = { problem: null, fix: null }
    }
    return initial
  })
  const [showExplanations, setShowExplanations] = useState(false)

  const setProblem = (scenarioId: string, problem: ProblemType) => {
    if (result) return
    setAnswers((prev) => ({
      ...prev,
      [scenarioId]: { ...prev[scenarioId], problem, fix: null },
    }))
  }

  const setFix = (scenarioId: string, fixId: string) => {
    if (result) return
    setAnswers((prev) => ({
      ...prev,
      [scenarioId]: { ...prev[scenarioId], fix: fixId },
    }))
  }

  const handleSubmit = () => {
    submit((): ValidationResult => {
      let score = 0
      const details = []

      for (const scenario of scenarios) {
        const answer = answers[scenario.id]

        // Check problem identification (1 point per scenario)
        const problemCorrect = answer.problem === scenario.correctProblem
        if (problemCorrect) score++
        details.push({
          itemId: `${scenario.id}-problem`,
          correct: problemCorrect,
          feedback: problemCorrect
            ? `${scenario.title}: Problem korrekt erkannt.`
            : `${scenario.title}: Problem falsch eingeschaetzt. Korrekt waere "${
                problemOptions.find((o) => o.value === scenario.correctProblem)?.label
              }".`,
        })

        // Check fix if applicable (1 point per scenario that needs fix)
        if (scenario.fixOptions.length > 0) {
          const correctFix = scenario.fixOptions.find((f) => f.isCorrect)
          const fixCorrect = answer.fix === correctFix?.id
          if (fixCorrect) score++
          details.push({
            itemId: `${scenario.id}-fix`,
            correct: fixCorrect,
            feedback: fixCorrect
              ? `${scenario.title}: Korrekte Loesung gewaehlt.`
              : `${scenario.title}: ${answer.fix ? 'Falsche Loesung gewaehlt' : 'Keine Loesung ausgewaehlt'}. Korrekt waere: "${correctFix?.label}".`,
          })
        }
      }

      return {
        correct: score === exercise.maxPoints,
        score,
        maxScore: exercise.maxPoints,
        feedback:
          score === exercise.maxPoints
            ? 'Ausgezeichnet! Du hast alle Guard-Probleme korrekt identifiziert und die richtigen Loesungen gewaehlt.'
            : `${score} von ${exercise.maxPoints} Punkten. Achte besonders auf die Grenzwerte bei den Guards.`,
        details,
      }
    })
    setShowExplanations(true)
  }

  const handleReset = () => {
    reset()
    const initial: AllAnswers = {}
    for (const s of scenarios) {
      initial[s.id] = { problem: null, fix: null }
    }
    setAnswers(initial)
    setShowExplanations(false)
  }

  // Check if all scenarios have their required answers
  const allAnswered = scenarios.every((scenario) => {
    const answer = answers[scenario.id]
    if (!answer.problem) return false
    // If the user identified a problem, they need to select a fix (for scenarios that have fixes)
    if (answer.problem !== 'korrekt' && scenario.fixOptions.length > 0 && !answer.fix) {
      // Only require fix if the user's chosen problem type matches a fixable scenario
      // Actually, show fixes for any "wrong" answer to let them try
      return false
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light">{exercise.description}</p>
      </div>

      {/* Info box */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-800">
        <strong>Regeln fuer Guards an Entscheidungsknoten:</strong>
        <ul className="mt-2 ml-4 list-disc space-y-1">
          <li>
            <strong>Vollstaendig:</strong> Jeder moegliche Wert muss von mindestens einem Guard abgedeckt
            sein.
          </li>
          <li>
            <strong>Gegenseitig ausschliessend:</strong> Kein Wert darf gleichzeitig zwei Guards
            erfuellen.
          </li>
        </ul>
      </div>

      {/* Szenario-Kontext */}
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-900">
        <strong>Szenario: Konzertticket-Verkauf</strong>
        <p className="mt-2">
          Ein Online-Ticketshop verkauft Konzertkarten. Beim Kauf durchlaeuft der Prozess mehrere Entscheidungsknoten:
        </p>
        <ul className="mt-2 ml-4 list-disc space-y-1">
          <li><strong>Alter:</strong> Personen ab 12 Jahren zahlen den Normalpreis, unter 12 Jahren gilt der Kinderpreis.</li>
          <li><strong>Einlass:</strong> Ab 16 Jahren ist der Einlass erlaubt, darunter nicht.</li>
          <li><strong>Ticketnummer:</strong> Jedes Ticket hat eine fortlaufende Nummer (ab 1). Die Nummer 0 bedeutet &quot;kein gueltiges Ticket&quot; — also ein Stehplatz ohne feste Platznummer.</li>
        </ul>
      </div>

      {/* Scenarios */}
      {scenarios.map((scenario, idx) => {
        const answer = answers[scenario.id]
        const problemCorrect = result ? answer.problem === scenario.correctProblem : null
        const needsFix = answer.problem !== null && answer.problem !== 'korrekt' && scenario.fixOptions.length > 0

        return (
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
            className={`bg-white rounded-xl border-2 p-6 transition-colors ${
              result
                ? problemCorrect
                  ? 'border-green-200'
                  : 'border-red-200'
                : 'border-border'
            }`}
          >
            <h4 className="text-lg font-bold text-text mb-4">{scenario.title}</h4>

            {/* Decision node diagram */}
            <div className="flex justify-center mb-6 bg-slate-50 rounded-lg p-4">
              <DecisionNodeSVG
                contextAction={scenario.contextAction}
                guards={scenario.guards}
              />
            </div>

            {/* Problem identification */}
            <div className="mb-4">
              <p className="font-medium text-text mb-3">
                Wie bewertest du die Guards an diesem Entscheidungsknoten?
              </p>
              <div className="flex flex-wrap gap-2">
                {problemOptions.map((option) => {
                  const isSelected = answer.problem === option.value
                  const isCorrectOption = result && option.value === scenario.correctProblem

                  return (
                    <button
                      key={option.value}
                      onClick={() => setProblem(scenario.id, option.value)}
                      disabled={!!result}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                        isSelected
                          ? result
                            ? isCorrectOption
                              ? 'border-green-500 bg-green-50 text-green-800'
                              : 'border-red-500 bg-red-50 text-red-800'
                            : 'border-primary bg-primary/10 text-primary'
                          : result && isCorrectOption
                            ? 'border-green-400 bg-green-50 text-green-700'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                      } ${result ? 'cursor-default' : 'cursor-pointer'}`}
                      aria-pressed={isSelected}
                    >
                      {option.label}
                      {result && isCorrectOption && !isSelected && (
                        <span className="ml-1 text-green-600 text-xs">(korrekt)</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Fix selection (appears when user selects a non-correct problem) */}
            <AnimatePresence>
              {needsFix && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <p className="font-medium text-text mb-3">
                    Welche Korrektur wuerdest du vornehmen?
                  </p>
                  <div className="space-y-2">
                    {scenario.fixOptions.map((fix) => {
                      const isSelected = answer.fix === fix.id
                      const isCorrectFix = result && fix.isCorrect

                      return (
                        <button
                          key={fix.id}
                          onClick={() => setFix(scenario.id, fix.id)}
                          disabled={!!result}
                          className={`w-full text-left p-3 rounded-lg border-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                            isSelected
                              ? result
                                ? isCorrectFix
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-red-500 bg-red-50'
                                : 'border-primary bg-primary/10'
                              : result && isCorrectFix
                                ? 'border-green-400 bg-green-50'
                                : 'border-gray-200 bg-white hover:border-gray-400'
                          } ${result ? 'cursor-default' : 'cursor-pointer'}`}
                          aria-pressed={isSelected}
                        >
                          <div className="flex items-center gap-3">
                            {/* Radio visual */}
                            <div
                              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                isSelected
                                  ? 'border-primary bg-primary'
                                  : 'border-gray-300 bg-white'
                              }`}
                              aria-hidden="true"
                            >
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className="text-text">{fix.label}</span>
                            {result && isCorrectFix && !isSelected && (
                              <span className="ml-auto text-xs text-green-600 font-medium">
                                (korrekt)
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Explanation after submit */}
            <AnimatePresence>
              {showExplanations && result && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <p className="text-sm font-semibold text-text mb-1">Erklaerung:</p>
                  <p className="text-sm text-text-light mb-2">{scenario.problemExplanation}</p>
                  <p className="text-sm text-text-light">{scenario.detailedExplanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}

      {/* Summary knowledge box (shown after submit) */}
      <AnimatePresence>
        {showExplanations && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-5"
          >
            <h4 className="font-bold text-amber-800 mb-2">Zusammenfassung: Guards in Aktivitaetsdiagrammen</h4>
            <ul className="text-sm text-amber-700 space-y-2 ml-4 list-disc">
              <li>
                An jedem Entscheidungsknoten (Raute) muessen die ausgehenden Guards
                <strong> vollstaendig</strong> und <strong>gegenseitig ausschliessend</strong> sein.
              </li>
              <li>
                <strong>Vollstaendig</strong> bedeutet: Fuer jeden moeglichen Eingabewert gibt es
                mindestens einen Guard, der zutrifft.
              </li>
              <li>
                <strong>Gegenseitig ausschliessend</strong> bedeutet: Fuer keinen Eingabewert treffen
                zwei oder mehr Guards gleichzeitig zu.
              </li>
              <li>
                Typische Fehlerquelle: Grenzwerte bei Vergleichsoperatoren (&lt;, &gt;, &lt;=, &gt;=, ==).
              </li>
              <li>
                Alternativ kann ein <code className="bg-amber-100 px-1 rounded">[else]</code>-Guard verwendet werden, um
                alle nicht explizit abgedeckten Faelle aufzufangen.
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit / Feedback */}
      {!result && (
        <div className="flex gap-3 items-center">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Auswerten
          </button>
          {!allAnswered && (
            <span className="text-sm text-text-light">
              Beantworte alle Szenarien, bevor du auswertest.
            </span>
          )}
        </div>
      )}

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
