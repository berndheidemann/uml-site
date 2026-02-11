import type {
  TimedChallengeExercise,
  DragDropSortierungExercise,
  DragDropZuordnungExercise,
} from '../../types/index.ts'

export const nachrichtenTypSchnelltrainer: TimedChallengeExercise = {
  id: 'sd-timed-01',
  version: 2,
  title: 'Nachrichten-Typ-Schnelltrainer',
  description: 'Erkenne unter Zeitdruck den korrekten Nachrichtentyp anhand des angezeigten Pfeils. Synchron, asynchron oder Rückantwort? Szenario: Ein Geldautomat verarbeitet eine Abhebung.',
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
      svgContent: '<line x1="30" y1="30" x2="250" y2="30" stroke="#1e293b" stroke-width="2"/><polygon points="250,30 238,24 238,36" fill="#1e293b"/><text x="140" y="22" text-anchor="middle" font-size="11" fill="#1e293b">pinPruefen(pin)</text>',
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
      svgContent: '<line x1="30" y1="30" x2="250" y2="30" stroke="#1e293b" stroke-width="2" stroke-dasharray="8,4"/><line x1="250" y1="30" x2="238" y2="24" stroke="#1e293b" stroke-width="2"/><line x1="250" y1="30" x2="238" y2="36" stroke="#1e293b" stroke-width="2"/><text x="140" y="22" text-anchor="middle" font-size="11" fill="#1e293b">pinGueltig</text>',
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
      svgContent: '<line x1="30" y1="30" x2="250" y2="30" stroke="#1e293b" stroke-width="2"/><polygon points="250,30 238,24 238,36" fill="#1e293b"/><text x="140" y="22" text-anchor="middle" font-size="11" fill="#1e293b">kontostandAbfragen()</text>',
      question: 'Welcher Nachrichtentyp ist das?',
      options: [
        { id: 'sync', text: 'Synchron' },
        { id: 'async', text: 'Asynchron' },
        { id: 'return', text: 'Rückantwort' },
      ],
      correctOptionId: 'sync',
    },
    {
      id: 'q4',
      svgContent: '<line x1="30" y1="30" x2="250" y2="30" stroke="#1e293b" stroke-width="2" stroke-dasharray="8,4"/><line x1="250" y1="30" x2="238" y2="24" stroke="#1e293b" stroke-width="2"/><line x1="250" y1="30" x2="238" y2="36" stroke="#1e293b" stroke-width="2"/><text x="140" y="22" text-anchor="middle" font-size="11" fill="#1e293b">kontostand</text>',
      question: 'Welcher Nachrichtentyp ist das?',
      options: [
        { id: 'sync', text: 'Synchron' },
        { id: 'async', text: 'Asynchron' },
        { id: 'return', text: 'Rückantwort' },
      ],
      correctOptionId: 'return',
    },
    {
      id: 'q5',
      svgContent: '<line x1="30" y1="30" x2="250" y2="30" stroke="#1e293b" stroke-width="2"/><polygon points="250,30 238,24 238,36" fill="#1e293b"/><text x="140" y="22" text-anchor="middle" font-size="11" fill="#1e293b">geldAuszahlen(betrag)</text>',
      question: 'Welcher Nachrichtentyp ist das?',
      options: [
        { id: 'sync', text: 'Synchron' },
        { id: 'async', text: 'Asynchron' },
        { id: 'return', text: 'Rückantwort' },
      ],
      correctOptionId: 'sync',
    },
    {
      id: 'q6',
      svgContent: '<line x1="30" y1="30" x2="250" y2="30" stroke="#1e293b" stroke-width="2"/><line x1="250" y1="30" x2="238" y2="24" stroke="#1e293b" stroke-width="2"/><line x1="250" y1="30" x2="238" y2="36" stroke="#1e293b" stroke-width="2"/><text x="140" y="22" text-anchor="middle" font-size="11" fill="#1e293b">quittungDrucken()</text>',
      question: 'Welcher Nachrichtentyp ist das?',
      options: [
        { id: 'sync', text: 'Synchron' },
        { id: 'async', text: 'Asynchron' },
        { id: 'return', text: 'Rückantwort' },
      ],
      correctOptionId: 'async',
    },
    {
      id: 'q7',
      svgContent: '<line x1="30" y1="30" x2="250" y2="30" stroke="#1e293b" stroke-width="2"/><line x1="250" y1="30" x2="238" y2="24" stroke="#1e293b" stroke-width="2"/><line x1="250" y1="30" x2="238" y2="36" stroke="#1e293b" stroke-width="2"/><text x="140" y="22" text-anchor="middle" font-size="11" fill="#1e293b">karteAusgeben()</text>',
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
      svgContent: '<line x1="30" y1="30" x2="250" y2="30" stroke="#1e293b" stroke-width="2" stroke-dasharray="8,4"/><line x1="250" y1="30" x2="238" y2="24" stroke="#1e293b" stroke-width="2"/><line x1="250" y1="30" x2="238" y2="36" stroke="#1e293b" stroke-width="2"/><text x="140" y="22" text-anchor="middle" font-size="11" fill="#1e293b">transaktionBestaetigt</text>',
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
  version: 2,
  title: 'Reihenfolge-Puzzle',
  description: 'Bringe die Nachrichten des Kinokarten-Kaufprozesses in die richtige Reihenfolge.',
  diagramType: 'sequenzdiagramm',
  exerciseType: 'drag-drop-sortierung',
  level: 2,
  maxPoints: 6,
  hints: [
    'Der Kunde startet den Prozess mit einer Suche auf der Kinowebseite',
    'Bevor bezahlt werden kann, muss ein Sitzplatz reserviert sein',
    'Rückantworten folgen immer auf den zugehörigen Aufruf',
  ],
  items: [
    { id: 'msg1', content: 'Kunde → Kinowebseite: filmSuchen(genre)' },
    { id: 'msg2', content: 'Kinowebseite ⤏ Kunde: filmlisteAnzeigen' },
    { id: 'msg3', content: 'Kunde → Saalplan: sitzplatzReservieren(reihe, platz)' },
    { id: 'msg4', content: 'Saalplan ⤏ Kunde: reservierungBestaetigt' },
    { id: 'msg5', content: 'Kunde → Zahlungssystem: bezahlen(betrag)' },
    { id: 'msg6', content: 'Zahlungssystem ⤏ Kunde: ticketErstellen' },
  ],
  correctOrder: ['msg1', 'msg2', 'msg3', 'msg4', 'msg5', 'msg6'],
}

export const rueckantwortVervollstaendiger: DragDropZuordnungExercise = {
  id: 'sd-zuordnung-01',
  version: 2,
  title: 'Rückantwort-Vervollständiger',
  description: 'Ordne die korrekten Rückantworten den synchronen Aufrufen zu. Szenario: In einer Pizzeria nimmt der Kellner Bestellungen entgegen, die Küche bereitet zu, der Pizzaofen backt und die Kasse rechnet ab.',
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
    { id: 'ret-bestellung', content: 'Kueche ⤏ Kellner: bestellungBestaetigt' },
    { id: 'ret-pizza', content: 'Pizzaofen ⤏ Kueche: pizzaFertig' },
    { id: 'ret-wechselgeld', content: 'Kasse ⤏ Kellner: wechselgeld' },
    { id: 'ret-lieferzeit', content: 'Kellner ⤏ Kunde: lieferzeit' },
  ],
  zones: [
    { id: 'call-bestellen', label: 'Kellner → Kueche: bestellungAufgeben(pizza)' },
    { id: 'call-backen', label: 'Kueche → Pizzaofen: pizzaBacken(sorte)' },
    { id: 'call-bezahlen', label: 'Kellner → Kasse: bezahlen(betrag)' },
    { id: 'call-auswaehlen', label: 'Kunde → Kellner: pizzaAuswaehlen(sorte)' },
  ],
  correctMapping: {
    'ret-bestellung': 'call-bestellen',
    'ret-pizza': 'call-backen',
    'ret-wechselgeld': 'call-bezahlen',
    'ret-lieferzeit': 'call-auswaehlen',
  },
}

export const szenarioZuSequenzBuilder: DragDropSortierungExercise = {
  id: 'sd-sort-02',
  version: 2,
  title: 'Szenario-zu-Sequenz-Builder',
  description: 'Lies das Szenario und bringe die Nachrichten in die richtige Reihenfolge, um das Sequenzdiagramm aufzubauen. Szenario: "Ein Patient ruft in der Arztpraxis an und fragt nach einem Termin. Die Rezeption prüft den Kalender (Selbstaufruf). Die Rezeption schlägt dem Arzt einen Termin vor. Der Arzt bestätigt den Termin. Die Rezeption teilt dem Patienten die Terminbestätigung mit."',
  diagramType: 'sequenzdiagramm',
  exerciseType: 'drag-drop-sortierung',
  level: 2,
  maxPoints: 5,
  hints: [
    'Beginne mit der Aktion des Patienten',
    'Die Rezeption ruft sich selbst auf (Selbstaufruf) für die Kalenderprüfung',
    'Nach jeder synchronen Nachricht kommt eine Rückantwort',
  ],
  items: [
    { id: 's1', content: 'Patient → Rezeption: terminAnfragen()' },
    { id: 's2', content: 'Rezeption → Rezeption: kalenderPruefen()' },
    { id: 's3', content: 'Rezeption → Arzt: terminVorschlagen(datum, uhrzeit)' },
    { id: 's4', content: 'Arzt ⤏ Rezeption: terminBestaetigt' },
    { id: 's5', content: 'Rezeption ⤏ Patient: terminBestaetigung' },
  ],
  correctOrder: ['s1', 's2', 's3', 's4', 's5'],
}

export const sequenzdiagrammExercises = [
  nachrichtenTypSchnelltrainer,
  rueckantwortVervollstaendiger,
  szenarioZuSequenzBuilder,
  reihenfolgePuzzle,
]
