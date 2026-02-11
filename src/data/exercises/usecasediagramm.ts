import type {
  MultipleChoiceExercise,
  TextExtractionExerciseData,
  DragDropZuordnungExercise,
} from '../../types/index.ts'

export const includeExtendSortierer: MultipleChoiceExercise = {
  id: 'uc-mc-01',
  version: 2,
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
  question: '„Kurs buchen" und „Bezahlen" — Der Buchungsprozess beinhaltet IMMER eine Bezahlung. Welche Beziehung liegt vor?',
  multiSelect: false,
  options: [
    {
      id: 'include',
      text: '<<include>> — „Kurs buchen" include „Bezahlen"',
      explanation: 'Richtig! Buchen geht nicht ohne Bezahlen — es ist immer dabei. Pfeil: Kurs buchen → Bezahlen.',
    },
    {
      id: 'extend',
      text: '<<extend>> — „Bezahlen" extend „Kurs buchen"',
      explanation: 'Falsch. Bezahlen ist nicht optional — es passiert immer bei einer Buchung. Merksatz: include = "immer dabei".',
    },
    {
      id: 'extend-falsch',
      text: '<<extend>> — „Personal Trainer buchen" extend „Kurs buchen"',
      explanation: 'Das wäre tatsächlich ein korrektes extend-Beispiel (Personal Trainer ist optional), aber es beantwortet nicht die gestellte Frage zur Beziehung zwischen Kurs buchen und Bezahlen.',
    },
  ],
  correctOptionIds: ['include'],
}

export const anforderungsExtraktor: TextExtractionExerciseData = {
  id: 'uc-text-01',
  version: 3,
  title: 'Anforderungs-Extraktor',
  description: 'Markiere die relevanten Textpassagen und ordne sie der richtigen Kategorie zu: Akteur, Use Case oder Irrelevant.',
  diagramType: 'usecasediagramm',
  exerciseType: 'text-extraction',
  level: 2,
  maxPoints: 10,
  hints: [
    'Akteure sind Personen oder externe Systeme, die mit dem System interagieren',
    'Use Cases beschreiben Funktionalitäten aus Nutzersicht (Verben/Tätigkeiten)',
    'Nicht alle Informationen im Text sind relevant für ein Use-Case-Diagramm — Hintergrundinfos wie Zahlen oder Firmendaten sind irrelevant',
  ],
  sourceText: 'Der Nutzer soll E-Scooter suchen und ausleihen können. Bei jeder Ausleihe muss per App bezahlt werden. Die Firma hat derzeit 200 E-Scooter im Einsatz. Ein Techniker wartet die Scooter und tauscht Akkus. Das externe GPS-System liefert Standortdaten. Administratoren verwalten die Preise und Geschäftszonen. Das Unternehmen wurde 2019 in Berlin gegründet.',
  phrases: [
    { id: 'p-nutzer', text: 'Nutzer', startIndex: 4, endIndex: 10, correctCategory: 'akteur' },
    { id: 'p-suchen', text: 'E-Scooter suchen', startIndex: 16, endIndex: 32, correctCategory: 'usecase' },
    { id: 'p-ausleihen', text: 'ausleihen', startIndex: 37, endIndex: 46, correctCategory: 'usecase' },
    { id: 'p-bezahlen', text: 'bezahlt', startIndex: 87, endIndex: 94, correctCategory: 'usecase' },
    { id: 'p-bestand', text: '200 E-Scooter im Einsatz', startIndex: 125, endIndex: 149, correctCategory: 'irrelevant' },
    { id: 'p-techniker', text: 'Techniker', startIndex: 155, endIndex: 164, correctCategory: 'akteur' },
    { id: 'p-warten', text: 'wartet die Scooter', startIndex: 165, endIndex: 183, correctCategory: 'usecase' },
    { id: 'p-gps', text: 'GPS-System', startIndex: 215, endIndex: 225, correctCategory: 'akteur' },
    { id: 'p-admin', text: 'Administratoren', startIndex: 249, endIndex: 264, correctCategory: 'akteur' },
    { id: 'p-gruendung', text: '2019 in Berlin gegründet', startIndex: 328, endIndex: 352, correctCategory: 'irrelevant' },
  ],
  categories: [
    { id: 'akteur', label: 'Akteur', color: '#2563eb' },
    { id: 'usecase', label: 'Use Case', color: '#16a34a' },
    { id: 'irrelevant', label: 'Irrelevant', color: '#94a3b8' },
  ],
}

export const systemgrenzeDebatte: DragDropZuordnungExercise = {
  id: 'uc-zuordnung-01',
  version: 2,
  title: 'Systemgrenze-Debatte',
  description: 'Entscheide für jede Funktionalität: Liegt sie innerhalb oder außerhalb der Systemgrenze des Streaming-Dienstes?',
  diagramType: 'usecasediagramm',
  exerciseType: 'drag-drop-zuordnung',
  level: 1,
  maxPoints: 8,
  hints: [
    'Die Systemgrenze umfasst alles, was der Streaming-Dienst selbst leistet',
    'Externe Dienste (Zahlungsabwicklung, Lizenzgeber, Internetprovider) liegen außerhalb',
    'Akteure stehen immer außerhalb der Systemgrenze',
  ],
  items: [
    { id: 'f-abspielen', content: 'Film abspielen' },
    { id: 'f-watchlist', content: 'Watchlist verwalten' },
    { id: 'f-kreditkarte', content: 'Kreditkarte belasten' },
    { id: 'f-profil', content: 'Profil verwalten' },
    { id: 'f-empfehlen', content: 'Film empfehlen' },
    { id: 'f-lizenz', content: 'Lizenzrechte prüfen' },
    { id: 'f-untertitel', content: 'Untertitel anzeigen' },
    { id: 'f-internet', content: 'Internetverbindung bereitstellen' },
  ],
  zones: [
    { id: 'innerhalb', label: 'Innerhalb der Systemgrenze' },
    { id: 'ausserhalb', label: 'Außerhalb der Systemgrenze' },
  ],
  correctMapping: {
    'f-abspielen': 'innerhalb',
    'f-watchlist': 'innerhalb',
    'f-kreditkarte': 'ausserhalb',
    'f-profil': 'innerhalb',
    'f-empfehlen': 'innerhalb',
    'f-lizenz': 'ausserhalb',
    'f-untertitel': 'innerhalb',
    'f-internet': 'ausserhalb',
  },
}

export const usecasediagrammExercises = [
  includeExtendSortierer,
  anforderungsExtraktor,
  systemgrenzeDebatte,
]
