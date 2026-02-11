import type {
  DecisionExercise,
  DragDropConnectorExercise,
  DragDropZuordnungExercise,
} from '../../types/index.ts'

export const kompositionAggregationEntscheider: DecisionExercise = {
  id: 'kd-decision-01',
  version: 2,
  title: 'Komposition oder Aggregation?',
  description: 'Entscheide für jedes Musikschul-Szenario, ob es sich um eine Komposition oder Aggregation handelt. Wähle die passende Begründung anhand der drei Kriterien.',
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
      id: 'kurs-unterrichtsstunde',
      description: 'Ein Kurs enthält Unterrichtsstunden. Wenn ein Kurs aufgelöst wird, existieren die zugehörigen Unterrichtsstunden nicht mehr — sie sind fest an diesen Kurs gebunden. Eine Unterrichtsstunde gehört immer zu genau einem Kurs und wird nicht an andere Kurse weitergegeben.',
      options: [
        { id: 'komposition', text: 'Komposition', explanation: 'Richtig! Unterrichtsstunden sind existenzabhängig vom Kurs, exklusiv zugehörig und werden nicht herausgegeben.' },
        { id: 'aggregation', text: 'Aggregation', explanation: 'Falsch. Da die Unterrichtsstunde nicht ohne den Kurs existiert und exklusiv zugehörig ist, handelt es sich um eine Komposition.' },
      ],
      correctOptionId: 'komposition',
      criteria: [
        { id: 'existenz', label: 'Existenzabhängigkeit?', correctId: 'ja' },
        { id: 'exklusiv', label: 'Exklusive Zugehörigkeit?', correctId: 'ja' },
        { id: 'herausgabe', label: 'Keine Herausgabe?', correctId: 'ja' },
      ],
    },
    {
      id: 'orchester-musiker',
      description: 'Ein Orchester besteht aus Musikern. Musiker existieren auch ohne das Orchester — sie können freiberuflich auftreten oder in mehreren Ensembles spielen. Ein Musiker kann das Orchester verlassen und weiterhin als Musiker tätig sein.',
      options: [
        { id: 'komposition', text: 'Komposition', explanation: 'Falsch. Musiker existieren unabhängig vom Orchester und können in mehreren Ensembles mitwirken.' },
        { id: 'aggregation', text: 'Aggregation', explanation: 'Richtig! Musiker existieren unabhängig und können zu mehreren Ensembles gehören.' },
      ],
      correctOptionId: 'aggregation',
      criteria: [
        { id: 'existenz', label: 'Existenzabhängigkeit?', correctId: 'nein' },
        { id: 'exklusiv', label: 'Exklusive Zugehörigkeit?', correctId: 'nein' },
        { id: 'herausgabe', label: 'Keine Herausgabe?', correctId: 'nein' },
      ],
    },
    {
      id: 'partitur-note',
      description: 'Eine Partitur enthält Noten. Die einzelnen Noten existieren nur im Kontext dieser Partitur — ohne die Partitur haben sie keine eigenständige Bedeutung. Jede Note gehört exklusiv zu einer Partitur und wird nicht an andere Partituren weitergegeben.',
      options: [
        { id: 'komposition', text: 'Komposition', explanation: 'Richtig! Noten sind existenzabhängig von der Partitur, exklusiv zugehörig und werden nicht herausgegeben.' },
        { id: 'aggregation', text: 'Aggregation', explanation: 'Falsch. Noten existieren nicht ohne die Partitur und sind exklusiv zugehörig — das ist eine Komposition.' },
      ],
      correctOptionId: 'komposition',
    },
    {
      id: 'musikschule-lehrer',
      description: 'Eine Musikschule beschäftigt Lehrer. Lehrer existieren auch ohne die Musikschule — sie können privat unterrichten oder an einer anderen Musikschule arbeiten. Ein Lehrer kann die Musikschule verlassen und weiterhin als Lehrer tätig sein.',
      options: [
        { id: 'komposition', text: 'Komposition', explanation: 'Falsch. Lehrer existieren unabhängig von der Musikschule und können auch anderswo unterrichten.' },
        { id: 'aggregation', text: 'Aggregation', explanation: 'Richtig! Lehrer existieren unabhängig und können die Musikschule wechseln oder an mehreren Schulen unterrichten.' },
      ],
      correctOptionId: 'aggregation',
    },
    {
      id: 'band-auftritt',
      description: 'Eine Band hat Auftritte. Ein Auftritt existiert nur im Kontext dieser Band — ohne die Band gibt es den Auftritt nicht. Jeder Auftritt gehört exklusiv zu einer Band und wird nicht an eine andere Band übertragen.',
      options: [
        { id: 'komposition', text: 'Komposition', explanation: 'Richtig! Auftritte sind existenzabhängig von der Band, exklusiv zugehörig und werden nicht herausgegeben.' },
        { id: 'aggregation', text: 'Aggregation', explanation: 'Falsch. Da der Auftritt ohne die Band nicht existiert und exklusiv zu ihr gehört, ist es eine Komposition.' },
      ],
      correctOptionId: 'komposition',
    },
  ],
}

export const klassenVerteilung: DragDropZuordnungExercise = {
  id: 'kd-zuordnung-01',
  version: 3,
  title: 'Klassen-Verteilung',
  description: 'Ordne die Attribute und Methoden den korrekten Klassen in der Vererbungshierarchie zu. Überlege, welche Member in der Superklasse „Tier" und welche in den Subklassen „Hund" und „Katze" liegen sollten.',
  diagramType: 'klassendiagramm',
  exerciseType: 'drag-drop-zuordnung',
  level: 2,
  maxPoints: 9,
  hints: [
    'Gemeinsame Attribute und Methoden gehören in die Superklasse',
    'Spezifische Attribute/Methoden gehören in die jeweilige Subklasse',
    'Die Superklasse enthält das, was ALLE Tiere gemeinsam haben',
  ],
  items: [
    { id: 'attr-name', content: '- name : String' },
    { id: 'attr-geburtsdatum', content: '- geburtsdatum : Date' },
    { id: 'attr-rasse', content: '- rasse : String' },
    { id: 'attr-felllaenge', content: '- felllaenge : double' },
    { id: 'attr-leinenpflichtig', content: '- istLeinenpflichtig : boolean' },
    { id: 'attr-freigaenger', content: '- istFreigaenger : boolean' },
    { id: 'meth-getname', content: '+ getName() : String' },
    { id: 'meth-bellen', content: '+ bellen() : void' },
    { id: 'meth-schnurren', content: '+ schnurren() : void' },
  ],
  zones: [
    { id: 'tier', label: 'Tier (Superklasse)' },
    { id: 'hund', label: 'Hund (Subklasse)' },
    { id: 'katze', label: 'Katze (Subklasse)' },
  ],
  correctMapping: {
    'attr-name': 'tier',
    'attr-geburtsdatum': 'tier',
    'attr-rasse': 'tier',
    'attr-felllaenge': 'tier',
    'attr-leinenpflichtig': 'hund',
    'attr-freigaenger': 'katze',
    'meth-getname': 'tier',
    'meth-bellen': 'hund',
    'meth-schnurren': 'katze',
  },
}

export const beziehungsConnector: DragDropConnectorExercise = {
  id: 'kd-connector-02',
  version: 3,
  title: 'Beziehungs-Connector',
  description: 'Wähle für jedes Klassenpaar die korrekte Beziehungsart. Überlege, ob es sich um Komposition, Aggregation, Vererbung oder eine einfache Assoziation handelt.',
  diagramType: 'klassendiagramm',
  exerciseType: 'drag-drop-connector',
  level: 2,
  maxPoints: 5,
  hints: [
    'Vererbung = "ist ein" (is-a): PKW ist ein Fahrzeug',
    'Komposition = Teil kann nicht ohne Ganzes existieren und gehört exklusiv dazu',
    'Aggregation = Teil kann auch ohne das Ganze existieren',
    'Assoziation = "kennt" / "nutzt" — keine Besitzbeziehung',
  ],
  items: [
    { id: 'bez-haus-raum', content: 'Haus — Raum' },
    { id: 'bez-orchester-musiker', content: 'Orchester — Musiker' },
    { id: 'bez-fahrzeug-pkw', content: 'Fahrzeug — PKW' },
    { id: 'bez-rechnung-position', content: 'Rechnung — Rechnungsposition' },
    { id: 'bez-lehrer-fach', content: 'Lehrer — Fach' },
  ],
  positions: [
    { id: 'komposition', label: 'Komposition', x: 0, y: 0 },
    { id: 'aggregation', label: 'Aggregation', x: 0, y: 0 },
    { id: 'vererbung', label: 'Vererbung', x: 0, y: 0 },
    { id: 'assoziation', label: 'Assoziation', x: 0, y: 0 },
  ],
  correctMapping: {
    'bez-haus-raum': 'komposition',
    'bez-orchester-musiker': 'aggregation',
    'bez-fahrzeug-pkw': 'vererbung',
    'bez-rechnung-position': 'komposition',
    'bez-lehrer-fach': 'assoziation',
  },
}

export const klassendiagrammExercises = [
  kompositionAggregationEntscheider,
  klassenVerteilung,
  beziehungsConnector,
]
