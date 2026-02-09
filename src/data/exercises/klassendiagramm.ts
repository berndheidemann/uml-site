import type {
  DecisionExercise,
  DragDropConnectorExercise,
  DragDropZuordnungExercise,
} from '../../types/index.ts'

export const kompositionAggregationEntscheider: DecisionExercise = {
  id: 'kd-decision-01',
  version: 1,
  title: 'Komposition oder Aggregation?',
  description: 'Entscheide für jedes TechStore-Szenario, ob es sich um eine Komposition oder Aggregation handelt. Wähle die passende Begründung anhand der drei Kriterien.',
  diagramType: 'klassendiagramm',
  exerciseType: 'decision',
  level: 1,
  maxPoints: 5,
  hints: [
    'Komposition: Existenzabhängigkeit + exklusive Zugehörigkeit + keine Herausgabe',
    'Aggregation: Teil kann ohne Ganzes existieren, kann zu mehreren Ganzen gehören',
    'Bei Komposition ist die Multiplizität am Ganzen immer 1',
  ],
  scenarios: [
    {
      id: 'bestellung-bestellposition',
      description: 'Eine Bestellung enthält Bestellpositionen. Wenn eine Bestellung gelöscht wird, werden auch alle zugehörigen Bestellpositionen gelöscht. Eine Bestellposition gehört immer zu genau einer Bestellung und wird nicht an andere Objekte weitergegeben.',
      options: [
        { id: 'komposition', text: 'Komposition', explanation: 'Richtig! Bestellpositionen sind existenzabhängig, exklusiv zugehörig und werden nicht herausgegeben.' },
        { id: 'aggregation', text: 'Aggregation', explanation: 'Falsch. Da die Bestellposition nicht ohne die Bestellung existiert und exklusiv zugehörig ist, handelt es sich um eine Komposition.' },
      ],
      correctOptionId: 'komposition',
      criteria: [
        { id: 'existenz', label: 'Existenzabhängigkeit?', correctId: 'ja' },
        { id: 'exklusiv', label: 'Exklusive Zugehörigkeit?', correctId: 'ja' },
        { id: 'herausgabe', label: 'Keine Herausgabe?', correctId: 'ja' },
      ],
    },
    {
      id: 'warenkorb-produkt',
      description: 'Ein Warenkorb enthält Produkte. Produkte existieren auch ohne den Warenkorb (sie sind im Produktkatalog). Ein Produkt kann in mehreren Warenkörben gleichzeitig sein.',
      options: [
        { id: 'komposition', text: 'Komposition', explanation: 'Falsch. Produkte existieren unabhängig vom Warenkorb und können in mehreren Warenkörben sein.' },
        { id: 'aggregation', text: 'Aggregation', explanation: 'Richtig! Produkte existieren unabhängig und können zu mehreren Warenkörben gehören.' },
      ],
      correctOptionId: 'aggregation',
      criteria: [
        { id: 'existenz', label: 'Existenzabhängigkeit?', correctId: 'nein' },
        { id: 'exklusiv', label: 'Exklusive Zugehörigkeit?', correctId: 'nein' },
        { id: 'herausgabe', label: 'Keine Herausgabe?', correctId: 'nein' },
      ],
    },
    {
      id: 'rechnung-rechnungsposten',
      description: 'Eine Rechnung enthält Rechnungsposten. Rechnungsposten existieren nicht ohne die Rechnung. Ein Rechnungsposten gehört immer zu genau einer Rechnung und wird nicht separat weitergegeben.',
      options: [
        { id: 'komposition', text: 'Komposition', explanation: 'Richtig! Rechnungsposten gehen vollständig in der Rechnung auf.' },
        { id: 'aggregation', text: 'Aggregation', explanation: 'Falsch. Rechnungsposten sind existenzabhängig und exklusiv — das ist eine Komposition.' },
      ],
      correctOptionId: 'komposition',
    },
    {
      id: 'abteilung-mitarbeiter',
      description: 'Eine Abteilung hat Mitarbeiter. Mitarbeiter existieren auch ohne die Abteilung (z.B. beim Wechsel). Ein Mitarbeiter kann potenziell mehreren Projekten/Abteilungen zugeordnet sein.',
      options: [
        { id: 'komposition', text: 'Komposition', explanation: 'Falsch. Mitarbeiter existieren unabhängig von der Abteilung.' },
        { id: 'aggregation', text: 'Aggregation', explanation: 'Richtig! Mitarbeiter existieren unabhängig und können die Abteilung wechseln.' },
      ],
      correctOptionId: 'aggregation',
    },
    {
      id: 'gui-fenster-button',
      description: 'Ein Fenster der TechStore-Anwendung enthält Buttons. Wenn das Fenster geschlossen (zerstört) wird, werden auch alle Buttons darin zerstört. Buttons gehören exklusiv zu ihrem Fenster.',
      options: [
        { id: 'komposition', text: 'Komposition', explanation: 'Richtig! Buttons sind existenzabhängig vom Fenster, exklusiv zugehörig und werden nicht herausgegeben.' },
        { id: 'aggregation', text: 'Aggregation', explanation: 'Falsch. Da die Buttons mit dem Fenster zerstört werden und exklusiv zugehörig sind, ist es eine Komposition.' },
      ],
      correctOptionId: 'komposition',
    },
  ],
}

export const multiplizitaetenEditor: DragDropConnectorExercise = {
  id: 'kd-connector-01',
  version: 1,
  title: 'Multiplizitäten-Editor',
  description: 'Ordne die korrekten Multiplizitäten den Assoziationsenden im TechStore-Klassendiagramm zu.',
  diagramType: 'klassendiagramm',
  exerciseType: 'drag-drop-connector',
  level: 2,
  maxPoints: 8,
  hints: [
    'Leserichtung: Vom gegenüberliegenden Ende her lesen. „Ein Kunde hat 0..* Bestellungen"',
    'Bei Komposition ist die Multiplizität am Ganzen immer 1',
    'Frage dich: Wie viele Objekte der einen Klasse können mit einem Objekt der anderen Klasse verbunden sein?',
  ],
  items: [
    { id: 'mult-1', content: '1' },
    { id: 'mult-0-star', content: '0..*' },
    { id: 'mult-1-star', content: '1..*' },
    { id: 'mult-0-1', content: '0..1' },
    { id: 'mult-1-b', content: '1' },
    { id: 'mult-0-star-b', content: '0..*' },
    { id: 'mult-1-c', content: '1' },
    { id: 'mult-1-star-b', content: '1..*' },
  ],
  positions: [
    { id: 'kunde-seite', label: 'Kunde-Seite (Kunde—Bestellung)', x: 180, y: 70 },
    { id: 'bestellung-seite', label: 'Bestellung-Seite (Kunde—Bestellung)', x: 290, y: 70 },
    { id: 'bestellung-komp-seite', label: 'Bestellung-Seite (Bestellung—Bestellposition)', x: 430, y: 70 },
    { id: 'bestellposition-seite', label: 'Bestellposition-Seite (Bestellung—Bestellposition)', x: 540, y: 70 },
    { id: 'bestellposition-prod-seite', label: 'Bestellposition-Seite (Bestellposition—Produkt)', x: 590, y: 140 },
    { id: 'produkt-seite', label: 'Produkt-Seite (Bestellposition—Produkt)', x: 590, y: 200 },
    { id: 'warenkorb-seite', label: 'Warenkorb-Seite (Warenkorb—Produkt)', x: 180, y: 230 },
    { id: 'produkt-wk-seite', label: 'Produkt-Seite (Warenkorb—Produkt)', x: 290, y: 230 },
  ],
  correctMapping: {
    'mult-1': 'kunde-seite',
    'mult-0-star': 'bestellung-seite',
    'mult-1-b': 'bestellung-komp-seite',
    'mult-1-star': 'bestellposition-seite',
    'mult-0-star-b': 'bestellposition-prod-seite',
    'mult-1-c': 'produkt-seite',
    'mult-0-1': 'warenkorb-seite',
    'mult-1-star-b': 'produkt-wk-seite',
  },
}

export const klassenVerteilung: DragDropZuordnungExercise = {
  id: 'kd-zuordnung-01',
  version: 1,
  title: 'Klassen-Verteilung',
  description: 'Ordne die Attribute und Methoden den korrekten Klassen in der Vererbungshierarchie zu. Überlege, welche Member in der Superklasse „Mitarbeiter" und welche in den Subklassen „Lagerist" und „Kundenberater" liegen sollten.',
  diagramType: 'klassendiagramm',
  exerciseType: 'drag-drop-zuordnung',
  level: 2,
  maxPoints: 8,
  hints: [
    'Gemeinsame Attribute und Methoden gehören in die Superklasse',
    'Spezifische Attribute/Methoden gehören in die jeweilige Subklasse',
    'Die Superklasse enthält das, was ALLE Mitarbeiter gemeinsam haben',
  ],
  items: [
    { id: 'attr-name', content: '- name : String' },
    { id: 'attr-personalnr', content: '- personalNr : int' },
    { id: 'attr-email', content: '- email : String' },
    { id: 'attr-lagerbereich', content: '- lagerbereich : String' },
    { id: 'attr-fachgebiet', content: '- fachgebiet : String' },
    { id: 'meth-getmail', content: '+ getMail() : String' },
    { id: 'meth-einlagern', content: '+ einlagern(produkt : Produkt) : void' },
    { id: 'meth-beraten', content: '+ berateKunde(kunde : Kunde) : void' },
  ],
  zones: [
    { id: 'mitarbeiter', label: 'Mitarbeiter (Superklasse)' },
    { id: 'lagerist', label: 'Lagerist (Subklasse)' },
    { id: 'kundenberater', label: 'Kundenberater (Subklasse)' },
  ],
  correctMapping: {
    'attr-name': 'mitarbeiter',
    'attr-personalnr': 'mitarbeiter',
    'attr-email': 'mitarbeiter',
    'attr-lagerbereich': 'lagerist',
    'attr-fachgebiet': 'kundenberater',
    'meth-getmail': 'mitarbeiter',
    'meth-einlagern': 'lagerist',
    'meth-beraten': 'kundenberater',
  },
}

export const beziehungsConnector: DragDropConnectorExercise = {
  id: 'kd-connector-02',
  version: 1,
  title: 'Beziehungs-Connector',
  description: 'Wähle für jedes Klassenpaar die korrekte Beziehungsart aus dem TechStore-Datenmodell.',
  diagramType: 'klassendiagramm',
  exerciseType: 'drag-drop-connector',
  level: 2,
  maxPoints: 5,
  hints: [
    'Vererbung = "ist ein" (is-a): PKW ist ein Fahrzeug',
    'Komposition = Teil kann nicht ohne Ganzes existieren, exklusive Zugehörigkeit',
    'Aggregation = Teil kann ohne Ganzes existieren',
    'Assoziation = "kennt" / "nutzt"',
  ],
  items: [
    { id: 'bez-firma-abteilung', content: 'Firma — Abteilung' },
    { id: 'bez-abteilung-mitarbeiter', content: 'Abteilung — Mitarbeiter' },
    { id: 'bez-mitarbeiter-lagerist', content: 'Mitarbeiter — Lagerist' },
    { id: 'bez-bestellung-bestellposition', content: 'Bestellung — Bestellposition' },
    { id: 'bez-mitarbeiter-projekt', content: 'Mitarbeiter — Projekt' },
  ],
  positions: [
    { id: 'komposition', label: 'Komposition', x: 0, y: 0 },
    { id: 'aggregation', label: 'Aggregation', x: 0, y: 0 },
    { id: 'vererbung', label: 'Vererbung', x: 0, y: 0 },
    { id: 'assoziation', label: 'Assoziation', x: 0, y: 0 },
  ],
  correctMapping: {
    'bez-firma-abteilung': 'komposition',
    'bez-abteilung-mitarbeiter': 'aggregation',
    'bez-mitarbeiter-lagerist': 'vererbung',
    'bez-bestellung-bestellposition': 'komposition',
    'bez-mitarbeiter-projekt': 'assoziation',
  },
}

export const klassendiagrammExercises = [
  kompositionAggregationEntscheider,
  multiplizitaetenEditor,
  klassenVerteilung,
  beziehungsConnector,
]
