import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExerciseFeedback } from '../common/ExerciseFeedback.tsx'
import { useExercise } from '../../hooks/useExercise.ts'
import type { ExerciseBase, ValidationResult } from '../../types/index.ts'

// === Exercise Metadata ===

const exercise: ExerciseBase = {
  id: 'sd-codetrace-01',
  version: 6,
  title: 'Code-Trace: Vom Code zum Sequenzdiagramm',
  description:
    'Lies den Code und springe in die aufgerufenen Methoden. Identifiziere Nachrichten, Rueckantworten, asynchrone Aufrufe und kombinierte Fragmente (loop, alt).',
  diagramType: 'sequenzdiagramm',
  exerciseType: 'custom',
  level: 2,
  maxPoints: 9,
  hints: [
    'Der Sender ist das Objekt, das die Methode aufruft — hier immer "ReparaturService".',
    'Der Empfaenger steht VOR dem Punkt: bei diagnose.analysieren() ist "diagnose" (Typ: Diagnose) der Empfaenger.',
    'Rueckgabewerte erzeugen einen gestrichelten Rueckgabepfeil. Auch void-Methoden haben einen Rueckgabepfeil.',
    'Nur bei asynchronen Aufrufen (Fire & Forget) fehlt der Rueckgabepfeil.',
    'Eine for/while-Schleife wird als loop-Fragment dargestellt, if/else als alt-Fragment.',
  ],
}

// === Code Data ===

const MAIN_CODE = [
  'Annahme annahme = new Annahme();',
  'Diagnose diagnose = new Diagnose();',
  'Ersatzteile ersatzteile = new Ersatzteile();',
  'Benachrichtigung benachrichtigung = new Benachrichtigung();',
  '',
  'Auftrag auftrag = annahme.annehmen("iPhone 15");',
  '',
  'for (int versuch = 1; versuch <= 2; versuch++) {',
  '    Defekt defekt = diagnose.analysieren(auftrag);',
  '',
  '    if (defekt.istReparierbar()) {',
  '        Teile teile = ersatzteile.bestellen(defekt);',
  '        diagnose.reparieren(auftrag, teile);',
  '        annahme.abschliessen(auftrag);',
  '        break;',
  '    } else {',
  '        diagnose.neuKalibrieren();',
  '    }',
  '}',
  '',
  'benachrichtigung.smsVersenden(auftrag.getKunde());',
]

interface TargetMethod {
  fileName: string
  lines: string[]
  methodLine: number
  returnLine?: number
}

const TARGET: Record<string, TargetMethod> = {
  'annahme-annehmen': {
    fileName: 'Annahme.java',
    methodLine: 1,
    returnLine: 4,
    lines: [
      'class Annahme {',
      '  Auftrag annehmen(String geraet) {',
      '    Auftrag a = new Auftrag(geraet);',
      '    a.setStatus("angenommen");',
      '    return a;',
      '  }',
      '}',
    ],
  },
  'diagnose-analysieren': {
    fileName: 'Diagnose.java',
    methodLine: 1,
    returnLine: 3,
    lines: [
      'class Diagnose {',
      '  Defekt analysieren(Auftrag a) {',
      '    Defekt d = pruefeHardware(a);',
      '    return d;',
      '  }',
      '}',
    ],
  },
  'ersatzteile-bestellen': {
    fileName: 'Ersatzteile.java',
    methodLine: 1,
    returnLine: 3,
    lines: [
      'class Ersatzteile {',
      '  Teile bestellen(Defekt d) {',
      '    Teile t = lagerSuchen(d.getTyp());',
      '    return t;',
      '  }',
      '}',
    ],
  },
  'diagnose-reparieren': {
    fileName: 'Diagnose.java',
    methodLine: 1,
    lines: [
      'class Diagnose {',
      '  void reparieren(Auftrag a, Teile t) {',
      '    einbauen(t);',
      '    a.setStatus("repariert");',
      '  }',
      '}',
    ],
  },
  'annahme-abschliessen': {
    fileName: 'Annahme.java',
    methodLine: 1,
    lines: [
      'class Annahme {',
      '  void abschliessen(Auftrag a) {',
      '    a.setStatus("abgeschlossen");',
      '  }',
      '}',
    ],
  },
  'benachrichtigung-sms': {
    fileName: 'Benachrichtigung.java',
    methodLine: 1,
    lines: [
      'class Benachrichtigung {',
      '  void smsVersenden(Kunde k) {',
      '    // Asynchron: Fire & Forget',
      '    smsGateway.sende(k.getTelefon(),',
      '      "Ihr Geraet ist fertig!");',
      '  }',
      '}',
    ],
  },
  'diagnose-neukalibrieren': {
    fileName: 'Diagnose.java',
    methodLine: 1,
    lines: [
      'class Diagnose {',
      '  void neuKalibrieren() {',
      '    sensorenZuruecksetzen();',
      '    neueMesswerte();',
      '  }',
      '}',
    ],
  },
}

// === Questions ===

interface TraceQ {
  codeLine: number
  type: 'forward' | 'return' | 'async' | 'fragment'
  prompt: string
  targetId: string
  correctAnswer: string
  options: { id: string; label: string; explanation: string }[]
}

const QUESTIONS: TraceQ[] = [
  {
    codeLine: 5,
    type: 'forward',
    targetId: 'annahme-annehmen',
    prompt: 'Welche Nachricht entsteht aus dieser Code-Zeile?',
    correctAnswer: 'a',
    options: [
      { id: 'a', label: 'ReparaturService \u2192 Annahme : annehmen("iPhone 15")', explanation: 'Richtig! ReparaturService ruft annehmen() auf dem Annahme-Objekt auf.' },
      { id: 'b', label: 'Annahme \u2192 ReparaturService : annehmen("iPhone 15")', explanation: 'Falsch \u2014 Sender und Empfaenger sind vertauscht.' },
      { id: 'c', label: 'ReparaturService \u2192 Diagnose : annehmen("iPhone 15")', explanation: 'Falsch \u2014 Das Objekt annahme ist vom Typ Annahme, nicht Diagnose.' },
    ],
  },
  {
    codeLine: 5,
    type: 'return',
    targetId: 'annahme-annehmen',
    prompt: 'Schau dir die return-Anweisung in der Methode an. Welcher Rueckgabepfeil entsteht?',
    correctAnswer: 'a',
    options: [
      { id: 'a', label: 'Annahme - - -> ReparaturService : auftrag', explanation: 'Richtig! Gestrichelter Pfeil vom Empfaenger zurueck zum Sender.' },
      { id: 'b', label: 'ReparaturService - - -> Annahme : auftrag', explanation: 'Falsch \u2014 Rueckgabepfeil geht vom Empfaenger zum Sender.' },
      { id: 'c', label: 'Kein Rueckgabepfeil noetig', explanation: 'Falsch \u2014 Die Methode gibt einen Wert zurueck (Auftrag).' },
    ],
  },
  {
    codeLine: 7,
    type: 'fragment',
    targetId: '',
    prompt: 'Welches UML-Fragment bildet die for-Schleife (Zeile 8) ab?',
    correctAnswer: 'b',
    options: [
      { id: 'a', label: 'alt \u2014 Alternatives Fragment', explanation: 'Falsch \u2014 alt steht fuer Verzweigungen (if/else), nicht fuer Schleifen.' },
      { id: 'b', label: 'loop [versuch <= 2] \u2014 Wiederholungsfragment', explanation: 'Richtig! Eine for- oder while-Schleife wird im Sequenzdiagramm als loop-Fragment dargestellt. Die Guard-Bedingung kommt in eckige Klammern.' },
      { id: 'c', label: 'opt \u2014 Optionales Fragment', explanation: 'Falsch \u2014 opt steht fuer optionale Ausfuehrung (if ohne else), nicht fuer Schleifen.' },
    ],
  },
  {
    codeLine: 8,
    type: 'forward',
    targetId: 'diagnose-analysieren',
    prompt: 'Welche Nachricht entsteht innerhalb des loop-Fragments? (Rueckgabepfeil wird automatisch ergaenzt.)',
    correctAnswer: 'a',
    options: [
      { id: 'a', label: 'ReparaturService \u2192 Diagnose : analysieren(auftrag)', explanation: 'Richtig! diagnose.analysieren() sendet von ReparaturService an Diagnose.' },
      { id: 'b', label: 'Annahme \u2192 Diagnose : analysieren(auftrag)', explanation: 'Falsch \u2014 Der Aufrufer ist ReparaturService.' },
      { id: 'c', label: 'ReparaturService \u2192 Annahme : analysieren(auftrag)', explanation: 'Falsch \u2014 analysieren() wird auf diagnose aufgerufen, nicht auf annahme.' },
    ],
  },
  {
    codeLine: 10,
    type: 'fragment',
    targetId: '',
    prompt: 'Welches UML-Fragment bildet die if/else-Verzweigung (Zeile 11) ab?',
    correctAnswer: 'a',
    options: [
      { id: 'a', label: 'alt [defekt.istReparierbar()] / [else]', explanation: 'Richtig! if/else wird als alt-Fragment modelliert. Der if-Zweig bekommt die Guard-Bedingung, der else-Zweig wird mit [else] markiert.' },
      { id: 'b', label: 'opt [defekt.istReparierbar()]', explanation: 'Falsch \u2014 opt hat keinen else-Zweig. Da hier ein else existiert, ist alt korrekt.' },
      { id: 'c', label: 'loop [defekt.istReparierbar()]', explanation: 'Falsch \u2014 loop ist fuer Wiederholungen, nicht fuer Verzweigungen.' },
    ],
  },
  {
    codeLine: 11,
    type: 'forward',
    targetId: 'ersatzteile-bestellen',
    prompt: 'Welche Nachricht entsteht im if-Zweig des alt-Fragments? (Rueckgabepfeil wird automatisch ergaenzt.)',
    correctAnswer: 'a',
    options: [
      { id: 'a', label: 'ReparaturService \u2192 Ersatzteile : bestellen(defekt)', explanation: 'Richtig! ersatzteile.bestellen() sendet von ReparaturService an Ersatzteile.' },
      { id: 'b', label: 'Diagnose \u2192 Ersatzteile : bestellen(defekt)', explanation: 'Falsch \u2014 ReparaturService ist der Aufrufer.' },
      { id: 'c', label: 'ReparaturService \u2192 Diagnose : bestellen(defekt)', explanation: 'Falsch \u2014 bestellen() wird auf ersatzteile aufgerufen.' },
    ],
  },
  {
    codeLine: 12,
    type: 'forward',
    targetId: 'diagnose-reparieren',
    prompt: 'Welche Nachricht entsteht aus dieser Code-Zeile?',
    correctAnswer: 'a',
    options: [
      { id: 'a', label: 'ReparaturService \u2192 Diagnose : reparieren(auftrag, teile)', explanation: 'Richtig! Auch bei void-Methoden entsteht ein gestrichelter Rueckgabepfeil \u2014 die Kontrolle kehrt zum Aufrufer zurueck.' },
      { id: 'b', label: 'Ersatzteile \u2192 Diagnose : reparieren(auftrag, teile)', explanation: 'Falsch \u2014 ReparaturService ruft die Methode auf.' },
      { id: 'c', label: 'ReparaturService \u2192 Ersatzteile : reparieren(auftrag, teile)', explanation: 'Falsch \u2014 reparieren() wird auf diagnose aufgerufen.' },
    ],
  },
  {
    codeLine: 16,
    type: 'forward',
    targetId: 'diagnose-neukalibrieren',
    prompt: 'Im else-Zweig: Welche Nachricht entsteht?',
    correctAnswer: 'b',
    options: [
      { id: 'a', label: 'ReparaturService \u2192 Annahme : neuKalibrieren()', explanation: 'Falsch \u2014 neuKalibrieren() wird auf diagnose aufgerufen.' },
      { id: 'b', label: 'ReparaturService \u2192 Diagnose : neuKalibrieren()', explanation: 'Richtig! diagnose.neuKalibrieren() \u2014 auch dieser Aufruf liegt im else-Zweig des alt-Fragments.' },
      { id: 'c', label: 'Diagnose \u2192 Diagnose : neuKalibrieren()', explanation: 'Falsch \u2014 ReparaturService ist der Aufrufer, nicht Diagnose selbst.' },
    ],
  },
  {
    codeLine: 20,
    type: 'async',
    targetId: 'benachrichtigung-sms',
    prompt: 'Schau dir den Kommentar im Ziel-Code an: Fire & Forget. Welche UML-Nachricht entsteht?',
    correctAnswer: 'b',
    options: [
      { id: 'a', label: 'ReparaturService \u2192 Benachrichtigung : smsVersenden(kunde)  [synchron]', explanation: 'Falsch \u2014 Asynchrone Nachrichten haben einen offenen Pfeil.' },
      { id: 'b', label: 'ReparaturService \u21A0 Benachrichtigung : smsVersenden(kunde)  [asynchron]', explanation: 'Richtig! Asynchrone Nachrichten werden mit offenem Pfeil dargestellt.' },
      { id: 'c', label: 'Benachrichtigung \u21A0 ReparaturService : smsVersenden(kunde)  [asynchron]', explanation: 'Falsch \u2014 Die Richtung ist verkehrt.' },
    ],
  },
]

// === Diagram Data ===

const LIFELINES = [
  { id: 'main', label: ':ReparaturService', color: '#6b7280' },
  { id: 'annahme', label: ':Annahme', color: '#3b82f6' },
  { id: 'diagnose', label: ':Diagnose', color: '#f59e0b' },
  { id: 'ersatzteile', label: ':Ersatzteile', color: '#10b981' },
  { id: 'benachrichtigung', label: ':Benachr.', color: '#8b5cf6' },
]

interface DArrow {
  from: string
  to: string
  type: 'sync' | 'return' | 'async'
  label: string
}

// Arrows revealed after each question is answered
const ARROW_SETS: DArrow[][] = [
  // Q1: annehmen forward
  [{ from: 'main', to: 'annahme', type: 'sync', label: 'annehmen(...)' }],
  // Q2: annehmen return
  [{ from: 'annahme', to: 'main', type: 'return', label: 'auftrag' }],
  // Q3: loop fragment (no arrows, just fragment box)
  [],
  // Q4: analysieren forward + auto-return
  [
    { from: 'main', to: 'diagnose', type: 'sync', label: 'analysieren(...)' },
    { from: 'diagnose', to: 'main', type: 'return', label: 'defekt' },
  ],
  // Q5: alt fragment (no arrows, just fragment box)
  [],
  // Q6: bestellen forward + auto-return
  [
    { from: 'main', to: 'ersatzteile', type: 'sync', label: 'bestellen(...)' },
    { from: 'ersatzteile', to: 'main', type: 'return', label: 'teile' },
  ],
  // Q7: reparieren forward + void return
  [
    { from: 'main', to: 'diagnose', type: 'sync', label: 'reparieren(...)' },
    { from: 'diagnose', to: 'main', type: 'return', label: '' },
  ],
  // Q8: neuKalibrieren forward + void return (in else branch)
  [
    { from: 'main', to: 'diagnose', type: 'sync', label: 'neuKalibrieren()' },
    { from: 'diagnose', to: 'main', type: 'return', label: '' },
  ],
  // Q9: smsVersenden async (no return)
  [{ from: 'main', to: 'benachrichtigung', type: 'async', label: 'smsVersenden(...)' }],
]

// === Fragment Data for Sequence Diagram ===

interface SDFragment {
  type: 'loop' | 'alt'
  label: string
  fromArrowIdx: number
  toArrowIdx: number
  altDividerAfterIdx?: number
  color: string
}

// === Component ===

export function CodeTraceSequence() {
  const { result, showHints, submit, reset, toggleHints } = useExercise<string[]>(exercise)

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(string | null)[]>(Array(QUESTIONS.length).fill(null))
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(null)

  const shuffledQuestions = useMemo(() => {
    return QUESTIONS.map((q) => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5),
    }))
  }, [])

  const allAnswered = answers.every((a) => a !== null)
  const currentQ = shuffledQuestions[currentQuestion]
  const originalQ = QUESTIONS[currentQuestion]
  const activeLine = originalQ.codeLine
  const targetMethod = originalQ.targetId ? TARGET[originalQ.targetId] : null
  const highlightLine = targetMethod ? (originalQ.type === 'return' ? targetMethod.returnLine : targetMethod.methodLine) : undefined

  // Collect all revealed arrows
  const visibleArrows: DArrow[] = []
  for (let i = 0; i < QUESTIONS.length; i++) {
    if (answers[i] !== null) {
      visibleArrows.push(...ARROW_SETS[i])
    }
  }

  // Compute visible fragments based on answered questions
  // Arrow indices in the flat visibleArrows array depend on which questions are answered.
  // We use fixed global indices based on all arrows being present:
  // Q0 (1 arrow): index 0
  // Q1 (1 arrow): index 1
  // Q2 (0 arrows): -
  // Q3 (2 arrows): indices 2,3
  // Q4 (0 arrows): -
  // Q5 (2 arrows): indices 4,5
  // Q6 (2 arrows): indices 6,7
  // Q7 (2 arrows): indices 8,9
  // Q8 (1 arrow): index 10
  // loop: arrows 2-9, alt: arrows 4-9 with divider after 7
  const visibleFragments: SDFragment[] = []
  if (answers[2] !== null) {
    visibleFragments.push({
      type: 'loop',
      label: 'loop [versuch <= 2]',
      fromArrowIdx: 2,
      toArrowIdx: 9,
      color: '#6366f1',
    })
  }
  if (answers[4] !== null) {
    visibleFragments.push({
      type: 'alt',
      label: 'alt [istReparierbar()]',
      fromArrowIdx: 4,
      toArrowIdx: 9,
      altDividerAfterIdx: 7,
      color: '#f59e0b',
    })
  }

  const handleSelect = (optionId: string) => {
    if (result || answers[currentQuestion] !== null) return
    const isCorrect = optionId === originalQ.correctAnswer
    const option = originalQ.options.find((o) => o.id === optionId)!
    setAnswers((prev) => {
      const next = [...prev]
      next[currentQuestion] = optionId
      return next
    })
    setFeedback({ correct: isCorrect, explanation: option.explanation })
  }

  const navigateTo = (index: number) => {
    setCurrentQuestion(index)
    if (answers[index] !== null) {
      const orig = QUESTIONS[index]
      const isC = answers[index] === orig.correctAnswer
      const opt = orig.options.find((o) => o.id === answers[index])!
      setFeedback({ correct: isC, explanation: opt.explanation })
    } else {
      setFeedback(null)
    }
  }

  const handleSubmit = () => {
    submit((): ValidationResult => {
      let score = 0
      const details = answers.map((a, i) => {
        const isCorrect = a === QUESTIONS[i].correctAnswer
        if (isCorrect) score++
        return {
          itemId: `q${i}`,
          correct: isCorrect,
          feedback: isCorrect ? 'Richtig' : QUESTIONS[i].options.find((o) => o.id === QUESTIONS[i].correctAnswer)!.explanation,
        }
      })
      return {
        correct: score === exercise.maxPoints,
        score,
        maxScore: exercise.maxPoints,
        feedback:
          score === exercise.maxPoints
            ? 'Perfekt! Du hast jede Code-Zeile korrekt als UML-Nachricht identifiziert.'
            : `${score} von ${exercise.maxPoints} Nachrichten korrekt zugeordnet.`,
        details,
      }
    })
  }

  const handleReset = () => {
    reset()
    setAnswers(Array(QUESTIONS.length).fill(null))
    setCurrentQuestion(0)
    setFeedback(null)
  }

  // Type badge
  const typeBadge = (type: 'forward' | 'return' | 'async' | 'fragment') => {
    const styles =
      type === 'return'
        ? 'bg-slate-200 text-slate-700'
        : type === 'async'
          ? 'bg-purple-100 text-purple-700'
          : type === 'fragment'
            ? 'bg-indigo-100 text-indigo-700'
            : 'bg-blue-100 text-blue-700'
    const label = type === 'return' ? 'Rueckantwort' : type === 'async' ? 'Asynchron' : type === 'fragment' ? 'Fragment' : 'Nachricht'
    return <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${styles}`}>{label}</span>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light">{exercise.description}</p>
      </div>

      {/* Scenario */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <span className="font-semibold">Szenario:</span> Ein Kunde bringt sein defektes Handy zur Reparatur.
        Der ReparaturService ruft nacheinander Methoden auf verschiedenen Objekten auf.
        Der Code enthaelt eine <strong>for-Schleife</strong> (bis zu 2 Reparaturversuche) und eine <strong>if/else-Verzweigung</strong> (reparierbar oder neu kalibrieren).
        Springe in den Ziel-Code und identifiziere die UML-Nachrichten und kombinierten Fragmente.
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 flex-wrap">
        {QUESTIONS.map((q, i) => {
          const answered = answers[i] !== null
          const correct = answered && answers[i] === q.correctAnswer
          return (
            <button
              key={i}
              onClick={() => navigateTo(i)}
              className={`w-9 h-9 rounded-full text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                i === currentQuestion ? 'ring-2 ring-primary ring-offset-2' : ''
              } ${
                answered
                  ? correct
                    ? 'bg-green-500 text-white'
                    : 'bg-red-400 text-white'
                  : i === currentQuestion
                    ? 'bg-primary text-white'
                    : 'bg-slate-200 text-slate-600'
              }`}
              aria-label={`Frage ${i + 1}`}
            >
              {i + 1}
            </button>
          )
        })}
        <span className="ml-2 text-sm text-text-light">
          Frage {currentQuestion + 1} / {QUESTIONS.length}
        </span>
        {typeBadge(originalQ.type)}
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Code panels */}
        <div className="space-y-3">
          {/* Main controller code */}
          <div className="bg-slate-900 rounded-xl overflow-hidden">
            <div className="px-4 py-2 bg-slate-800 border-b border-slate-700">
              <span className="text-sm text-slate-400 font-mono">ReparaturService.java</span>
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="text-sm leading-relaxed">
                {MAIN_CODE.map((line, index) => {
                  const isActive = index === activeLine && !result
                  const wasAnswered = QUESTIONS.some((q, qi) => q.codeLine === index && answers[qi] !== null)
                  const wasCorrect = QUESTIONS.some((q, qi) => q.codeLine === index && answers[qi] === q.correctAnswer)
                  return (
                    <div
                      key={index}
                      className={`flex transition-colors duration-200 ${
                        isActive
                          ? 'bg-yellow-500/25 rounded'
                          : wasAnswered
                            ? wasCorrect
                              ? 'bg-green-500/10 rounded'
                              : 'bg-red-500/10 rounded'
                            : ''
                      }`}
                    >
                      <span className="text-slate-600 select-none w-8 text-right mr-4 flex-shrink-0">{index + 1}</span>
                      <span
                        className={`font-mono ${
                          isActive
                            ? 'text-yellow-300 font-semibold'
                            : wasAnswered
                              ? wasCorrect
                                ? 'text-green-300'
                                : 'text-red-300'
                              : 'text-slate-300'
                        }`}
                      >
                        {line || '\u00A0'}
                      </span>
                      {isActive && (
                        <span className="ml-2 text-yellow-400 animate-pulse" aria-hidden="true">
                          {'\u25C4'}
                        </span>
                      )}
                    </div>
                  )
                })}
              </pre>
            </div>
          </div>

          {/* Target class code — only for non-fragment questions */}
          {!result && originalQ.type !== 'fragment' && targetMethod && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentQuestion}-${originalQ.targetId}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-slate-900 rounded-xl overflow-hidden border-2 border-amber-500/30"
              >
                <div className="px-4 py-2 bg-amber-900/40 border-b border-slate-700 flex items-center gap-2">
                  <span className="text-amber-400 text-xs">{'\u21B3'}</span>
                  <span className="text-sm text-amber-300 font-mono">{targetMethod.fileName}</span>
                  {originalQ.type === 'return' && (
                    <span className="text-xs bg-amber-600 text-white px-1.5 py-0.5 rounded">return</span>
                  )}
                  {originalQ.type === 'async' && (
                    <span className="text-xs bg-purple-600 text-white px-1.5 py-0.5 rounded">async</span>
                  )}
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="text-sm leading-relaxed">
                    {targetMethod.lines.map((line, i) => {
                      const isHL = i === highlightLine
                      return (
                        <div key={i} className={isHL ? 'bg-amber-500/25 rounded' : ''}>
                          <span className="text-slate-600 select-none w-6 text-right mr-3 inline-block">{i + 1}</span>
                          <span className={`font-mono ${isHL ? 'text-amber-300 font-semibold' : 'text-slate-400'}`}>
                            {line || '\u00A0'}
                          </span>
                          {isHL && (
                            <span className="ml-2 text-amber-400 animate-pulse" aria-hidden="true">
                              {'\u25C4'}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </pre>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Fragment info box — for fragment questions */}
          {!result && originalQ.type === 'fragment' && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`fragment-${currentQuestion}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-indigo-600 text-lg" aria-hidden="true">{'\u25A3'}</span>
                  <span className="text-sm font-semibold text-indigo-800">Fragment-Frage</span>
                </div>
                <p className="text-sm text-indigo-700">
                  Welches UML-Fragment passt zu dieser Code-Struktur? Schau dir die markierte Zeile im Code an.
                </p>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Right: Question + diagram */}
        <div className="space-y-4">
          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <p className="text-sm font-semibold text-text">{currentQ.prompt}</p>

              <div className="bg-slate-800 rounded-lg px-3 py-2 font-mono text-sm text-yellow-300">
                {MAIN_CODE[activeLine]}
              </div>

              <div className="space-y-2" role="radiogroup" aria-label={`Optionen fuer Zeile ${activeLine + 1}`}>
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQuestion] === opt.id
                  const isAnswered = answers[currentQuestion] !== null
                  const isCorrectOption = opt.id === originalQ.correctAnswer

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(opt.id)}
                      disabled={isAnswered || !!result}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                        isAnswered
                          ? isCorrectOption
                            ? 'border-green-400 bg-green-50'
                            : isSelected
                              ? 'border-red-400 bg-red-50'
                              : 'border-border bg-white opacity-60'
                          : 'border-border bg-white hover:border-primary/50 hover:shadow-sm cursor-pointer'
                      }`}
                      role="radio"
                      aria-checked={isSelected}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                            isAnswered
                              ? isCorrectOption
                                ? 'bg-green-200 text-green-800'
                                : isSelected
                                  ? 'bg-red-200 text-red-800'
                                  : 'bg-slate-100 text-slate-400'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {opt.id.toUpperCase()}
                        </span>
                        <span className="font-mono text-xs sm:text-sm">{opt.label}</span>
                        {isAnswered && isCorrectOption && (
                          <svg className="w-5 h-5 text-green-600 ml-auto shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        {isAnswered && isSelected && !isCorrectOption && (
                          <svg className="w-5 h-5 text-red-600 ml-auto shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Inline feedback */}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg text-sm ${
                    feedback.correct
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}
                >
                  {feedback.explanation}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => navigateTo(currentQuestion - 1)}
              disabled={currentQuestion <= 0}
              className="px-3 py-2 rounded-lg border border-border text-text text-sm hover:bg-surface-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Zurueck
            </button>
            <button
              onClick={() => navigateTo(currentQuestion + 1)}
              disabled={currentQuestion >= QUESTIONS.length - 1 || answers[currentQuestion] === null}
              className="px-3 py-2 rounded-lg border border-border text-text text-sm hover:bg-surface-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Naechste Frage
            </button>
          </div>

          {/* Mini sequence diagram */}
          {(visibleArrows.length > 0 || visibleFragments.length > 0) && (
            <div className="bg-white rounded-lg border border-border p-3">
              <p className="text-xs font-bold text-slate-500 mb-2">Bisheriges Sequenzdiagramm:</p>
              <SequenceDiagram arrows={visibleArrows} fragments={visibleFragments} />
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      {!result && allAnswered && (
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

// === Mini Sequence Diagram ===

function SequenceDiagram({ arrows, fragments }: { arrows: DArrow[]; fragments: SDFragment[] }) {
  const LL_SPACING = 130
  const ARROW_SPACING = 30
  const HEADER_H = 38
  const FIRST_ARROW_Y = HEADER_H + 25

  const totalH = FIRST_ARROW_Y + arrows.length * ARROW_SPACING + 10
  const totalW = 60 + (LIFELINES.length - 1) * LL_SPACING + 60

  const llX = (id: string) => {
    const idx = LIFELINES.findIndex((ll) => ll.id === id)
    return 60 + idx * LL_SPACING
  }

  return (
    <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full" role="img" aria-label="Aufgebautes Sequenzdiagramm">
      {/* Lifeline headers + dashed lines */}
      {LIFELINES.map((ll, i) => {
        const x = 60 + i * LL_SPACING
        return (
          <g key={ll.id}>
            <rect x={x - 50} y={2} width={100} height={28} rx={4} fill={ll.color} />
            <text x={x} y={22} textAnchor="middle" fontSize={10} fill="white" fontWeight="bold">
              {ll.label}
            </text>
            <line x1={x} y1={HEADER_H} x2={x} y2={totalH} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4 3" />
          </g>
        )
      })}

      {/* Fragment boxes (rendered behind arrows) */}
      {fragments.map((frag, fi) => {
        // Only render if we have enough arrows visible
        if (frag.fromArrowIdx >= arrows.length && frag.toArrowIdx >= arrows.length) return null

        // Clamp indices to visible arrows range
        const fromIdx = Math.min(frag.fromArrowIdx, arrows.length - 1)
        const toIdx = Math.min(frag.toArrowIdx, arrows.length - 1)

        const yStart = FIRST_ARROW_Y + fromIdx * ARROW_SPACING - ARROW_SPACING / 2
        const yEnd = FIRST_ARROW_Y + toIdx * ARROW_SPACING + ARROW_SPACING / 2

        const indent = frag.type === 'alt' ? 20 : 10
        const width = totalW - 2 * indent

        const labelWidth = frag.type === 'alt' ? 140 : 130

        return (
          <g key={`frag-${fi}`}>
            {/* Fragment rectangle */}
            <rect
              x={indent}
              y={yStart}
              width={width}
              height={yEnd - yStart}
              fill={frag.color}
              fillOpacity={0.05}
              stroke={frag.color}
              strokeWidth={1.5}
              rx={4}
            />
            {/* Fragment label tab */}
            <rect x={indent} y={yStart} width={labelWidth} height={16} fill={frag.color} rx={2} />
            <text x={indent + 5} y={yStart + 11} fontSize={8} fill="white" fontWeight="bold">
              {frag.label}
            </text>
            {/* Alt divider line */}
            {frag.type === 'alt' && frag.altDividerAfterIdx !== undefined && frag.altDividerAfterIdx < arrows.length && (
              <>
                <line
                  x1={indent}
                  y1={FIRST_ARROW_Y + frag.altDividerAfterIdx * ARROW_SPACING + ARROW_SPACING / 2}
                  x2={indent + width}
                  y2={FIRST_ARROW_Y + frag.altDividerAfterIdx * ARROW_SPACING + ARROW_SPACING / 2}
                  stroke={frag.color}
                  strokeWidth={1}
                  strokeDasharray="6 3"
                />
                <text
                  x={indent + 5}
                  y={FIRST_ARROW_Y + frag.altDividerAfterIdx * ARROW_SPACING + ARROW_SPACING / 2 + 11}
                  fontSize={8}
                  fill={frag.color}
                  fontWeight="bold"
                >
                  [else]
                </text>
              </>
            )}
          </g>
        )
      })}

      {/* Arrows */}
      {arrows.map((arrow, i) => {
        const fromX = llX(arrow.from)
        const toX = llX(arrow.to)
        const y = FIRST_ARROW_Y + i * ARROW_SPACING
        const dir = fromX < toX ? 1 : -1

        const color =
          arrow.type === 'return' ? '#94a3b8' : arrow.type === 'async' ? '#8b5cf6' : '#3b82f6'

        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {/* Line */}
            <line
              x1={fromX}
              y1={y}
              x2={toX}
              y2={y}
              stroke={color}
              strokeWidth={1.5}
              strokeDasharray={arrow.type === 'return' ? '5 3' : undefined}
            />
            {/* Arrowhead */}
            {arrow.type === 'async' ? (
              <polyline
                points={`${toX - dir * 9},${y - 5} ${toX},${y} ${toX - dir * 9},${y + 5}`}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
              />
            ) : (
              <polygon
                points={`${toX},${y} ${toX - dir * 9},${y - 4.5} ${toX - dir * 9},${y + 4.5}`}
                fill={color}
              />
            )}
            {/* Label */}
            <text x={(fromX + toX) / 2} y={y - 6} textAnchor="middle" fontSize={9} fill={color}>
              {arrow.label}
            </text>
          </motion.g>
        )
      })}
    </svg>
  )
}
