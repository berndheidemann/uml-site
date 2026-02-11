import type {
  DragDropZuordnungExercise,
  GuardEvaluatorExercise,
  SimulatorExercise,
} from '../../types/index.ts'

export const entryExitZuordner: DragDropZuordnungExercise = {
  id: 'zd-zuordnung-01',
  version: 2,
  title: 'Entry/Exit-Zuordner',
  description: 'Ordne die Aktionen den korrekten Positionen (entry, do, exit) im richtigen Zustand des Paketdienst-Zustandsautomaten zu.',
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
    { id: 'a1', content: 'entry / scanneBarcode()' },
    { id: 'a2', content: 'do / pruefeAdresse()' },
    { id: 'a3', content: 'entry / ladeFahrzeug()' },
    { id: 'a4', content: 'do / ueberwacheGPS()' },
    { id: 'a5', content: 'exit / benachrichtigeEmpfaenger()' },
    { id: 'a6', content: 'entry / erstelleZustellprotokoll()' },
  ],
  zones: [
    { id: 'angenommen-entry', label: 'Angenommen — entry' },
    { id: 'angenommen-do', label: 'Angenommen — do' },
    { id: 'inzustellung-entry', label: 'InZustellung — entry' },
    { id: 'inzustellung-do', label: 'InZustellung — do' },
    { id: 'inzustellung-exit', label: 'InZustellung — exit' },
    { id: 'zugestellt-entry', label: 'Zugestellt — entry' },
  ],
  correctMapping: {
    'a1': 'angenommen-entry',
    'a2': 'angenommen-do',
    'a3': 'inzustellung-entry',
    'a4': 'inzustellung-do',
    'a5': 'inzustellung-exit',
    'a6': 'zugestellt-entry',
  },
}

export const guardEvaluator: GuardEvaluatorExercise = {
  id: 'zd-guard-01',
  version: 2,
  title: 'Guard-Evaluator',
  description: 'Stelle die Variable "anzahlAutos" ein und bestimme, welche Transition im Parkhaus-Zustandsautomaten feuert. Die Kapazität des Parkhauses beträgt 200 Stellplätze.',
  diagramType: 'zustandsdiagramm',
  exerciseType: 'guard-evaluator',
  level: 2,
  maxPoints: 4,
  hints: [
    'Ein Guard in eckigen Klammern muss TRUE sein, damit die Transition feuert',
    'Prüfe den aktuellen Zustand — nur Transitionen, die von diesem Zustand ausgehen, kommen in Frage',
    'Die Kapazität des Parkhauses liegt bei 200 Autos',
    'Wenn kein Guard erfüllt ist, feuert keine Transition',
  ],
  states: [
    { id: 'frei', label: 'Frei', x: 100, y: 150 },
    { id: 'teilbelegt', label: 'Teilbelegt', x: 350, y: 150 },
    { id: 'voll', label: 'Voll', x: 600, y: 150 },
  ],
  transitions: [
    {
      id: 't-frei-teilbelegt',
      from: 'frei',
      to: 'teilbelegt',
      event: 'einfahren()',
      guard: '[anzahlAutos >= 1]',
      guardExpression: 'anzahlAutos >= 1',
      action: 'schrankeOeffnen()',
    },
    {
      id: 't-teilbelegt-voll',
      from: 'teilbelegt',
      to: 'voll',
      event: 'einfahren()',
      guard: '[anzahlAutos >= 200]',
      guardExpression: 'anzahlAutos >= 200',
      action: 'ampelAufRot()',
    },
    {
      id: 't-voll-teilbelegt',
      from: 'voll',
      to: 'teilbelegt',
      event: 'ausfahren()',
      guard: '[anzahlAutos < 200]',
      guardExpression: 'anzahlAutos < 200',
      action: 'ampelAufGruen()',
    },
  ],
  variables: [
    { name: 'anzahlAutos', type: 'number', min: 0, max: 500, defaultValue: 0 },
  ],
  scenarios: [
    { variableValues: { anzahlAutos: 5 }, currentState: 'frei', correctTransitionId: 't-frei-teilbelegt' },
    { variableValues: { anzahlAutos: 0 }, currentState: 'frei', correctTransitionId: null },
    { variableValues: { anzahlAutos: 200 }, currentState: 'teilbelegt', correctTransitionId: 't-teilbelegt-voll' },
    { variableValues: { anzahlAutos: 199 }, currentState: 'voll', correctTransitionId: 't-voll-teilbelegt' },
  ],
}

export const zustandsautomatSimulator: SimulatorExercise = {
  id: 'zd-simulator-01',
  version: 3,
  title: 'Zustandsautomat-Simulator',
  description: 'Bediene den Kaffeeautomat-Zustandsautomaten. Setze die Variablen, löse Ereignisse aus und beobachte die Zustandsübergänge. Versuche alle drei Aufgaben zu lösen!',
  diagramType: 'zustandsdiagramm',
  exerciseType: 'simulator',
  level: 3,
  maxPoints: 3,
  hints: [
    'Um ein Getränk zu kaufen, musst du zuerst ein Getränk wählen, dann genug Geld einwerfen (mindestens 2 Euro) und bezahlen.',
    'Ein Guard wie [guthaben >= 2] blockiert die Transition, wenn die Bedingung nicht erfüllt ist. Wirf erst genug Münzen ein!',
    'Der Wartungszustand wird ausgelöst, wenn bei der Zubereitung Wasserstand oder Bohnenvorrat zu niedrig sind. Passe die Variablen vor dem Brühvorgang an.',
    'Du kannst die Variablen wasserstand und bohnenVorrat mit den Schiebereglern anpassen, um verschiedene Szenarien zu testen.',
  ],
  states: [
    { id: 'bereit', label: 'Bereit', x: 100, y: 250, isInitial: true, entryAction: 'displayWillkommen()' },
    { id: 'auswahl', label: 'Auswahl', x: 300, y: 150, doAction: 'menuAnzeigen()' },
    { id: 'bezahlung', label: 'Bezahlung', x: 300, y: 350, doAction: 'guthabenAnzeigen()' },
    { id: 'zubereitung', label: 'Zubereitung', x: 550, y: 150, entryAction: 'tassePositionieren()', doAction: 'bruehen()' },
    { id: 'ausgabe', label: 'Ausgabe', x: 550, y: 350, entryAction: 'signalTon()' },
    { id: 'wartung', label: 'Wartung', x: 750, y: 250 },
  ],
  transitions: [
    { id: 't1', from: 'bereit', to: 'auswahl', event: 'getraenkWaehlen()' },
    { id: 't2', from: 'auswahl', to: 'bezahlung', event: 'bestaetigen()' },
    { id: 't3', from: 'auswahl', to: 'bereit', event: 'abbrechen()' },
    { id: 't4', from: 'bezahlung', to: 'bezahlung', event: 'muenzeEinwerfen()', action: 'guthabenErhoehen()', variableUpdates: { guthaben: 'guthaben + 1' } },
    { id: 't5', from: 'bezahlung', to: 'zubereitung', event: 'bezahlen()', guard: '[guthaben >= 2]', guardExpression: 'guthaben >= 2' },
    { id: 't6', from: 'bezahlung', to: 'bezahlung', event: 'bezahlen()', guard: '[guthaben < 2]', guardExpression: 'guthaben < 2', action: "fehlermeldung('Zu wenig Guthaben')" },
    { id: 't7', from: 'bezahlung', to: 'bereit', event: 'abbrechen()', action: 'geldZurueckgeben()', variableUpdates: { guthaben: '0' } },
    { id: 't8', from: 'zubereitung', to: 'ausgabe', event: 'bruehvorgangFertig()', guard: '[wasserstand > 10 && bohnenVorrat > 5]', guardExpression: 'wasserstand > 10 && bohnenVorrat > 5', variableUpdates: { wasserstand: 'wasserstand - 15', bohnenVorrat: 'bohnenVorrat - 10' } },
    { id: 't9', from: 'zubereitung', to: 'wartung', event: 'bruehvorgangFertig()', guard: '[wasserstand <= 10 || bohnenVorrat <= 5]', guardExpression: 'wasserstand <= 10 || bohnenVorrat <= 5' },
    { id: 't10', from: 'ausgabe', to: 'bereit', event: 'becherEntnehmen()', variableUpdates: { guthaben: '0' } },
    { id: 't11', from: 'wartung', to: 'bereit', event: 'nachfuellen()', variableUpdates: { wasserstand: '100', bohnenVorrat: '100' } },
  ],
  variables: [
    { name: 'guthaben', type: 'number', min: 0, max: 10, defaultValue: 0 },
    { name: 'wasserstand', type: 'number', min: 0, max: 100, defaultValue: 80 },
    { name: 'bohnenVorrat', type: 'number', min: 0, max: 100, defaultValue: 70 },
  ],
}

export const zustandsdiagrammExercises = [
  entryExitZuordner,
  guardEvaluator,
  zustandsautomatSimulator,
]
