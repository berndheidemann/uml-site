import type { ValidationResult, ValidationDetail } from '../types/index.ts'

export function validateDragDropZuordnung(
  answer: Record<string, string>,
  correctMapping: Record<string, string>,
  maxPoints: number
): ValidationResult {
  const details: ValidationDetail[] = []
  let correctCount = 0
  const totalItems = Object.keys(correctMapping).length

  for (const [itemId, correctZoneId] of Object.entries(correctMapping)) {
    const userZoneId = answer[itemId]
    const isCorrect = userZoneId === correctZoneId
    if (isCorrect) correctCount++
    details.push({ itemId, correct: isCorrect })
  }

  const score = totalItems > 0 ? Math.round((correctCount / totalItems) * maxPoints) : 0

  return {
    correct: correctCount === totalItems,
    score,
    maxScore: maxPoints,
    feedback: correctCount === totalItems
      ? 'Alles richtig! Sehr gut!'
      : `${correctCount} von ${totalItems} Zuordnungen korrekt.`,
    details,
  }
}

export function validateDragDropSortierung(
  answer: string[],
  correctOrder: string[],
  maxPoints: number
): ValidationResult {
  const details: ValidationDetail[] = []
  let correctCount = 0

  for (let i = 0; i < correctOrder.length; i++) {
    const isCorrect = answer[i] === correctOrder[i]
    if (isCorrect) correctCount++
    details.push({ itemId: correctOrder[i], correct: isCorrect })
  }

  const score = correctCount === correctOrder.length ? maxPoints : Math.round((correctCount / correctOrder.length) * maxPoints)

  return {
    correct: correctCount === correctOrder.length,
    score,
    maxScore: maxPoints,
    feedback: correctCount === correctOrder.length
      ? 'Perfekte Reihenfolge!'
      : `${correctCount} von ${correctOrder.length} Positionen korrekt.`,
    details,
  }
}

export function validateMultipleChoice(
  selectedIds: string[],
  correctIds: string[],
  maxPoints: number
): ValidationResult {
  const correctSet = new Set(correctIds)
  const selectedSet = new Set(selectedIds)

  const correctSelections = selectedIds.filter((id) => correctSet.has(id)).length
  const incorrectSelections = selectedIds.filter((id) => !correctSet.has(id)).length
  const missed = correctIds.filter((id) => !selectedSet.has(id)).length

  const isFullyCorrect = incorrectSelections === 0 && missed === 0
  const score = isFullyCorrect ? maxPoints : Math.max(0, Math.round(((correctSelections - incorrectSelections) / correctIds.length) * maxPoints))

  return {
    correct: isFullyCorrect,
    score,
    maxScore: maxPoints,
    feedback: isFullyCorrect
      ? 'Richtig!'
      : missed > 0 && incorrectSelections > 0
        ? `${missed} richtige Antwort(en) fehlen und ${incorrectSelections} falsche ausgewählt.`
        : missed > 0
          ? `${missed} richtige Antwort(en) fehlen.`
          : `${incorrectSelections} falsche Antwort(en) ausgewählt.`,
  }
}

export function validateDecision(
  selectedId: string,
  correctId: string,
  maxPoints: number
): ValidationResult {
  const isCorrect = selectedId === correctId
  return {
    correct: isCorrect,
    score: isCorrect ? maxPoints : 0,
    maxScore: maxPoints,
    feedback: isCorrect ? 'Richtig!' : 'Leider falsch.',
  }
}

export function validateHotspot(
  clickedIds: string[],
  correctIds: string[],
  maxPoints: number,
  penaltyPerFalseAlarm = 0
): ValidationResult {
  const correctSet = new Set(correctIds)
  const correctClicks = clickedIds.filter((id) => correctSet.has(id)).length
  const falseAlarms = clickedIds.filter((id) => !correctSet.has(id)).length
  const missed = correctIds.filter((id) => !clickedIds.includes(id)).length
  const isFullyCorrect = falseAlarms === 0 && missed === 0

  const rawScore = Math.max(0, correctClicks * (maxPoints / correctIds.length) - falseAlarms * penaltyPerFalseAlarm)
  const score = Math.min(maxPoints, Math.round(rawScore))

  return {
    correct: isFullyCorrect,
    score,
    maxScore: maxPoints,
    feedback: isFullyCorrect
      ? 'Alle Elemente korrekt identifiziert!'
      : `${correctClicks} von ${correctIds.length} richtig gefunden.${falseAlarms > 0 ? ` ${falseAlarms} Fehlklick(s).` : ''}`,
  }
}

export function validateTimedChallenge(
  answers: Record<string, string>,
  correctAnswers: Record<string, string>,
  maxPoints: number
): ValidationResult {
  let correct = 0
  const total = Object.keys(correctAnswers).length
  const details: ValidationDetail[] = []

  for (const [questionId, correctId] of Object.entries(correctAnswers)) {
    const isCorrect = answers[questionId] === correctId
    if (isCorrect) correct++
    details.push({ itemId: questionId, correct: isCorrect })
  }

  const score = total > 0 ? Math.round((correct / total) * maxPoints) : 0

  return {
    correct: correct === total,
    score,
    maxScore: maxPoints,
    feedback: `${correct} von ${total} Fragen richtig beantwortet.`,
    details,
  }
}

export function validateTextExtraction(
  selections: Record<string, string>,
  correctCategories: Record<string, string>,
  maxPoints: number
): ValidationResult {
  let correct = 0
  const total = Object.keys(correctCategories).length
  const details: ValidationDetail[] = []

  for (const [phraseId, correctCategory] of Object.entries(correctCategories)) {
    const isCorrect = selections[phraseId] === correctCategory
    if (isCorrect) correct++
    details.push({ itemId: phraseId, correct: isCorrect })
  }

  const score = total > 0 ? Math.round((correct / total) * maxPoints) : 0

  return {
    correct: correct === total,
    score,
    maxScore: maxPoints,
    feedback: correct === total
      ? 'Alle Textpassagen korrekt zugeordnet!'
      : `${correct} von ${total} Zuordnungen korrekt.`,
    details,
  }
}

export function validateLueckentext(
  answers: Record<string, string>,
  correctAnswers: Record<string, string[]>,
  maxPoints: number
): ValidationResult {
  let correct = 0
  const total = Object.keys(correctAnswers).length
  const details: ValidationDetail[] = []

  for (const [gapId, acceptedAnswers] of Object.entries(correctAnswers)) {
    const userAnswer = (answers[gapId] ?? '').trim().toLowerCase()
    const isCorrect = acceptedAnswers.some((a) => a.toLowerCase() === userAnswer)
    if (isCorrect) correct++
    details.push({ itemId: gapId, correct: isCorrect })
  }

  const score = total > 0 ? Math.round((correct / total) * maxPoints) : 0

  return {
    correct: correct === total,
    score,
    maxScore: maxPoints,
    feedback: correct === total
      ? 'Alle Lücken korrekt ausgefüllt!'
      : `${correct} von ${total} Lücken korrekt.`,
    details,
  }
}
