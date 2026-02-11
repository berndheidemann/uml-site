import type { PaintbrushExerciseData, HotspotExerciseData } from '../../types/index.ts'

export const notationsPaintbrush: PaintbrushExerciseData = {
  id: 'ueb-paintbrush-01',
  version: 2,
  title: 'Notations-Paintbrush',
  description: 'Versehe die grauen Linien im Autovermietungs-Klassendiagramm mit der korrekten UML-Notation: Wähle die richtige Linienart, Pfeilspitze und Raute für jede Beziehung.',
  diagramType: 'uebergreifend',
  exerciseType: 'paintbrush',
  level: 1,
  maxPoints: 6,
  hints: [
    'Komposition = gefüllte Raute am Ganzen, durchgezogene Linie',
    'Vererbung = geschlossenes leeres Dreieck (Pfeilspitze "closed"), durchgezogene Linie zur Oberklasse',
    'Aggregation = leere Raute am Ganzen, durchgezogene Linie',
    'Abhängigkeit = gestrichelte Linie mit offener Pfeilspitze',
    'Gerichtete Assoziation = durchgezogene Linie mit offener Pfeilspitze',
  ],
  svgWidth: 700,
  svgHeight: 400,
  classes: [
    { x: 50, y: 50, width: 140, height: 60, name: 'Filiale' },
    { x: 280, y: 50, width: 140, height: 60, name: 'Fahrzeug' },
    { x: 280, y: 200, width: 140, height: 60, name: 'PKW' },
    { x: 520, y: 50, width: 140, height: 60, name: 'Buchung' },
    { x: 50, y: 300, width: 140, height: 60, name: 'Kunde' },
    { x: 520, y: 200, width: 140, height: 60, name: 'Versicherung' },
  ],
  lines: [
    {
      id: 'filiale-fahrzeug',
      x1: 190, y1: 80,
      x2: 280, y2: 80,
      correctLineStyle: 'solid',
      correctArrowHead: 'none',
      correctDiamond: 'filled',
      label: 'Filiale *— Fahrzeug',
    },
    {
      id: 'fahrzeug-pkw',
      x1: 350, y1: 110,
      x2: 350, y2: 200,
      correctLineStyle: 'solid',
      correctArrowHead: 'closed',
      correctDiamond: 'none',
      label: 'Fahrzeug ◁— PKW',
    },
    {
      id: 'fahrzeug-buchung',
      x1: 420, y1: 80,
      x2: 520, y2: 80,
      correctLineStyle: 'solid',
      correctArrowHead: 'none',
      correctDiamond: 'none',
      label: 'Fahrzeug — Buchung',
    },
    {
      id: 'kunde-buchung',
      x1: 190, y1: 330,
      x2: 520, y2: 110,
      correctLineStyle: 'solid',
      correctArrowHead: 'open',
      correctDiamond: 'none',
      label: 'Kunde → Buchung',
    },
    {
      id: 'buchung-versicherung',
      x1: 590, y1: 110,
      x2: 590, y2: 200,
      correctLineStyle: 'solid',
      correctArrowHead: 'none',
      correctDiamond: 'empty',
      label: 'Buchung o— Versicherung',
    },
    {
      id: 'abhaengigkeit',
      x1: 190, y1: 230,
      x2: 280, y2: 230,
      correctLineStyle: 'dashed',
      correctArrowHead: 'open',
      correctDiamond: 'none',
      label: 'Abhängigkeit',
    },
  ],
}

export const hotspotIdentifier: HotspotExerciseData = {
  id: 'ueb-hotspot-01',
  version: 2,
  title: 'Hotspot-Identifier',
  description: 'Klicke auf die Komposition im Diagramm. Identifiziere die Beziehung, bei der das Teil nicht ohne das Ganze existieren kann.',
  diagramType: 'uebergreifend',
  exerciseType: 'hotspot',
  level: 1,
  maxPoints: 3,
  hints: [
    'Eine Komposition wird durch eine gefüllte (schwarze) Raute dargestellt.',
    'Die Raute sitzt am "Ganzen" — das Teil kann nicht ohne das Ganze existieren.',
  ],
  question: 'Klicke auf die Komposition im folgenden Klassendiagramm.',
  multiSelect: false,
  svgContent: `
    <!-- Flughafen -->
    <rect x="50" y="30" width="140" height="80" fill="white" stroke="#1e293b" stroke-width="2" rx="2"/>
    <text x="120" y="55" text-anchor="middle" font-weight="bold" font-size="14" fill="#1e293b">Flughafen</text>
    <line x1="50" y1="62" x2="190" y2="62" stroke="#1e293b" stroke-width="1"/>
    <text x="60" y="78" font-size="11" fill="#1e293b">- name : String</text>
    <text x="60" y="95" font-size="11" fill="#1e293b">- code : String</text>

    <!-- Terminal -->
    <rect x="300" y="30" width="140" height="80" fill="white" stroke="#1e293b" stroke-width="2" rx="2"/>
    <text x="370" y="55" text-anchor="middle" font-weight="bold" font-size="14" fill="#1e293b">Terminal</text>
    <line x1="300" y1="62" x2="440" y2="62" stroke="#1e293b" stroke-width="1"/>
    <text x="310" y="78" font-size="11" fill="#1e293b">- bezeichnung : String</text>
    <text x="310" y="95" font-size="11" fill="#1e293b">- kapazitaet : int</text>

    <!-- Gate -->
    <rect x="550" y="30" width="140" height="80" fill="white" stroke="#1e293b" stroke-width="2" rx="2"/>
    <text x="620" y="55" text-anchor="middle" font-weight="bold" font-size="14" fill="#1e293b">Gate</text>
    <line x1="550" y1="62" x2="690" y2="62" stroke="#1e293b" stroke-width="1"/>
    <text x="560" y="78" font-size="11" fill="#1e293b">- gateNr : String</text>
    <text x="560" y="95" font-size="11" fill="#1e293b">- status : String</text>

    <!-- Passagier -->
    <rect x="300" y="200" width="140" height="80" fill="white" stroke="#1e293b" stroke-width="2" rx="2"/>
    <text x="370" y="225" text-anchor="middle" font-weight="bold" font-size="14" fill="#1e293b">Passagier</text>
    <line x1="300" y1="232" x2="440" y2="232" stroke="#1e293b" stroke-width="1"/>
    <text x="310" y="248" font-size="11" fill="#1e293b">- name : String</text>
    <text x="310" y="265" font-size="11" fill="#1e293b">- ticketNr : String</text>

    <!-- Komposition: Flughafen *-- Terminal (filled diamond at Flughafen) -->
    <line x1="190" y1="70" x2="300" y2="70" stroke="#1e293b" stroke-width="2"/>
    <polygon points="190,70 202,63 214,70 202,77" fill="#1e293b" stroke="#1e293b" stroke-width="1"/>
    <text x="230" y="62" text-anchor="middle" font-size="10" fill="#64748b">1</text>
    <text x="280" y="62" text-anchor="middle" font-size="10" fill="#64748b">1..*</text>

    <!-- Aggregation: Terminal o-- Gate (empty diamond at Terminal) -->
    <line x1="440" y1="70" x2="550" y2="70" stroke="#1e293b" stroke-width="2"/>
    <polygon points="440,70 452,63 464,70 452,77" fill="white" stroke="#1e293b" stroke-width="2"/>
    <text x="480" y="62" text-anchor="middle" font-size="10" fill="#64748b">1</text>
    <text x="530" y="62" text-anchor="middle" font-size="10" fill="#64748b">0..*</text>

    <!-- Gerichtete Assoziation: Terminal --> Passagier (open arrowhead) -->
    <line x1="370" y1="110" x2="370" y2="200" stroke="#1e293b" stroke-width="2"/>
    <polygon points="370,200 364,188 376,188" fill="none" stroke="#1e293b" stroke-width="2"/>
  `,
  regions: [
    {
      id: 'komposition-flughafen-terminal',
      shape: 'rect',
      coords: [190, 50, 110, 40],
      label: 'Beziehung zwischen Flughafen und Terminal',
      isCorrect: true,
      feedback: 'Richtig! Die gefüllte Raute zeigt eine Komposition an. Terminals existieren nicht ohne ihren Flughafen.',
    },
    {
      id: 'aggregation-terminal-gate',
      shape: 'rect',
      coords: [440, 50, 110, 40],
      label: 'Beziehung zwischen Terminal und Gate',
      isCorrect: false,
      feedback: 'Das ist eine Aggregation (leere Raute), keine Komposition. Gates können theoretisch auch ohne ein bestimmtes Terminal existieren.',
    },
    {
      id: 'assoziation-terminal-passagier',
      shape: 'rect',
      coords: [350, 110, 40, 90],
      label: 'Beziehung zwischen Terminal und Passagier',
      isCorrect: false,
      feedback: 'Das ist eine gerichtete Assoziation (offene Pfeilspitze), keine Komposition.',
    },
  ],
}

export const uebergreifendeExercises = [notationsPaintbrush, hotspotIdentifier]
