import type {
  MultipleChoiceExercise,
  TextExtractionExerciseData,
  DragDropZuordnungExercise,
} from '../../types/index.ts'

export const includeExtendSortierer: MultipleChoiceExercise = {
  id: 'uc-mc-01',
  version: 1,
  title: 'include/extend-Sortierer',
  description: 'Bestimme für jedes Use-Case-Paar, ob es sich um eine include- oder extend-Beziehung handelt.',
  diagramType: 'usecasediagramm',
  exerciseType: 'multiple-choice',
  level: 1,
  maxPoints: 5,
  hints: [
    'include = "immer dabei" — der Basis-UC ist ohne den inkludierten UC unvollständig',
    'extend = "manchmal zusätzlich" — der Basis-UC funktioniert auch ohne die Erweiterung',
    'Include-Pfeil: Basis → Inkludiert. Extend-Pfeil: Erweiternd → Basis.',
  ],
  question: '„Produkt bestellen" und „Bezahlen" — Der Bestellprozess beinhaltet IMMER eine Bezahlung. Welche Beziehung liegt vor?',
  multiSelect: false,
  options: [
    {
      id: 'include',
      text: '<<include>> — „Produkt bestellen" include „Bezahlen"',
      explanation: 'Richtig! Bestellen geht nicht ohne Bezahlen — es ist immer dabei. Pfeil: Bestellen → Bezahlen.',
    },
    {
      id: 'extend',
      text: '<<extend>> — „Bezahlen" extend „Produkt bestellen"',
      explanation: 'Falsch. Bezahlen ist nicht optional — es passiert immer bei einer Bestellung. Merksatz: include = "immer dabei".',
    },
    {
      id: 'extend-falsch',
      text: '<<extend>> — „Produkt bestellen" extend „Bezahlen"',
      explanation: 'Falsch. Die Pfeilrichtung und der Beziehungstyp stimmen nicht. Bei extend zeigt der Pfeil vom erweiternden zum Basis-UC.',
    },
  ],
  correctOptionIds: ['include'],
}

export const anforderungsExtraktor: TextExtractionExerciseData = {
  id: 'uc-text-01',
  version: 1,
  title: 'Anforderungs-Extraktor',
  description: 'Markiere die relevanten Textpassagen und ordne sie der richtigen Kategorie zu: Akteur, Use Case oder Systemgrenze.',
  diagramType: 'usecasediagramm',
  exerciseType: 'text-extraction',
  level: 2,
  maxPoints: 8,
  hints: [
    'Akteure sind Personen oder externe Systeme, die mit dem System interagieren',
    'Use Cases beschreiben Funktionalitäten aus Nutzersicht (Verben/Tätigkeiten)',
    'Systemgrenzen definieren, was zum System gehört und was extern ist',
  ],
  sourceText: 'Der Kunde soll Produkte suchen und bestellen können. Bei jeder Bestellung muss bezahlt werden. Ein Admin verwaltet das Produktsortiment. Das externe Zahlungssystem wickelt die Zahlung ab. Mitarbeiter können Bestellungen einsehen und den Versand verwalten.',
  phrases: [
    { id: 'p-kunde', text: 'Kunde', startIndex: 4, endIndex: 9, correctCategory: 'akteur' },
    { id: 'p-suchen', text: 'Produkte suchen', startIndex: 15, endIndex: 30, correctCategory: 'usecase' },
    { id: 'p-bestellen', text: 'bestellen', startIndex: 35, endIndex: 44, correctCategory: 'usecase' },
    { id: 'p-bezahlen', text: 'bezahlt', startIndex: 79, endIndex: 86, correctCategory: 'usecase' },
    { id: 'p-admin', text: 'Admin', startIndex: 99, endIndex: 104, correctCategory: 'akteur' },
    { id: 'p-sortiment', text: 'Produktsortiment', startIndex: 119, endIndex: 135, correctCategory: 'usecase' },
    { id: 'p-zahlungssystem', text: 'Zahlungssystem', startIndex: 149, endIndex: 163, correctCategory: 'akteur' },
    { id: 'p-mitarbeiter', text: 'Mitarbeiter', startIndex: 188, endIndex: 199, correctCategory: 'akteur' },
  ],
  categories: [
    { id: 'akteur', label: 'Akteur', color: '#2563eb' },
    { id: 'usecase', label: 'Use Case', color: '#16a34a' },
    { id: 'systemgrenze', label: 'Systemgrenze', color: '#d97706' },
  ],
}

export const systemgrenzeDebatte: DragDropZuordnungExercise = {
  id: 'uc-zuordnung-01',
  version: 1,
  title: 'Systemgrenze-Debatte',
  description: 'Entscheide für jede Funktionalität: Liegt sie innerhalb oder außerhalb der Systemgrenze des TechStore Online-Shops?',
  diagramType: 'usecasediagramm',
  exerciseType: 'drag-drop-zuordnung',
  level: 1,
  maxPoints: 8,
  hints: [
    'Die Systemgrenze umfasst alles, was das System selbst leistet',
    'Externe Dienste (Zahlungsabwicklung, Paketlieferung) liegen außerhalb',
    'Akteure stehen immer außerhalb der Systemgrenze',
  ],
  items: [
    { id: 'f-bestellen', content: 'Produkt bestellen' },
    { id: 'f-suchen', content: 'Produkt suchen' },
    { id: 'f-kreditkarte', content: 'Kreditkarte belasten' },
    { id: 'f-versandlabel', content: 'Versandlabel erstellen' },
    { id: 'f-zustellen', content: 'Paket zustellen' },
    { id: 'f-warenkorb', content: 'Warenkorb verwalten' },
    { id: 'f-lager', content: 'Lagerbestand verwalten' },
    { id: 'f-bonitaet', content: 'Bonität prüfen' },
  ],
  zones: [
    { id: 'innerhalb', label: 'Innerhalb der Systemgrenze' },
    { id: 'ausserhalb', label: 'Außerhalb der Systemgrenze' },
  ],
  correctMapping: {
    'f-bestellen': 'innerhalb',
    'f-suchen': 'innerhalb',
    'f-kreditkarte': 'ausserhalb',
    'f-versandlabel': 'innerhalb',
    'f-zustellen': 'ausserhalb',
    'f-warenkorb': 'innerhalb',
    'f-lager': 'innerhalb',
    'f-bonitaet': 'ausserhalb',
  },
}

export const usecasediagrammExercises = [
  includeExtendSortierer,
  anforderungsExtraktor,
  systemgrenzeDebatte,
]
