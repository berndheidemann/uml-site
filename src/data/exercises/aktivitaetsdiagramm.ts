import type {
  DragDropConnectorExercise,
  DragDropZuordnungExercise,
  HotspotExerciseData,
} from '../../types/index.ts'

export const ablaufDebugger: HotspotExerciseData = {
  id: 'ad-debugger-01',
  version: 1,
  title: 'Ablauf-Debugger',
  description: 'Finde die Fehler im TechStore-Bestellprozess-Aktivitätsdiagramm. Klicke auf alle fehlerhaften Stellen. Vorsicht: Fehlklicks geben Abzüge!',
  diagramType: 'aktivitaetsdiagramm',
  exerciseType: 'hotspot',
  level: 3,
  maxPoints: 6,
  hints: [
    'WICHTIG: Die Entscheidungsraute enthält NIEMALS Text!',
    'Guards (Bedingungen) stehen immer in eckigen Klammern an den KANTEN',
    'Bei Fork/Join muss die Anzahl der ein-/ausgehenden Kanten gleich sein',
  ],
  question: 'Klicke auf alle Fehler im folgenden Aktivitätsdiagramm.',
  multiSelect: true,
  svgContent: `
    <!-- Start -->
    <circle cx="400" cy="30" r="12" fill="#1e293b"/>

    <!-- Pfeil Start -> Aktion1 -->
    <line x1="400" y1="42" x2="400" y2="70" stroke="#1e293b" stroke-width="2"/>
    <polygon points="400,70 395,62 405,62" fill="#1e293b"/>

    <!-- Aktion1: Bestellung prüfen -->
    <rect x="320" y="70" width="160" height="40" rx="10" fill="white" stroke="#1e293b" stroke-width="2"/>
    <text x="400" y="95" text-anchor="middle" font-size="12" fill="#1e293b">Bestellung prüfen</text>

    <!-- Pfeil -> Raute (FEHLER: hat Text drin!) -->
    <line x1="400" y1="110" x2="400" y2="140" stroke="#1e293b" stroke-width="2"/>
    <polygon points="400,140 395,132 405,132" fill="#1e293b"/>

    <!-- Raute MIT TEXT (FEHLER!) -->
    <polygon points="400,145 450,180 400,215 350,180" fill="white" stroke="#1e293b" stroke-width="2"/>
    <text x="400" y="184" text-anchor="middle" font-size="10" fill="#1e293b">Ware verfügbar?</text>

    <!-- Kante links: ohne Guard (FEHLER - Guard fehlt) -->
    <line x1="350" y1="180" x2="200" y2="180" stroke="#1e293b" stroke-width="2"/>
    <polygon points="200,180 208,175 208,185" fill="#1e293b"/>
    <text x="270" y="172" text-anchor="middle" font-size="10" fill="#1e293b">Ja</text>

    <!-- Aktion links -->
    <rect x="100" y="160" width="100" height="40" rx="10" fill="white" stroke="#1e293b" stroke-width="2"/>
    <text x="150" y="185" text-anchor="middle" font-size="12" fill="#1e293b">Reservieren</text>

    <!-- Kante rechts -->
    <line x1="450" y1="180" x2="600" y2="180" stroke="#1e293b" stroke-width="2"/>
    <polygon points="600,180 592,175 592,185" fill="#1e293b"/>
    <text x="530" y="172" text-anchor="middle" font-size="10" fill="#64748b">[nicht verfügbar]</text>

    <!-- Aktion rechts -->
    <rect x="600" y="160" width="140" height="40" rx="10" fill="white" stroke="#1e293b" stroke-width="2"/>
    <text x="670" y="185" text-anchor="middle" font-size="12" fill="#1e293b">Benachrichtigen</text>

    <!-- Fork mit 3 Ausgängen -->
    <rect x="50" y="240" width="200" height="6" fill="#1e293b"/>

    <!-- 3 Aktionen nach Fork -->
    <line x1="100" y1="246" x2="100" y2="280" stroke="#1e293b" stroke-width="2"/>
    <rect x="50" y="280" width="100" height="35" rx="10" fill="white" stroke="#1e293b" stroke-width="2"/>
    <text x="100" y="302" text-anchor="middle" font-size="11" fill="#1e293b">Rechnung</text>

    <line x1="150" y1="246" x2="150" y2="280" stroke="#1e293b" stroke-width="2"/>
    <rect x="110" y="280" width="80" height="35" rx="10" fill="white" stroke="#1e293b" stroke-width="2"/>
    <text x="150" y="302" text-anchor="middle" font-size="11" fill="#1e293b">Verpacken</text>

    <line x1="200" y1="246" x2="200" y2="280" stroke="#1e293b" stroke-width="2"/>
    <rect x="160" y="280" width="80" height="35" rx="10" fill="white" stroke="#1e293b" stroke-width="2"/>
    <text x="200" y="302" text-anchor="middle" font-size="11" fill="#1e293b">Label</text>

    <!-- Join mit nur 2 Eingängen (FEHLER!) -->
    <line x1="100" y1="315" x2="100" y2="350" stroke="#1e293b" stroke-width="2"/>
    <line x1="150" y1="315" x2="150" y2="350" stroke="#1e293b" stroke-width="2"/>
    <rect x="50" y="350" width="150" height="6" fill="#1e293b"/>

    <!-- Ende -->
    <line x1="125" y1="356" x2="125" y2="390" stroke="#1e293b" stroke-width="2"/>
    <circle cx="125" cy="400" r="12" fill="white" stroke="#1e293b" stroke-width="2"/>
    <circle cx="125" cy="400" r="7" fill="#1e293b"/>
  `,
  regions: [
    {
      id: 'fehler-text-in-raute',
      shape: 'rect',
      coords: [340, 140, 120, 80],
      label: 'Entscheidungsraute mit Text',
      isCorrect: true,
      feedback: 'Richtig! Die Entscheidungsraute darf NIEMALS Text enthalten. "Ware verfügbar?" gehört nicht in die Raute — stattdessen müssen Guards wie [Ware verfügbar] an den Kanten stehen.',
    },
    {
      id: 'fehler-guard-fehlt',
      shape: 'rect',
      coords: [200, 160, 150, 30],
      label: 'Kante ohne Guard',
      isCorrect: true,
      feedback: 'Richtig! Die Kante zeigt "Ja" statt eines Guards in eckigen Klammern wie [Ware verfügbar]. Guards müssen immer in eckigen Klammern stehen.',
    },
    {
      id: 'fehler-fork-join-mismatch',
      shape: 'rect',
      coords: [40, 340, 170, 25],
      label: 'Join-Balken',
      isCorrect: true,
      feedback: 'Richtig! Der Fork hat 3 ausgehende Kanten, aber der Join hat nur 2 eingehende Kanten. Die Anzahl muss übereinstimmen.',
    },
    {
      id: 'korrekt-start',
      shape: 'circle',
      coords: [400, 30, 20],
      label: 'Startknoten',
      isCorrect: false,
      feedback: 'Der Startknoten ist korrekt — ein ausgefüllter Kreis.',
    },
    {
      id: 'korrekt-aktion1',
      shape: 'rect',
      coords: [320, 70, 160, 40],
      label: 'Aktion: Bestellung prüfen',
      isCorrect: false,
      feedback: 'Diese Aktion ist korrekt dargestellt — Rechteck mit abgerundeten Ecken.',
    },
    {
      id: 'korrekt-guard-rechts',
      shape: 'rect',
      coords: [480, 160, 120, 30],
      label: 'Guard [nicht verfügbar]',
      isCorrect: false,
      feedback: 'Dieser Guard ist korrekt — in eckigen Klammern an der Kante.',
    },
  ],
}

export const guardZuordner: DragDropConnectorExercise = {
  id: 'ad-connector-01',
  version: 1,
  title: 'Guard-Zuordner',
  description: 'Ziehe die korrekten Guard-Bedingungen an die ausgehenden Kanten der Verzweigungen. Achtung: Es gibt auch Distraktoren, die nicht verwendet werden sollen!',
  diagramType: 'aktivitaetsdiagramm',
  exerciseType: 'drag-drop-connector',
  level: 2,
  maxPoints: 4,
  hints: [
    'Guards müssen sich gegenseitig ausschließen',
    'Guards stehen immer in eckigen Klammern',
    'Nicht alle angebotenen Guards passen — einige sind Distraktoren',
  ],
  items: [
    { id: 'guard-verfuegbar', content: '[Ware verfügbar]' },
    { id: 'guard-nicht-verfuegbar', content: '[Ware nicht verfügbar]' },
    { id: 'guard-zahlung-ok', content: '[Zahlung erfolgreich]' },
    { id: 'guard-zahlung-fail', content: '[Zahlung fehlgeschlagen]' },
    { id: 'guard-eingeloggt', content: '[Kunde eingeloggt]' },
    { id: 'guard-else', content: '[else]' },
  ],
  positions: [
    { id: 'raute1-links', label: 'Verzweigung 1 — linke Kante (positiv)', x: 0, y: 0 },
    { id: 'raute1-rechts', label: 'Verzweigung 1 — rechte Kante (negativ)', x: 0, y: 0 },
    { id: 'raute2-oben', label: 'Verzweigung 2 — obere Kante (positiv)', x: 0, y: 0 },
    { id: 'raute2-unten', label: 'Verzweigung 2 — untere Kante (negativ)', x: 0, y: 0 },
  ],
  correctMapping: {
    'guard-verfuegbar': 'raute1-links',
    'guard-nicht-verfuegbar': 'raute1-rechts',
    'guard-zahlung-ok': 'raute2-oben',
    'guard-zahlung-fail': 'raute2-unten',
  },
}

export const swimlaneSortierer: DragDropZuordnungExercise = {
  id: 'ad-zuordnung-01',
  version: 1,
  title: 'Swimlane-Sortierer',
  description: 'Ordne die Aktionen des TechStore-Bestellprozesses den korrekten Swimlanes (Verantwortlichkeitsbereichen) zu.',
  diagramType: 'aktivitaetsdiagramm',
  exerciseType: 'drag-drop-zuordnung',
  level: 2,
  maxPoints: 8,
  hints: [
    'Überlege, WER die Aktion ausführt',
    'Der Kunde interagiert über den Webshop',
    'Interne Logistik (Verpacken, Lager) liegt beim Lager',
  ],
  items: [
    { id: 'akt-suchen', content: 'Produkt auswählen' },
    { id: 'akt-bestellen', content: 'Bestellung aufgeben' },
    { id: 'akt-verfuegbarkeit', content: 'Verfügbarkeit prüfen' },
    { id: 'akt-verpacken', content: 'Ware verpacken' },
    { id: 'akt-rechnung', content: 'Rechnung erstellen' },
    { id: 'akt-versand', content: 'Versandlabel erstellen' },
    { id: 'akt-zahlung', content: 'Zahlung verarbeiten' },
    { id: 'akt-tracking', content: 'Tracking-Info senden' },
  ],
  zones: [
    { id: 'kunde', label: 'Kunde' },
    { id: 'webshop', label: 'Webshop-System' },
    { id: 'lager', label: 'Lager' },
    { id: 'buchhaltung', label: 'Buchhaltung' },
  ],
  correctMapping: {
    'akt-suchen': 'kunde',
    'akt-bestellen': 'kunde',
    'akt-verfuegbarkeit': 'webshop',
    'akt-verpacken': 'lager',
    'akt-rechnung': 'buchhaltung',
    'akt-versand': 'lager',
    'akt-zahlung': 'webshop',
    'akt-tracking': 'webshop',
  },
}

export const aktivitaetsdiagrammExercises = [
  ablaufDebugger,
  guardZuordner,
  swimlaneSortierer,
]
