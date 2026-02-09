import type {
  TimedChallengeExercise,
  DragDropSortierungExercise,
  DragDropZuordnungExercise,
} from '../../types/index.ts'

export const nachrichtenTypSchnelltrainer: TimedChallengeExercise = {
  id: 'sd-timed-01',
  version: 1,
  title: 'Nachrichten-Typ-Schnelltrainer',
  description: 'Erkenne unter Zeitdruck den korrekten Nachrichtentyp anhand des angezeigten Pfeils. Synchron, asynchron oder Rückantwort?',
  diagramType: 'sequenzdiagramm',
  exerciseType: 'timed-challenge',
  level: 1,
  maxPoints: 8,
  hints: [
    'Synchron: durchgezogene Linie + gefüllte Pfeilspitze',
    'Asynchron: durchgezogene Linie + offene Pfeilspitze',
    'Rückantwort: gestrichelte Linie + offene Pfeilspitze',
  ],
  timePerQuestion: 8,
  questions: [
    {
      id: 'q1',
      svgContent: '<line x1="30" y1="30" x2="250" y2="30" stroke="#1e293b" stroke-width="2"/><polygon points="250,30 238,24 238,36" fill="#1e293b"/><text x="140" y="22" text-anchor="middle" font-size="11" fill="#1e293b">produktSuchen(suchbegriff)</text>',
      question: 'Welcher Nachrichtentyp ist das?',
      options: [
        { id: 'sync', text: 'Synchron' },
        { id: 'async', text: 'Asynchron' },
        { id: 'return', text: 'Rückantwort' },
      ],
      correctOptionId: 'sync',
    },
    {
      id: 'q2',
      svgContent: '<line x1="30" y1="30" x2="250" y2="30" stroke="#1e293b" stroke-width="2" stroke-dasharray="8,4"/><line x1="250" y1="30" x2="238" y2="24" stroke="#1e293b" stroke-width="2"/><line x1="250" y1="30" x2="238" y2="36" stroke="#1e293b" stroke-width="2"/><text x="140" y="22" text-anchor="middle" font-size="11" fill="#1e293b">produktliste</text>',
      question: 'Welcher Nachrichtentyp ist das?',
      options: [
        { id: 'sync', text: 'Synchron' },
        { id: 'async', text: 'Asynchron' },
        { id: 'return', text: 'Rückantwort' },
      ],
      correctOptionId: 'return',
    },
    {
      id: 'q3',
      svgContent: '<line x1="30" y1="30" x2="250" y2="30" stroke="#1e293b" stroke-width="2"/><line x1="250" y1="30" x2="238" y2="24" stroke="#1e293b" stroke-width="2"/><line x1="250" y1="30" x2="238" y2="36" stroke="#1e293b" stroke-width="2"/><text x="140" y="22" text-anchor="middle" font-size="11" fill="#1e293b">bestandAktualisiert</text>',
      question: 'Welcher Nachrichtentyp ist das?',
      options: [
        { id: 'sync', text: 'Synchron' },
        { id: 'async', text: 'Asynchron' },
        { id: 'return', text: 'Rückantwort' },
      ],
      correctOptionId: 'async',
    },
    {
      id: 'q4',
      svgContent: '<line x1="30" y1="30" x2="250" y2="30" stroke="#1e293b" stroke-width="2"/><polygon points="250,30 238,24 238,36" fill="#1e293b"/><text x="140" y="22" text-anchor="middle" font-size="11" fill="#1e293b">bezahle(betrag)</text>',
      question: 'Welcher Nachrichtentyp ist das?',
      options: [
        { id: 'sync', text: 'Synchron' },
        { id: 'async', text: 'Asynchron' },
        { id: 'return', text: 'Rückantwort' },
      ],
      correctOptionId: 'sync',
    },
    {
      id: 'q5',
      svgContent: '<line x1="30" y1="30" x2="250" y2="30" stroke="#1e293b" stroke-width="2" stroke-dasharray="8,4"/><line x1="250" y1="30" x2="238" y2="24" stroke="#1e293b" stroke-width="2"/><line x1="250" y1="30" x2="238" y2="36" stroke="#1e293b" stroke-width="2"/><text x="140" y="22" text-anchor="middle" font-size="11" fill="#1e293b">verfuegbar</text>',
      question: 'Welcher Nachrichtentyp ist das?',
      options: [
        { id: 'sync', text: 'Synchron' },
        { id: 'async', text: 'Asynchron' },
        { id: 'return', text: 'Rückantwort' },
      ],
      correctOptionId: 'return',
    },
    {
      id: 'q6',
      svgContent: '<line x1="30" y1="30" x2="250" y2="30" stroke="#1e293b" stroke-width="2"/><polygon points="250,30 238,24 238,36" fill="#1e293b"/><text x="140" y="22" text-anchor="middle" font-size="11" fill="#1e293b">pruefeVerfuegbarkeit(produktId)</text>',
      question: 'Welcher Nachrichtentyp ist das?',
      options: [
        { id: 'sync', text: 'Synchron' },
        { id: 'async', text: 'Asynchron' },
        { id: 'return', text: 'Rückantwort' },
      ],
      correctOptionId: 'sync',
    },
    {
      id: 'q7',
      svgContent: '<line x1="30" y1="30" x2="250" y2="30" stroke="#1e293b" stroke-width="2"/><line x1="250" y1="30" x2="238" y2="24" stroke="#1e293b" stroke-width="2"/><line x1="250" y1="30" x2="238" y2="36" stroke="#1e293b" stroke-width="2"/><text x="140" y="22" text-anchor="middle" font-size="11" fill="#1e293b">emailBenachrichtigung</text>',
      question: 'Welcher Nachrichtentyp ist das?',
      options: [
        { id: 'sync', text: 'Synchron' },
        { id: 'async', text: 'Asynchron' },
        { id: 'return', text: 'Rückantwort' },
      ],
      correctOptionId: 'async',
    },
    {
      id: 'q8',
      svgContent: '<line x1="30" y1="30" x2="250" y2="30" stroke="#1e293b" stroke-width="2" stroke-dasharray="8,4"/><line x1="250" y1="30" x2="238" y2="24" stroke="#1e293b" stroke-width="2"/><line x1="250" y1="30" x2="238" y2="36" stroke="#1e293b" stroke-width="2"/><text x="140" y="22" text-anchor="middle" font-size="11" fill="#1e293b">bestellBestaetigung</text>',
      question: 'Welcher Nachrichtentyp ist das?',
      options: [
        { id: 'sync', text: 'Synchron' },
        { id: 'async', text: 'Asynchron' },
        { id: 'return', text: 'Rückantwort' },
      ],
      correctOptionId: 'return',
    },
  ],
}

export const reihenfolgePuzzle: DragDropSortierungExercise = {
  id: 'sd-sort-01',
  version: 1,
  title: 'Reihenfolge-Puzzle',
  description: 'Bringe die Nachrichten des TechStore-Bestellprozesses in die richtige Reihenfolge.',
  diagramType: 'sequenzdiagramm',
  exerciseType: 'drag-drop-sortierung',
  level: 2,
  maxPoints: 6,
  hints: [
    'Der Kunde startet den Prozess mit einer Aktion im Webshop',
    'Der Webshop muss erst die Verfügbarkeit prüfen, bevor er bestätigt',
    'Rückantworten folgen immer auf den zugehörigen Aufruf',
  ],
  items: [
    { id: 'msg1', content: 'Kunde → Webshop: produktSuchen(suchbegriff)' },
    { id: 'msg2', content: 'Webshop → Lager: pruefeVerfuegbarkeit(produktId)' },
    { id: 'msg3', content: 'Lager ⤏ Webshop: verfuegbar' },
    { id: 'msg4', content: 'Webshop ⤏ Kunde: produktliste' },
    { id: 'msg5', content: 'Kunde → Webshop: bestellen(produktId, menge)' },
    { id: 'msg6', content: 'Webshop ⤏ Kunde: bestellBestaetigung' },
  ],
  correctOrder: ['msg1', 'msg2', 'msg3', 'msg4', 'msg5', 'msg6'],
}

// Rückantwort-Vervollständiger as custom exercise (simplified as MultipleChoice for MVP)
export const rueckantwortVervollstaendiger: DragDropZuordnungExercise = {
  id: 'sd-zuordnung-01',
  version: 1,
  title: 'Rückantwort-Vervollständiger',
  description: 'Ordne die korrekten Rückantworten den synchronen Aufrufen zu. Jede synchrone Nachricht benötigt eine passende Rückantwort (gestrichelte Linie, offene Pfeilspitze).',
  diagramType: 'sequenzdiagramm',
  exerciseType: 'drag-drop-zuordnung',
  level: 1,
  maxPoints: 4,
  hints: [
    'Rückantworten gehen in die entgegengesetzte Richtung des Aufrufs',
    'Die Beschriftung der Rückantwort enthält den Rückgabewert',
    'Rückantworten werden mit gestrichelter Linie und offener Pfeilspitze dargestellt',
  ],
  items: [
    { id: 'ret-verfuegbar', content: 'Lager ⤏ Webshop: verfuegbar' },
    { id: 'ret-produktliste', content: 'Webshop ⤏ Kunde: produktliste' },
    { id: 'ret-zahlungOk', content: 'Zahlungssystem ⤏ Webshop: zahlungErfolgreich' },
    { id: 'ret-bestaetigung', content: 'Webshop ⤏ Kunde: bestellBestaetigung' },
  ],
  zones: [
    { id: 'call-suche', label: 'Webshop → Lager: pruefeVerfuegbarkeit(produktId)' },
    { id: 'call-produkte', label: 'Kunde → Webshop: produktSuchen(suchbegriff)' },
    { id: 'call-zahlung', label: 'Webshop → Zahlungssystem: bezahle(betrag)' },
    { id: 'call-bestellen', label: 'Kunde → Webshop: bestellen(produktId, menge)' },
  ],
  correctMapping: {
    'ret-verfuegbar': 'call-suche',
    'ret-produktliste': 'call-produkte',
    'ret-zahlungOk': 'call-zahlung',
    'ret-bestaetigung': 'call-bestellen',
  },
}

export const szenarioZuSequenzBuilder: DragDropSortierungExercise = {
  id: 'sd-sort-02',
  version: 1,
  title: 'Szenario-zu-Sequenz-Builder',
  description: 'Lies das Szenario und bringe die Nachrichten in die richtige Reihenfolge, um das Sequenzdiagramm aufzubauen. Szenario: "Der Kunde sucht ein Produkt. Der Webshop validiert die Eingabe. Der Webshop fragt das Lager nach Verfügbarkeit. Das Lager antwortet. Der Webshop zeigt die Ergebnisse."',
  diagramType: 'sequenzdiagramm',
  exerciseType: 'drag-drop-sortierung',
  level: 2,
  maxPoints: 5,
  hints: [
    'Beginne mit der Aktion des Kunden',
    'Der Webshop ruft sich selbst auf (Selbstaufruf) für die Validierung',
    'Nach jeder synchronen Nachricht kommt eine Rückantwort',
  ],
  items: [
    { id: 's1', content: 'Kunde → Webshop: produktSuchen(suchbegriff)' },
    { id: 's2', content: 'Webshop → Webshop: validiereEingabe(suchbegriff)' },
    { id: 's3', content: 'Webshop → Lager: pruefeVerfuegbarkeit(produktId)' },
    { id: 's4', content: 'Lager ⤏ Webshop: bestand' },
    { id: 's5', content: 'Webshop ⤏ Kunde: produktliste' },
  ],
  correctOrder: ['s1', 's2', 's3', 's4', 's5'],
}

export const sequenzdiagrammExercises = [
  nachrichtenTypSchnelltrainer,
  rueckantwortVervollstaendiger,
  szenarioZuSequenzBuilder,
  reihenfolgePuzzle,
]
