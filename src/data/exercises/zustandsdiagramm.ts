import type {
  DragDropZuordnungExercise,
  GuardEvaluatorExercise,
  SimulatorExercise,
} from '../../types/index.ts'

export const entryExitZuordner: DragDropZuordnungExercise = {
  id: 'zd-zuordnung-01',
  version: 1,
  title: 'Entry/Exit-Zuordner',
  description: 'Ordne die Aktionen den korrekten Positionen (entry, do, exit) im richtigen Zustand der TechStore-Bestellung zu.',
  diagramType: 'zustandsdiagramm',
  exerciseType: 'drag-drop-zuordnung',
  level: 1,
  maxPoints: 6,
  hints: [
    'entry-Aktionen werden beim Betreten eines Zustands ausgeführt',
    'do-Aktionen laufen während der gesamten Dauer des Zustands',
    'exit-Aktionen werden beim Verlassen eines Zustands ausgeführt',
  ],
  items: [
    { id: 'a1', content: 'entry / reserviereWare()' },
    { id: 'a2', content: 'do / aktualisiereStatus()' },
    { id: 'a3', content: 'exit / benachrichtigeVersand()' },
    { id: 'a4', content: 'entry / sendeZahlungslink()' },
    { id: 'a5', content: 'exit / erstelleRechnung()' },
    { id: 'a6', content: 'entry / erstelleVersandlabel()' },
  ],
  zones: [
    { id: 'inbearbeitung-entry', label: 'InBearbeitung — entry' },
    { id: 'inbearbeitung-do', label: 'InBearbeitung — do' },
    { id: 'inbearbeitung-exit', label: 'InBearbeitung — exit' },
    { id: 'zahlungoffen-entry', label: 'ZahlungOffen — entry' },
    { id: 'zahlungoffen-exit', label: 'ZahlungOffen — exit' },
    { id: 'versendet-entry', label: 'Versendet — entry' },
  ],
  correctMapping: {
    'a1': 'inbearbeitung-entry',
    'a2': 'inbearbeitung-do',
    'a3': 'inbearbeitung-exit',
    'a4': 'zahlungoffen-entry',
    'a5': 'zahlungoffen-exit',
    'a6': 'versendet-entry',
  },
}

export const guardEvaluator: GuardEvaluatorExercise = {
  id: 'zd-guard-01',
  version: 1,
  title: 'Guard-Evaluator',
  description: 'Stelle die Variable "anzahlBestellungen" ein und bestimme, welche Transition im Kundenkonto-Zustandsautomaten feuert.',
  diagramType: 'zustandsdiagramm',
  exerciseType: 'guard-evaluator',
  level: 2,
  maxPoints: 4,
  hints: [
    'Ein Guard in eckigen Klammern muss TRUE sein, damit die Transition feuert',
    'Prüfe den aktuellen Zustand — nur Transitionen, die von diesem Zustand ausgehen, kommen in Frage',
    'Wenn kein Guard erfüllt ist, feuert keine Transition',
  ],
  states: [
    { id: 'bronze', label: 'Bronze', x: 100, y: 150 },
    { id: 'silber', label: 'Silber', x: 350, y: 150 },
    { id: 'gold', label: 'Gold', x: 600, y: 150 },
  ],
  transitions: [
    {
      id: 't-bronze-silber',
      from: 'bronze',
      to: 'silber',
      event: 'bestellen()',
      guard: '[anzahlBestellungen >= 10]',
      guardExpression: 'anzahlBestellungen >= 10',
      action: 'hochstufen()',
    },
    {
      id: 't-silber-gold',
      from: 'silber',
      to: 'gold',
      event: 'bestellen()',
      guard: '[anzahlBestellungen >= 50]',
      guardExpression: 'anzahlBestellungen >= 50',
      action: 'hochstufen()',
    },
    {
      id: 't-gold-silber',
      from: 'gold',
      to: 'silber',
      event: 'reklamieren()',
      guard: '[anzahlReklamationen >= 5]',
      guardExpression: 'anzahlReklamationen >= 5',
      action: 'herabstufen()',
    },
  ],
  variables: [
    { name: 'anzahlBestellungen', type: 'number', min: 0, max: 100, defaultValue: 0 },
    { name: 'anzahlReklamationen', type: 'number', min: 0, max: 10, defaultValue: 0 },
  ],
  scenarios: [
    { variableValues: { anzahlBestellungen: 12, anzahlReklamationen: 0 }, currentState: 'bronze', correctTransitionId: 't-bronze-silber' },
    { variableValues: { anzahlBestellungen: 8, anzahlReklamationen: 0 }, currentState: 'bronze', correctTransitionId: null },
    { variableValues: { anzahlBestellungen: 55, anzahlReklamationen: 0 }, currentState: 'silber', correctTransitionId: 't-silber-gold' },
    { variableValues: { anzahlBestellungen: 60, anzahlReklamationen: 6 }, currentState: 'gold', correctTransitionId: 't-gold-silber' },
  ],
}

export const zustandsautomatSimulator: SimulatorExercise = {
  id: 'zd-simulator-01',
  version: 1,
  title: 'Zustandsautomat-Simulator',
  description: 'Spiele den Bestellungs-Zustandsautomaten des TechStore durch. Löse Ereignisse aus und beobachte, wie sich Zustände und Variablen ändern. Guards werden anhand der aktuellen Werte ausgewertet.',
  diagramType: 'zustandsdiagramm',
  exerciseType: 'simulator',
  level: 3,
  maxPoints: 10,
  hints: [
    'Der Guard [fehlversucheZahlung >= 3] blockiert den normalen Zahlungspfad nach 3 Fehlversuchen',
    'Beobachte die Variable fehlversucheZahlung — sie zählt bei jedem fehlgeschlagenen Zahlungsversuch hoch',
    'Vom Anfangszustand gibt es genau eine Transition ohne Ereignis',
  ],
  states: [
    { id: 'neu', label: 'Neu', x: 100, y: 200, isInitial: true },
    { id: 'zahlungOffen', label: 'ZahlungOffen', x: 300, y: 200 },
    { id: 'bezahlt', label: 'Bezahlt', x: 500, y: 100 },
    { id: 'inBearbeitung', label: 'InBearbeitung', x: 500, y: 300, entryAction: 'reserviereWare()', doAction: 'aktualisiereStatus()' },
    { id: 'versendet', label: 'Versendet', x: 700, y: 200, isFinal: false },
    { id: 'storniert', label: 'Storniert', x: 300, y: 400, isFinal: true },
  ],
  transitions: [
    { id: 't1', from: 'neu', to: 'zahlungOffen', event: 'bestellen()', action: 'sendeZahlungslink()' },
    { id: 't2', from: 'zahlungOffen', to: 'bezahlt', event: 'bezahlen()', guard: '[betragKorrekt]', guardExpression: 'betragKorrekt == true', action: 'sendeBestaetigung()', variableUpdates: {} },
    { id: 't3', from: 'zahlungOffen', to: 'zahlungOffen', event: 'bezahlen()', guard: '[!betragKorrekt && fehlversucheZahlung < 3]', guardExpression: 'betragKorrekt == false && fehlversucheZahlung < 3', action: 'sendeFehlermeldung()', variableUpdates: { fehlversucheZahlung: 'fehlversucheZahlung + 1' } },
    { id: 't4', from: 'zahlungOffen', to: 'storniert', event: 'bezahlen()', guard: '[fehlversucheZahlung >= 3]', guardExpression: 'fehlversucheZahlung >= 3', action: 'sendeStornierung()' },
    { id: 't5', from: 'bezahlt', to: 'inBearbeitung', event: 'bearbeiten()' },
    { id: 't6', from: 'inBearbeitung', to: 'versendet', event: 'versenden()', action: 'sendeTracking()' },
    { id: 't7', from: 'neu', to: 'storniert', event: 'stornieren()', action: 'sendeStornierung()' },
    { id: 't8', from: 'zahlungOffen', to: 'storniert', event: 'stornieren()', action: 'sendeStornierung()' },
  ],
  variables: [
    { name: 'fehlversucheZahlung', type: 'number', min: 0, max: 10, defaultValue: 0 },
    { name: 'betragKorrekt', type: 'boolean', defaultValue: true },
  ],
  expectedSequence: [
    { event: 'bestellen()', expectedState: 'zahlungOffen' },
    { event: 'bezahlen()', expectedState: 'bezahlt' },
    { event: 'bearbeiten()', expectedState: 'inBearbeitung' },
    { event: 'versenden()', expectedState: 'versendet' },
  ],
}

export const zustandsdiagrammExercises = [
  entryExitZuordner,
  guardEvaluator,
  zustandsautomatSimulator,
]
