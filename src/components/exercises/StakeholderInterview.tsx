import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExerciseFeedback } from '../common/ExerciseFeedback.tsx'
import { useExercise } from '../../hooks/useExercise.ts'
import type { ExerciseBase, ValidationResult } from '../../types/index.ts'

// === Embedded Exercise Data ===

const exercise: ExerciseBase = {
  id: 'uc-interview-01',
  version: 2,
  title: 'Stakeholder-Interview',
  description:
    'Markiere im Gespraech mit der Filialleiterin alle relevanten Akteure und Use Cases fuer das Baeckerei-Verwaltungssystem.',
  diagramType: 'usecasediagramm',
  exerciseType: 'custom',
  level: 2,
  maxPoints: 10,
  hints: [
    'Akteure sind Personen oder Systeme, die mit dem System interagieren.',
    'Use Cases sind Funktionen, die das System bereitstellen soll.',
    'Nicht alles, was die Filialleiterin sagt, ist relevant fuer das Use-Case-Diagramm.',
  ],
}

// === Category Types ===

type MarkingCategory = 'akteur' | 'usecase' | 'irrelevant'

const categories: { id: MarkingCategory; label: string; color: string; bgClass: string; textClass: string }[] = [
  { id: 'akteur', label: 'Akteur', color: '#2563eb', bgClass: 'bg-blue-100', textClass: 'text-blue-800' },
  { id: 'usecase', label: 'Use Case', color: '#16a34a', bgClass: 'bg-green-100', textClass: 'text-green-800' },
  { id: 'irrelevant', label: 'Irrelevant', color: '#6b7280', bgClass: 'bg-gray-200', textClass: 'text-gray-500 line-through' },
]

// === Chat Message Data ===

interface ClickableSpan {
  id: string
  text: string
  correctCategory: MarkingCategory
  explanation: string
}

interface ChatMessage {
  id: string
  // Parts: either a plain string or a clickable span reference
  parts: (string | { spanId: string })[]
}

const clickableSpans: ClickableSpan[] = [
  {
    id: 'sp-filialleiterin',
    text: 'Filialleiterin',
    correctCategory: 'akteur',
    explanation: 'Die Filialleiterin ist eine Person, die mit dem System interagiert -- ein klassischer Akteur.',
  },
  {
    id: 'sp-bestellen',
    text: 'Bestellung aufgeben',
    correctCategory: 'usecase',
    explanation: '"Bestellung aufgeben" ist eine Funktion, die das System bereitstellen soll -- ein Use Case.',
  },
  {
    id: 'sp-lieferung',
    text: 'Lieferung planen',
    correctCategory: 'usecase',
    explanation: '"Lieferung planen" beschreibt eine Systemfunktion -- ein Use Case.',
  },
  {
    id: 'sp-lieferant',
    text: 'Lieferant',
    correctCategory: 'akteur',
    explanation: 'Der Lieferant ist eine externe Person/Organisation, die mit dem System interagiert -- ein Akteur.',
  },
  {
    id: 'sp-wandfarbe',
    text: 'Wandfarbe im Laden sollte mal aufgefrischt werden',
    correctCategory: 'irrelevant',
    explanation: 'Die Wandfarbe ist keine Systemfunktion und kein Akteur -- das ist eine Anforderung an die Filialausstattung, nicht an die Software.',
  },
  {
    id: 'sp-zentrale',
    text: 'Zentrale',
    correctCategory: 'akteur',
    explanation: 'Die Zentrale interagiert mit dem System (z.B. Umsatzauswertung, Rezeptverwaltung) -- ein Akteur.',
  },
  {
    id: 'sp-umsatz',
    text: 'Umsatz auswerten',
    correctCategory: 'usecase',
    explanation: '"Umsatz auswerten" ist eine Systemfunktion, die das System bereitstellen muss -- ein Use Case.',
  },
  {
    id: 'sp-rezept',
    text: 'Rezept verwalten',
    correctCategory: 'usecase',
    explanation: '"Rezept verwalten" ist eine Systemfunktion -- ein Use Case.',
  },
  {
    id: 'sp-admin',
    text: 'Administrator',
    correctCategory: 'akteur',
    explanation: 'Ein Administrator ist ein spezialisierter Nutzer, der mit dem System interagiert -- ein Akteur.',
  },
  {
    id: 'sp-oeffnungszeiten',
    text: 'Oeffnungszeiten sind von 6 bis 18 Uhr',
    correctCategory: 'irrelevant',
    explanation: 'Oeffnungszeiten sind organisatorische Informationen, keine funktionalen Anforderungen -- irrelevant fuer das Use-Case-Diagramm.',
  },
]

const spanMap = new Map(clickableSpans.map((s) => [s.id, s]))

const chatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    parts: ['Guten Tag! Ich erzaehle Ihnen von unserer Baeckerei-Kette.'],
  },
  {
    id: 'msg-2',
    parts: [
      'Jede ',
      { spanId: 'sp-filialleiterin' },
      ' muss taeglich eine ',
      { spanId: 'sp-bestellen' },
      ' koennen.',
    ],
  },
  {
    id: 'msg-3',
    parts: [
      'Unser ',
      { spanId: 'sp-lieferant' },
      ' braucht die Moeglichkeit, die ',
      { spanId: 'sp-lieferung' },
      ' zu koennen.',
    ],
  },
  {
    id: 'msg-4',
    parts: ['Ach, die ', { spanId: 'sp-wandfarbe' }, '.'],
  },
  {
    id: 'msg-5',
    parts: [
      'Die ',
      { spanId: 'sp-zentrale' },
      ' moechte den ',
      { spanId: 'sp-umsatz' },
      ' koennen.',
    ],
  },
  {
    id: 'msg-6',
    parts: [
      'Ausserdem soll die Zentrale ',
      { spanId: 'sp-rezept' },
      ' koennen -- neue Brotsorten und so.',
    ],
  },
  {
    id: 'msg-7',
    parts: [
      'Ein ',
      { spanId: 'sp-admin' },
      ' soll die Filialzugaenge einrichten koennen.',
    ],
  },
  {
    id: 'msg-8',
    parts: ['Unsere ', { spanId: 'sp-oeffnungszeiten' }, '.'],
  },
]

// Cycle order: unmarked -> akteur -> usecase -> irrelevant -> unmarked
const cycleOrder: (MarkingCategory | null)[] = [null, 'akteur', 'usecase', 'irrelevant']

function nextCategory(current: MarkingCategory | null): MarkingCategory | null {
  const idx = cycleOrder.indexOf(current)
  return cycleOrder[(idx + 1) % cycleOrder.length]
}

// === Chat Bubble Component ===

interface ChatBubbleProps {
  message: ChatMessage
  index: number
  markings: Record<string, MarkingCategory | null>
  resultMode: boolean
  correctMap: Map<string, ClickableSpan>
  onSpanClick: (spanId: string) => void
}

function ChatBubble({
  message,
  index,
  markings,
  resultMode,
  correctMap,
  onSpanClick,
}: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
      className="flex gap-3 items-start"
    >
      {/* Avatar */}
      <div
        className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shadow-sm"
        aria-hidden="true"
      >
        FM
      </div>

      {/* Bubble */}
      <div className="relative max-w-lg bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        {/* Chat tail */}
        <div
          className="absolute -left-2 top-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-border"
          aria-hidden="true"
        />
        <div
          className="absolute -left-[6px] top-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-white"
          aria-hidden="true"
        />

        <p className="text-text leading-relaxed">
          {message.parts.map((part, pIdx) => {
            if (typeof part === 'string') {
              return <span key={pIdx}>{part}</span>
            }

            const span = correctMap.get(part.spanId)
            if (!span) return null

            const marking = markings[part.spanId] ?? null
            const category = marking
              ? categories.find((c) => c.id === marking)
              : null

            // Result styling
            let resultClass = ''
            if (resultMode) {
              const isCorrect = marking === span.correctCategory
              if (marking && isCorrect) {
                resultClass = 'ring-2 ring-green-400'
              } else if (marking && !isCorrect) {
                resultClass = 'ring-2 ring-red-400'
              } else if (!marking) {
                // Unmarked but should have been marked
                resultClass = 'ring-2 ring-yellow-400'
              }
            }

            return (
              <button
                key={part.spanId}
                onClick={() => onSpanClick(part.spanId)}
                disabled={resultMode}
                className={`inline px-1.5 py-0.5 rounded-md cursor-pointer transition-all mx-0.5 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                  category
                    ? `${category.bgClass} ${category.textClass}`
                    : 'bg-gray-100 hover:bg-gray-200 text-text'
                } ${resultClass} ${resultMode ? 'cursor-default' : ''}`}
                role="button"
                aria-label={`${span.text}${category ? ` -- markiert als ${category.label}` : ' -- nicht markiert, klicken zum Markieren'}`}
                title={
                  resultMode
                    ? `Korrekt: ${categories.find((c) => c.id === span.correctCategory)?.label}`
                    : category
                      ? `Markiert als: ${category.label} (klicken zum Aendern)`
                      : 'Klicken zum Markieren'
                }
              >
                {span.text}
              </button>
            )
          })}
        </p>
      </div>
    </motion.div>
  )
}

// === Main Component ===

export function StakeholderInterview() {
  const { result, showHints, submit, reset, toggleHints } =
    useExercise<Record<string, MarkingCategory | null>>(exercise)
  const [markings, setMarkings] = useState<Record<string, MarkingCategory | null>>({})

  const handleSpanClick = (spanId: string) => {
    if (result) return
    setMarkings((prev) => ({
      ...prev,
      [spanId]: nextCategory(prev[spanId] ?? null),
    }))
  }

  const markedCount = Object.values(markings).filter((v) => v !== null).length

  const handleSubmit = () => {
    submit((): ValidationResult => {
      let correctCount = 0
      let wrongCount = 0
      const details: { itemId: string; correct: boolean; feedback?: string }[] = []

      for (const span of clickableSpans) {
        const studentMarking = markings[span.id] ?? null
        const isCorrect = studentMarking === span.correctCategory

        if (isCorrect) {
          correctCount++
        } else {
          wrongCount++
        }

        const correctLabel = categories.find((c) => c.id === span.correctCategory)?.label ?? ''
        const studentLabel = studentMarking
          ? categories.find((c) => c.id === studentMarking)?.label ?? ''
          : 'nicht markiert'

        details.push({
          itemId: span.id,
          correct: isCorrect,
          feedback: isCorrect
            ? `Richtig: "${span.text}" ist ein ${correctLabel}.`
            : `"${span.text}" -- deine Markierung: ${studentLabel}, korrekt waere: ${correctLabel}.`,
        })
      }

      // Scoring: each correct gives 1 point (scaled), wrong subtracts 0.5 (but floor at 0)
      const rawScore = Math.max(0, correctCount - wrongCount * 0.5)
      const scaledScore = Math.round(
        (rawScore / clickableSpans.length) * exercise.maxPoints,
      )
      const finalScore = Math.min(scaledScore, exercise.maxPoints)

      return {
        correct: correctCount === clickableSpans.length && wrongCount === 0,
        score: finalScore,
        maxScore: exercise.maxPoints,
        feedback:
          wrongCount === 0
            ? 'Hervorragend! Du hast alle Elemente korrekt identifiziert.'
            : `${correctCount} von ${clickableSpans.length} richtig. ${wrongCount > 0 ? `${wrongCount} Markierung(en) waren falsch oder fehlten.` : ''}`,
        details,
      }
    })
  }

  const handleReset = () => {
    reset()
    setMarkings({})
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light">{exercise.description}</p>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl border border-border p-4">
        <p className="text-sm font-semibold text-text mb-3">
          Klicke auf die hervorgehobenen Begriffe, um sie zu markieren:
        </p>
        <div className="flex flex-wrap gap-3" role="list" aria-label="Legende">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-2"
              role="listitem"
            >
              <span
                className={`inline-block w-4 h-4 rounded ${cat.bgClass} border`}
                style={{ borderColor: cat.color }}
                aria-hidden="true"
              />
              <span className="text-sm text-text">{cat.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 ml-4 text-xs text-text-light">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span>Klicken, um durch die Kategorien zu wechseln</span>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-gradient-to-b from-gray-100 to-gray-50 rounded-xl border border-border p-6 space-y-4">
        {/* Chat header */}
        <div className="flex items-center gap-3 pb-3 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            FM
          </div>
          <div>
            <p className="text-sm font-semibold text-text">
              Filialleiterin Mueller
            </p>
            <p className="text-xs text-text-light">Anforderungsgespraech</p>
          </div>
          <span className="ml-auto text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            Online
          </span>
        </div>

        {/* Messages */}
        <div className="space-y-4" role="log" aria-label="Chat-Verlauf">
          {chatMessages.map((msg, idx) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              index={idx}
              markings={markings}
              resultMode={!!result}
              correctMap={spanMap}
              onSpanClick={handleSpanClick}
            />
          ))}
        </div>
      </div>

      {/* Status */}
      {!result && (
        <p className="text-sm text-text-light">
          {markedCount} von {clickableSpans.length} Begriffen markiert
        </p>
      )}

      {/* Detailed results after submission */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white rounded-xl border border-border p-4 space-y-3"
          >
            <p className="font-semibold text-text text-sm">
              Detaillierte Auswertung:
            </p>
            <div className="space-y-2">
              {clickableSpans.map((span) => {
                const marking = markings[span.id] ?? null
                const isCorrect = marking === span.correctCategory
                const correctCat = categories.find(
                  (c) => c.id === span.correctCategory,
                )

                return (
                  <motion.div
                    key={span.id}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border text-sm ${
                      isCorrect
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span aria-hidden="true" className="flex-shrink-0 mt-0.5">
                        {isCorrect ? (
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      <div className="flex-1">
                        <p className={isCorrect ? 'text-green-800' : 'text-red-800'}>
                          <span className="font-medium">"{span.text}"</span>
                          {' -- '}
                          {correctCat && (
                            <span
                              className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${correctCat.bgClass} ${correctCat.textClass.replace(' line-through', '')}`}
                            >
                              {correctCat.label}
                            </span>
                          )}
                        </p>
                        <p className="text-text-light mt-0.5 text-xs">
                          {span.explanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Summary tip */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-800">Tipp:</p>
              <p className="text-sm text-blue-700">
                Bei der Anforderungsanalyse ist es wichtig, zwischen funktionalen
                Anforderungen (Use Cases), Akteuren und nicht-funktionalen
                Anforderungen (Design, Performance etc.) zu unterscheiden. Nur
                funktionale Anforderungen und ihre Akteure gehoeren ins Use-Case-Diagramm.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      {!result && (
        <button
          onClick={handleSubmit}
          disabled={markedCount === 0}
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
