import type {
  DragDropConnectorExercise,
  DragDropZuordnungExercise,
  HotspotExerciseData,
} from '../../types/index.ts'

export const ablaufDebugger: HotspotExerciseData = {
  id: 'ad-debugger-01',
  version: 2,
  title: 'Ablauf-Debugger',
  description: 'Finde die Fehler im Aktivitätsdiagramm des Schulkantinen-Bestellprozesses. Klicke auf alle fehlerhaften Stellen. Vorsicht: Fehlklicks geben Abzüge!',
  diagramType: 'aktivitaetsdiagramm',
  exerciseType: 'hotspot',
  level: 3,
  maxPoints: 8,
  hints: [
    'WICHTIG: Die Entscheidungsraute enthält NIEMALS Text!',
    'Guards (Bedingungen) stehen immer in eckigen Klammern an den KANTEN',
    'Bei Fork/Join muss die Anzahl der ein-/ausgehenden Kanten gleich sein',
    'Jeder Pfad in einem Aktivitätsdiagramm muss zu einem Endknoten oder einer Zusammenführung führen — Sackgassen sind nicht erlaubt!',
  ],
  question: 'Klicke auf alle Fehler im folgenden Aktivitätsdiagramm.',
  multiSelect: true,
  svgContent: `
    <!-- Start -->
    <circle cx="400" cy="30" r="12" fill="#1e293b"/>

    <!-- Pfeil Start -> Aktion1 -->
    <line x1="400" y1="42" x2="400" y2="70" stroke="#1e293b" stroke-width="2"/>
    <polygon points="400,70 395,62 405,62" fill="#1e293b"/>

    <!-- Aktion1: Essen auswählen -->
    <rect x="320" y="70" width="160" height="40" rx="10" fill="white" stroke="#1e293b" stroke-width="2"/>
    <text x="400" y="95" text-anchor="middle" font-size="12" fill="#1e293b">Essen auswählen</text>

    <!-- Pfeil -> Raute -->
    <line x1="400" y1="110" x2="400" y2="140" stroke="#1e293b" stroke-width="2"/>
    <polygon points="400,140 395,132 405,132" fill="#1e293b"/>

    <!-- Raute MIT TEXT (FEHLER 1!) -->
    <polygon points="400,145 460,180 400,215 340,180" fill="white" stroke="#1e293b" stroke-width="2"/>
    <text x="400" y="184" text-anchor="middle" font-size="9" fill="#1e293b">Gericht verfügbar?</text>

    <!-- Kante links: "Ja" statt Guard (FEHLER 2!) -->
    <line x1="340" y1="180" x2="200" y2="180" stroke="#1e293b" stroke-width="2"/>
    <polygon points="200,180 208,175 208,185" fill="#1e293b"/>
    <text x="265" y="172" text-anchor="middle" font-size="10" fill="#1e293b">Ja</text>

    <!-- Aktion links: Gericht ausgeben -->
    <rect x="80" y="160" width="120" height="40" rx="10" fill="white" stroke="#1e293b" stroke-width="2"/>
    <text x="140" y="185" text-anchor="middle" font-size="11" fill="#1e293b">Gericht ausgeben</text>

    <!-- Kante rechts: korrekter Guard -->
    <line x1="460" y1="180" x2="600" y2="180" stroke="#1e293b" stroke-width="2"/>
    <polygon points="600,180 592,175 592,185" fill="#1e293b"/>
    <text x="535" y="172" text-anchor="middle" font-size="10" fill="#64748b">[nicht verfügbar]</text>

    <!-- Aktion rechts: Alternative anbieten -->
    <rect x="600" y="160" width="140" height="40" rx="10" fill="white" stroke="#1e293b" stroke-width="2"/>
    <text x="670" y="185" text-anchor="middle" font-size="11" fill="#1e293b">Alternative anbieten</text>

    <!-- Pfeil von Aktion links zum Fork -->
    <line x1="140" y1="200" x2="140" y2="240" stroke="#1e293b" stroke-width="2"/>
    <polygon points="140,240 135,232 145,232" fill="#1e293b"/>

    <!-- Fork mit 3 Ausgängen -->
    <rect x="40" y="244" width="220" height="6" fill="#1e293b"/>

    <!-- 3 Aktionen nach Fork -->
    <line x1="80" y1="250" x2="80" y2="280" stroke="#1e293b" stroke-width="2"/>
    <polygon points="80,280 75,272 85,272" fill="#1e293b"/>
    <rect x="30" y="280" width="100" height="35" rx="10" fill="white" stroke="#1e293b" stroke-width="2"/>
    <text x="80" y="302" text-anchor="middle" font-size="11" fill="#1e293b">Bezahlen</text>

    <line x1="150" y1="250" x2="150" y2="280" stroke="#1e293b" stroke-width="2"/>
    <polygon points="150,280 145,272 155,272" fill="#1e293b"/>
    <rect x="95" y="280" width="110" height="35" rx="10" fill="white" stroke="#1e293b" stroke-width="2"/>
    <text x="150" y="302" text-anchor="middle" font-size="10" fill="#1e293b">Tablett vorbereiten</text>

    <line x1="220" y1="250" x2="220" y2="280" stroke="#1e293b" stroke-width="2"/>
    <polygon points="220,280 215,272 225,272" fill="#1e293b"/>
    <rect x="175" y="280" width="90" height="35" rx="10" fill="white" stroke="#1e293b" stroke-width="2"/>
    <text x="220" y="302" text-anchor="middle" font-size="11" fill="#1e293b">Bon drucken</text>

    <!-- Join mit nur 2 Eingängen (FEHLER 3!) -->
    <line x1="80" y1="315" x2="80" y2="355" stroke="#1e293b" stroke-width="2"/>
    <polygon points="80,355 75,347 85,347" fill="#1e293b"/>
    <line x1="150" y1="315" x2="150" y2="355" stroke="#1e293b" stroke-width="2"/>
    <polygon points="150,355 145,347 155,347" fill="#1e293b"/>
    <rect x="40" y="358" width="150" height="6" fill="#1e293b"/>

    <!-- Ende -->
    <line x1="115" y1="364" x2="115" y2="395" stroke="#1e293b" stroke-width="2"/>
    <polygon points="115,395 110,387 120,387" fill="#1e293b"/>
    <circle cx="115" cy="407" r="12" fill="white" stroke="#1e293b" stroke-width="2"/>
    <circle cx="115" cy="407" r="7" fill="#1e293b"/>
  `,
  regions: [
    {
      id: 'fehler-text-in-raute',
      shape: 'rect',
      coords: [330, 140, 140, 80],
      label: 'Entscheidungsraute mit Text',
      isCorrect: true,
      feedback: 'Richtig! Die Entscheidungsraute darf NIEMALS Text enthalten. "Gericht verfügbar?" gehört nicht in die Raute — stattdessen müssen Guards wie [Gericht verfügbar] an den Kanten stehen.',
    },
    {
      id: 'fehler-guard-fehlt',
      shape: 'rect',
      coords: [200, 160, 140, 30],
      label: 'Kante ohne Guard',
      isCorrect: true,
      feedback: 'Richtig! Die Kante zeigt "Ja" statt eines Guards in eckigen Klammern wie [Gericht verfügbar]. Guards müssen immer in eckigen Klammern stehen.',
    },
    {
      id: 'fehler-fork-join-mismatch',
      shape: 'rect',
      coords: [30, 348, 170, 25],
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
      label: 'Aktion: Essen auswählen',
      isCorrect: false,
      feedback: 'Diese Aktion ist korrekt dargestellt — Rechteck mit abgerundeten Ecken.',
    },
    {
      id: 'korrekt-guard-rechts',
      shape: 'rect',
      coords: [490, 160, 120, 30],
      label: 'Guard [nicht verfügbar]',
      isCorrect: false,
      feedback: 'Dieser Guard ist korrekt — in eckigen Klammern an der Kante.',
    },
    {
      id: 'fehler-dead-end',
      shape: 'rect',
      coords: [600, 160, 140, 40],
      label: 'Alternative anbieten (Sackgasse)',
      isCorrect: true,
      feedback: 'Richtig! Die Aktion "Alternative anbieten" hat keinen ausgehenden Pfeil — sie endet in einer Sackgasse. In Aktivitätsdiagrammen müssen alle Pfade zu einem Endknoten oder einer Zusammenführung führen.',
    },
    {
      id: 'korrekt-fork',
      shape: 'rect',
      coords: [40, 240, 220, 15],
      label: 'Fork-Balken',
      isCorrect: false,
      feedback: 'Der Fork-Balken selbst ist korrekt dargestellt — ein dicker horizontaler Balken mit drei ausgehenden Kanten.',
    },
    {
      id: 'korrekt-bezahlen',
      shape: 'rect',
      coords: [30, 280, 100, 35],
      label: 'Aktion: Bezahlen',
      isCorrect: false,
      feedback: 'Die Aktion "Bezahlen" ist korrekt dargestellt — Rechteck mit abgerundeten Ecken.',
    },
    {
      id: 'korrekt-tablett',
      shape: 'rect',
      coords: [95, 280, 110, 35],
      label: 'Aktion: Tablett vorbereiten',
      isCorrect: false,
      feedback: 'Die Aktion "Tablett vorbereiten" ist korrekt dargestellt.',
    },
    {
      id: 'korrekt-bon',
      shape: 'rect',
      coords: [175, 280, 90, 35],
      label: 'Aktion: Bon drucken',
      isCorrect: false,
      feedback: 'Die Aktion "Bon drucken" ist korrekt dargestellt.',
    },
    {
      id: 'korrekt-startpfeil',
      shape: 'rect',
      coords: [393, 42, 14, 28],
      label: 'Pfeil vom Start zur Aktion',
      isCorrect: false,
      feedback: 'Der Pfeil vom Startknoten zur ersten Aktion ist korrekt.',
    },
    {
      id: 'korrekt-endknoten',
      shape: 'circle',
      coords: [115, 407, 20],
      label: 'Endknoten',
      isCorrect: false,
      feedback: 'Der Endknoten ist korrekt — ein Bullauge (Kreis mit innerem ausgefüllten Kreis).',
    },
  ],
}

export const guardZuordner: DragDropConnectorExercise = {
  id: 'ad-connector-01',
  version: 3,
  title: 'Guard-Zuordner',
  description: 'Ordne die korrekten Guard-Bedingungen den markierten Positionen an den Kanten der Verzweigungen im Fahrschul-Prozess zu. Achtung: Es gibt auch Distraktoren, die nicht verwendet werden sollen!',
  diagramType: 'aktivitaetsdiagramm',
  exerciseType: 'drag-drop-connector',
  level: 2,
  maxPoints: 4,
  hints: [
    'Guards müssen sich gegenseitig ausschließen',
    'Guards stehen immer in eckigen Klammern',
    'Nicht alle angebotenen Guards passen — einige sind Distraktoren',
  ],
  svgContent: `
    <!-- Fahrschul-Prozess Aktivitätsdiagramm -->
    <!-- Hintergrund -->
    <rect x="0" y="0" width="620" height="520" fill="#f8fafc" rx="8"/>

    <!-- Titel -->
    <text x="310" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#334155">Fahrschul-Prozess</text>

    <!-- Startknoten -->
    <circle cx="310" cy="55" r="10" fill="#1e293b"/>

    <!-- Pfeil Start -> Fahrstunden nehmen -->
    <line x1="310" y1="65" x2="310" y2="85" stroke="#1e293b" stroke-width="2"/>
    <polygon points="310,85 306,78 314,78" fill="#1e293b"/>

    <!-- Aktion: Fahrstunden nehmen -->
    <rect x="230" y="85" width="160" height="36" rx="10" fill="white" stroke="#1e293b" stroke-width="2"/>
    <text x="310" y="108" text-anchor="middle" font-size="12" fill="#1e293b">Fahrstunden nehmen</text>

    <!-- Pfeil -> Raute 2 (Fahrstunden-Check) -->
    <line x1="310" y1="121" x2="310" y2="150" stroke="#1e293b" stroke-width="2"/>
    <polygon points="310,150 306,143 314,143" fill="#1e293b"/>

    <!-- Raute 2: Fahrstunden-Check -->
    <polygon points="310,155 365,190 310,225 255,190" fill="white" stroke="#1e293b" stroke-width="2"/>

    <!-- Kante links von Raute 2: -> Zur Prüfung anmelden -->
    <line x1="255" y1="190" x2="140" y2="190" stroke="#1e293b" stroke-width="2"/>
    <polygon points="140,190 148,186 148,194" fill="#1e293b"/>
    <!-- Guard-Position raute2-oben (links) - markierte leere Stelle -->
    <rect x="155" y="168" width="90" height="20" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,3"/>
    <text x="200" y="182" text-anchor="middle" font-size="9" fill="#3b82f6">?</text>

    <!-- Kante rechts von Raute 2: -> zurück zu Fahrstunden nehmen (Bogen nach rechts oben) -->
    <line x1="365" y1="190" x2="470" y2="190" stroke="#1e293b" stroke-width="2"/>
    <line x1="470" y1="190" x2="470" y2="103" stroke="#1e293b" stroke-width="2"/>
    <line x1="470" y1="103" x2="390" y2="103" stroke="#1e293b" stroke-width="2"/>
    <polygon points="390,103 398,99 398,107" fill="#1e293b"/>
    <!-- Guard-Position raute2-unten (rechts) - markierte leere Stelle -->
    <rect x="380" y="168" width="90" height="20" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,3"/>
    <text x="425" y="182" text-anchor="middle" font-size="9" fill="#3b82f6">?</text>

    <!-- Aktion: Zur Prüfung anmelden -->
    <rect x="40" y="172" width="100" height="36" rx="10" fill="white" stroke="#1e293b" stroke-width="2"/>
    <text x="90" y="193" text-anchor="middle" font-size="10" fill="#1e293b">Zur Prüfung</text>
    <text x="90" y="203" text-anchor="middle" font-size="10" fill="#1e293b">anmelden</text>

    <!-- Pfeil -> Praxisprüfung ablegen -->
    <line x1="90" y1="208" x2="90" y2="255" stroke="#1e293b" stroke-width="2"/>
    <polygon points="90,255 86,248 94,248" fill="#1e293b"/>

    <!-- Aktion: Praxisprüfung ablegen -->
    <rect x="20" y="255" width="140" height="36" rx="10" fill="white" stroke="#1e293b" stroke-width="2"/>
    <text x="90" y="278" text-anchor="middle" font-size="11" fill="#1e293b">Praxisprüfung ablegen</text>

    <!-- Pfeil -> Raute 1 (Prüfungsergebnis) -->
    <line x1="90" y1="291" x2="90" y2="320" stroke="#1e293b" stroke-width="2"/>
    <polygon points="90,320 86,313 94,313" fill="#1e293b"/>

    <!-- Raute 1: Prüfungsergebnis -->
    <polygon points="90,325 145,360 90,395 35,360" fill="white" stroke="#1e293b" stroke-width="2"/>

    <!-- Kante unten von Raute 1: -> Führerschein erhalten (bestanden) -->
    <line x1="90" y1="395" x2="90" y2="430" stroke="#1e293b" stroke-width="2"/>
    <polygon points="90,430 86,423 94,423" fill="#1e293b"/>
    <!-- Guard-Position raute1-links (unten) - markierte leere Stelle -->
    <rect x="100" y="398" width="100" height="20" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,3"/>
    <text x="150" y="412" text-anchor="middle" font-size="9" fill="#3b82f6">?</text>

    <!-- Kante rechts von Raute 1: -> zurück zu Fahrstunden nehmen (nicht bestanden) -->
    <line x1="145" y1="360" x2="310" y2="360" stroke="#1e293b" stroke-width="2"/>
    <line x1="310" y1="360" x2="310" y2="121" stroke="#1e293b" stroke-width="2" stroke-dasharray="0"/>
    <polygon points="310,121 306,128 314,128" fill="#1e293b"/>
    <!-- Guard-Position raute1-rechts (rechts) - markierte leere Stelle -->
    <rect x="175" y="338" width="130" height="20" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,3"/>
    <text x="240" y="352" text-anchor="middle" font-size="9" fill="#3b82f6">?</text>

    <!-- Aktion: Führerschein erhalten -->
    <rect x="15" y="430" width="150" height="36" rx="10" fill="white" stroke="#1e293b" stroke-width="2"/>
    <text x="90" y="453" text-anchor="middle" font-size="11" fill="#1e293b">Führerschein erhalten</text>

    <!-- Pfeil -> Endknoten -->
    <line x1="90" y1="466" x2="90" y2="490" stroke="#1e293b" stroke-width="2"/>
    <polygon points="90,490 86,483 94,483" fill="#1e293b"/>

    <!-- Endknoten -->
    <circle cx="90" cy="502" r="12" fill="white" stroke="#1e293b" stroke-width="2"/>
    <circle cx="90" cy="502" r="7" fill="#1e293b"/>
  `,
  items: [
    { id: 'guard-bestanden', content: '[Prüfung bestanden]' },
    { id: 'guard-nicht-bestanden', content: '[Prüfung nicht bestanden]' },
    { id: 'guard-stunden-genug', content: '[Fahrstunden >= 12]' },
    { id: 'guard-stunden-wenig', content: '[Fahrstunden < 12]' },
    { id: 'guard-alter', content: '[Alter >= 18]' },
    { id: 'guard-else', content: '[else]' },
  ],
  positions: [
    { id: 'raute1-links', label: 'Verzweigung Praxisprüfung — Kante nach unten (bestanden)', x: 150, y: 408 },
    { id: 'raute1-rechts', label: 'Verzweigung Praxisprüfung — Kante nach rechts (nicht bestanden)', x: 240, y: 348 },
    { id: 'raute2-oben', label: 'Verzweigung Fahrstunden — Kante nach links (genug)', x: 200, y: 178 },
    { id: 'raute2-unten', label: 'Verzweigung Fahrstunden — Kante nach rechts (zu wenig)', x: 425, y: 178 },
  ],
  correctMapping: {
    'guard-bestanden': 'raute1-links',
    'guard-nicht-bestanden': 'raute1-rechts',
    'guard-stunden-genug': 'raute2-oben',
    'guard-stunden-wenig': 'raute2-unten',
  },
}

export const swimlaneSortierer: DragDropZuordnungExercise = {
  id: 'ad-zuordnung-01',
  version: 2,
  title: 'Swimlane-Sortierer',
  description: 'Ordne die Aktionen des Hotelreservierungs-Prozesses den korrekten Swimlanes (Verantwortlichkeitsbereichen) zu.',
  diagramType: 'aktivitaetsdiagramm',
  exerciseType: 'drag-drop-zuordnung',
  level: 2,
  maxPoints: 8,
  hints: [
    'Überlege, WER die Aktion ausführt',
    'Der Gast interagiert direkt mit dem Hotel',
    'Interne Aufgaben wie Reinigung übernimmt der Zimmerdienst',
  ],
  items: [
    { id: 'akt-zimmer-aussuchen', content: 'Zimmer aussuchen' },
    { id: 'akt-reservierung', content: 'Reservierung aufgeben' },
    { id: 'akt-verfuegbarkeit', content: 'Verfügbarkeit prüfen' },
    { id: 'akt-zuweisen', content: 'Zimmer zuweisen' },
    { id: 'akt-reinigen', content: 'Zimmer reinigen' },
    { id: 'akt-minibar', content: 'Minibar auffüllen' },
    { id: 'akt-rechnung', content: 'Rechnung erstellen' },
    { id: 'akt-zahlung', content: 'Zahlung verbuchen' },
  ],
  zones: [
    { id: 'gast', label: 'Gast' },
    { id: 'rezeption', label: 'Rezeption' },
    { id: 'zimmerdienst', label: 'Zimmerdienst' },
    { id: 'buchhaltung', label: 'Buchhaltung' },
  ],
  correctMapping: {
    'akt-zimmer-aussuchen': 'gast',
    'akt-reservierung': 'gast',
    'akt-verfuegbarkeit': 'rezeption',
    'akt-zuweisen': 'rezeption',
    'akt-reinigen': 'zimmerdienst',
    'akt-minibar': 'zimmerdienst',
    'akt-rechnung': 'buchhaltung',
    'akt-zahlung': 'buchhaltung',
  },
}

export const aktivitaetsdiagrammExercises = [
  ablaufDebugger,
  guardZuordner,
  swimlaneSortierer,
]
