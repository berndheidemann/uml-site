import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ──

type NodeId =
  | 'root'
  | 'q1'
  | 'q1-ja'
  | 'q1-nein'
  | 'q2'
  | 'result-include-1'
  | 'result-extend'
  | 'result-include-2'

type AnswerKey = 'ja' | 'nein' | 'bedingung' | 'immer'

interface TreeNode {
  id: NodeId
  type: 'question' | 'answer' | 'result'
  text: string
  note?: string
  resultType?: 'include' | 'extend'
  children?: { key: AnswerKey; label: string; targetId: NodeId }[]
  parentAnswer?: string // which answer led here
}

const treeNodes: Record<NodeId, TreeNode> = {
  root: {
    id: 'root',
    type: 'question',
    text: 'Wie haengen die Use Cases zusammen?',
    children: [
      { key: 'ja', label: 'Weiter zur Analyse', targetId: 'q1' },
    ],
  },
  q1: {
    id: 'q1',
    type: 'question',
    text: 'Funktioniert der Basis-Use-Case auch OHNE den anderen Use Case?',
    children: [
      { key: 'ja', label: 'Ja', targetId: 'q1-ja' },
      { key: 'nein', label: 'Nein', targetId: 'q1-nein' },
    ],
  },
  'q1-ja': {
    id: 'q1-ja',
    type: 'answer',
    text: 'Der andere Use Case ist optional.',
    parentAnswer: 'Ja',
    children: [
      { key: 'ja', label: 'Weiter', targetId: 'q2' },
    ],
  },
  'q1-nein': {
    id: 'q1-nein',
    type: 'answer',
    text: 'Der andere Use Case ist PFLICHT.',
    parentAnswer: 'Nein',
    children: [
      { key: 'ja', label: 'Ergebnis anzeigen', targetId: 'result-include-1' },
    ],
  },
  q2: {
    id: 'q2',
    type: 'question',
    text: 'Wird der optionale Use Case immer oder nur unter einer Bedingung ausgefuehrt?',
    children: [
      { key: 'bedingung', label: 'Nur unter Bedingung', targetId: 'result-extend' },
      { key: 'immer', label: 'Immer (wenn Basis-UC aktiv)', targetId: 'result-include-2' },
    ],
  },
  'result-include-1': {
    id: 'result-include-1',
    type: 'result',
    text: '<<include>>',
    note: 'Der eingebundene Use Case wird IMMER ausgefuehrt und ist zwingend notwendig.',
    resultType: 'include',
  },
  'result-extend': {
    id: 'result-extend',
    type: 'result',
    text: '<<extend>>',
    note: 'Extension Point und Condition angeben! Der erweiternde Use Case ist optional und wird nur unter bestimmten Bedingungen ausgefuehrt.',
    resultType: 'extend',
  },
  'result-include-2': {
    id: 'result-include-2',
    type: 'result',
    text: 'Dann ist es doch ein <<include>>!',
    note: 'Wenn der andere Use Case immer ausgefuehrt wird, handelt es sich um eine Pflichtbeziehung -- also <<include>>.',
    resultType: 'include',
  },
}

// The path through the tree is a sequence of node IDs
function getInitialPath(): NodeId[] {
  return ['root']
}

// ── Quiz data ──

interface QuizExample {
  id: number
  baseUC: string
  targetUC: string
  correct: 'include' | 'extend'
  explanationCorrect: string
  explanationWrong: string
}

const quizExamples: QuizExample[] = [
  {
    id: 1,
    baseUC: 'Produkt bestellen',
    targetUC: 'Anmelden',
    correct: 'include',
    explanationCorrect:
      'Richtig! Man muss immer angemeldet sein, um bestellen zu koennen. "Anmelden" ist eine Pflicht-Vorbedingung.',
    explanationWrong:
      'Leider falsch. "Anmelden" ist keine optionale Erweiterung, sondern eine Pflicht-Vorbedingung fuer jede Bestellung. Daher: <<include>>.',
  },
  {
    id: 2,
    baseUC: 'Produkt bestellen',
    targetUC: 'Rabatt anwenden',
    correct: 'extend',
    explanationCorrect:
      'Richtig! Ein Rabatt wird nur angewendet, wenn ein Gutschein vorhanden ist -- das ist eine optionale Erweiterung unter einer Bedingung.',
    explanationWrong:
      'Leider falsch. "Rabatt anwenden" passiert nur, wenn ein Gutschein vorhanden ist. Es ist optional und bedingt -- also <<extend>>.',
  },
  {
    id: 3,
    baseUC: 'Produkt bestellen',
    targetUC: 'Zahlung durchfuehren',
    correct: 'include',
    explanationCorrect:
      'Richtig! Ohne Zahlung kann keine Bestellung abgeschlossen werden. Die Zahlung ist ein Pflichtbestandteil.',
    explanationWrong:
      'Leider falsch. Eine Bestellung ohne Zahlung ist nicht moeglich -- "Zahlung durchfuehren" ist eine zwingende Teilfunktion. Daher: <<include>>.',
  },
]

// ── Sub-components ──

function ArrowDown({ color }: { color: string }) {
  return (
    <div className="flex justify-center py-1">
      <svg width="20" height="28" viewBox="0 0 20 28" aria-hidden="true">
        <line x1="10" y1="0" x2="10" y2="20" stroke={color} strokeWidth={2} />
        <polygon points="4,18 10,28 16,18" fill={color} />
      </svg>
    </div>
  )
}

function TreeNodeBox({
  node,
  isActive,
  onClickAnswer,
}: {
  node: TreeNode
  isActive: boolean
  onClickAnswer?: (key: AnswerKey, targetId: NodeId) => void
}) {
  const isResult = node.type === 'result'
  const isQuestion = node.type === 'question'

  let bgColor = 'bg-white'
  let borderColor = 'border-border'
  let textColor = 'text-text'

  if (isResult && node.resultType === 'include') {
    bgColor = 'bg-green-50'
    borderColor = 'border-green-400'
    textColor = 'text-green-800'
  } else if (isResult && node.resultType === 'extend') {
    bgColor = 'bg-blue-50'
    borderColor = 'border-blue-400'
    textColor = 'text-blue-800'
  } else if (isQuestion && isActive) {
    bgColor = 'bg-amber-50'
    borderColor = 'border-amber-400'
  } else if (node.type === 'answer') {
    bgColor = 'bg-slate-50'
    borderColor = 'border-slate-300'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="overflow-hidden"
    >
      <div
        className={`rounded-xl border-2 p-4 ${bgColor} ${borderColor} transition-all`}
        role={isActive && node.children ? 'group' : undefined}
        aria-label={isActive ? 'Aktuelle Frage' : undefined}
      >
        {/* Node type badge */}
        <div className="flex items-center gap-2 mb-2">
          {isQuestion && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-300">
              Frage
            </span>
          )}
          {node.type === 'answer' && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 border border-slate-300">
              Zwischenergebnis
            </span>
          )}
          {isResult && (
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                node.resultType === 'include'
                  ? 'bg-green-100 text-green-700 border-green-300'
                  : 'bg-blue-100 text-blue-700 border-blue-300'
              }`}
            >
              Ergebnis
            </span>
          )}
          {isActive && !isResult && (
            <span className="ml-auto flex items-center gap-1 text-[10px] text-amber-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Aktiv
            </span>
          )}
        </div>

        {/* Main text */}
        <p className={`text-sm font-semibold ${textColor} leading-relaxed`}>
          {isResult ? (
            <span className="text-lg">{node.text}</span>
          ) : (
            node.text
          )}
        </p>

        {/* Note for results */}
        {node.note && (
          <p className="mt-2 text-xs text-text-light leading-relaxed">
            {node.note}
          </p>
        )}

        {/* Answer buttons */}
        {isActive && node.children && (
          <div className="flex flex-wrap gap-2 mt-4">
            {node.children.map((child) => (
              <button
                key={child.key}
                onClick={() => onClickAnswer?.(child.key, child.targetId)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-border
                           hover:bg-amber-50 hover:border-amber-400 hover:text-amber-800
                           focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2
                           transition-colors cursor-pointer"
              >
                {child.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function QuizExampleCard({ example }: { example: QuizExample }) {
  const [answer, setAnswer] = useState<'include' | 'extend' | null>(null)

  const isCorrect = answer === example.correct
  const hasAnswered = answer !== null

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      {/* Scenario */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="px-2 py-1 rounded bg-slate-100 text-sm font-mono font-semibold text-text">
          {example.baseUC}
        </span>
        <svg width="24" height="12" viewBox="0 0 24 12" aria-hidden="true">
          <line x1="0" y1="6" x2="16" y2="6" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 2" />
          <polygon points="24,6 16,2 16,10" fill="#64748b" />
        </svg>
        <span className="px-2 py-1 rounded bg-slate-100 text-sm font-mono font-semibold text-text">
          {example.targetUC}
        </span>
      </div>

      {/* Question */}
      <p className="text-sm text-text-light mb-3">
        Welche Beziehung besteht hier?
      </p>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => !hasAnswered && setAnswer('include')}
          disabled={hasAnswered}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold border-2 transition-all cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400
            ${
              hasAnswered && answer === 'include' && isCorrect
                ? 'bg-green-100 border-green-500 text-green-800'
                : hasAnswered && answer === 'include' && !isCorrect
                  ? 'bg-red-100 border-red-400 text-red-700'
                  : hasAnswered && example.correct === 'include'
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : hasAnswered
                      ? 'bg-slate-50 border-slate-200 text-slate-400'
                      : 'bg-white border-green-300 text-green-700 hover:bg-green-50'
            }`}
        >
          &laquo;include&raquo;
        </button>
        <button
          onClick={() => !hasAnswered && setAnswer('extend')}
          disabled={hasAnswered}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold border-2 transition-all cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400
            ${
              hasAnswered && answer === 'extend' && isCorrect
                ? 'bg-green-100 border-green-500 text-green-800'
                : hasAnswered && answer === 'extend' && !isCorrect
                  ? 'bg-red-100 border-red-400 text-red-700'
                  : hasAnswered && example.correct === 'extend'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : hasAnswered
                      ? 'bg-slate-50 border-slate-200 text-slate-400'
                      : 'bg-white border-blue-300 text-blue-700 hover:bg-blue-50'
            }`}
        >
          &laquo;extend&raquo;
        </button>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {hasAnswered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className={`mt-3 p-3 rounded-lg text-xs leading-relaxed flex items-start gap-2 ${
                isCorrect
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {/* Icon */}
              <span className="flex-shrink-0 mt-0.5">
                {isCorrect ? (
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </span>
              <span>{isCorrect ? example.explanationCorrect : example.explanationWrong}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main Component ──

export function IncludeExtendDecisionTree() {
  const [path, setPath] = useState<NodeId[]>(getInitialPath)
  const [quizKey, setQuizKey] = useState(0)

  const activeNodeId = path[path.length - 1]
  const activeNode = treeNodes[activeNodeId]
  const isFinished = activeNode.type === 'result'

  function handleAnswer(_key: AnswerKey, targetId: NodeId) {
    setPath((prev) => [...prev, targetId])
  }

  function handleReset() {
    setPath(getInitialPath())
    setQuizKey((k) => k + 1)
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-text mb-2">
          Entscheidungsbaum: &laquo;include&raquo; oder &laquo;extend&raquo;?
        </h3>
        <p className="text-text-light text-sm">
          Klicke dich Schritt fuer Schritt durch den Entscheidungsbaum, um herauszufinden,
          ob eine Beziehung zwischen zwei Use Cases ein &laquo;include&raquo; oder
          &laquo;extend&raquo; ist.
        </p>
      </div>

      {/* Decision Tree */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="max-w-xl mx-auto space-y-0">
          {path.map((nodeId, index) => {
            const node = treeNodes[nodeId]
            const isLast = index === path.length - 1
            const arrowColor =
              node.type === 'result'
                ? node.resultType === 'include'
                  ? '#16a34a'
                  : '#2563eb'
                : '#d97706'

            return (
              <div key={`${nodeId}-${index}`}>
                {index > 0 && <ArrowDown color={arrowColor} />}
                <TreeNodeBox
                  node={node}
                  isActive={isLast && !isFinished}
                  onClickAnswer={isLast ? handleAnswer : undefined}
                />
              </div>
            )
          })}

          {/* If finished show the final result arrow */}
          {isFinished && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="pt-4"
            >
              {/* Summary box */}
              <div
                className={`rounded-xl border-2 p-4 text-center ${
                  activeNode.resultType === 'include'
                    ? 'bg-green-50 border-green-400'
                    : 'bg-blue-50 border-blue-400'
                }`}
              >
                <p className="text-xs text-text-light mb-1">Zusammenfassung</p>
                <p
                  className={`text-lg font-bold ${
                    activeNode.resultType === 'include' ? 'text-green-700' : 'text-blue-700'
                  }`}
                >
                  {activeNode.resultType === 'include'
                    ? 'Die Beziehung ist ein <<include>>'
                    : 'Die Beziehung ist ein <<extend>>'}
                </p>
                <div className="flex justify-center gap-3 mt-2 text-xs text-text-light">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-green-400 inline-block" />
                    include = Pflicht
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-blue-400 inline-block" />
                    extend = Optional + Bedingung
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Reset button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleReset}
            className="px-5 py-2 rounded-lg text-sm font-medium border border-border bg-white
                       text-text hover:bg-surface-dark hover:border-slate-400
                       focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                       transition-colors cursor-pointer"
          >
            Erneut starten
          </button>
        </div>
      </div>

      {/* Quick Quiz Section */}
      <div>
        <h4 className="text-lg font-bold text-text mb-1">
          Teste dein Wissen
        </h4>
        <p className="text-text-light text-sm mb-4">
          Bestimme fuer jedes Beispiel aus dem TechStore-Szenario, ob es sich um
          &laquo;include&raquo; oder &laquo;extend&raquo; handelt.
        </p>

        <div key={quizKey} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quizExamples.map((example) => (
            <QuizExampleCard key={example.id} example={example} />
          ))}
        </div>
      </div>

      {/* Summary info box */}
      <div className="rounded-xl border border-border bg-white p-5">
        <h4 className="font-bold text-text mb-3">Merkregel</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="font-bold text-green-800 mb-1">&laquo;include&raquo;</p>
            <ul className="text-xs text-green-700 space-y-1">
              <li>Der eingebundene UC wird <strong>immer</strong> ausgefuehrt</li>
              <li>Basis-UC funktioniert <strong>nicht ohne</strong> den anderen</li>
              <li>Pflichtbestandteil</li>
              <li>Pfeilrichtung: Basis → eingebundener UC</li>
            </ul>
          </div>
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="font-bold text-blue-800 mb-1">&laquo;extend&raquo;</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>Der erweiternde UC wird <strong>nur unter Bedingung</strong> ausgefuehrt</li>
              <li>Basis-UC funktioniert <strong>auch ohne</strong> den anderen</li>
              <li>Optionale Erweiterung</li>
              <li>Pfeilrichtung: erweiternder UC → Basis-UC</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
