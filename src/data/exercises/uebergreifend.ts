import type { PaintbrushExerciseData, HotspotExerciseData } from '../../types/index.ts'

export const notationsPaintbrush: PaintbrushExerciseData = {
  id: 'ueb-paintbrush-01',
  version: 1,
  title: 'Notations-Paintbrush',
  description: 'Versehe die grauen Linien im TechStore-Klassendiagramm mit der korrekten UML-Notation: Wähle die richtige Linienart, Pfeilspitze und Raute für jede Beziehung.',
  diagramType: 'uebergreifend',
  exerciseType: 'paintbrush',
  level: 1,
  maxPoints: 6,
  hints: [
    'Komposition = gefüllte Raute am Ganzen, durchgezogene Linie',
    'Vererbung = geschlossenes leeres Dreieck (Pfeilspitze "closed"), durchgezogene Linie zur Oberklasse',
    'Aggregation = leere Raute am Ganzen, durchgezogene Linie',
  ],
  svgWidth: 700,
  svgHeight: 400,
  classes: [
    { x: 50, y: 50, width: 140, height: 60, name: 'Kunde' },
    { x: 280, y: 50, width: 140, height: 60, name: 'Bestellung' },
    { x: 520, y: 50, width: 140, height: 60, name: 'Bestellposition' },
    { x: 280, y: 200, width: 140, height: 60, name: 'Produkt' },
    { x: 50, y: 300, width: 140, height: 60, name: 'Mitarbeiter' },
    { x: 280, y: 300, width: 140, height: 60, name: 'Lagerist' },
  ],
  lines: [
    {
      id: 'kunde-bestellung',
      x1: 190, y1: 80,
      x2: 280, y2: 80,
      correctLineStyle: 'solid',
      correctArrowHead: 'none',
      correctDiamond: 'none',
      label: 'Kunde — Bestellung',
    },
    {
      id: 'bestellung-bestellposition',
      x1: 420, y1: 80,
      x2: 520, y2: 80,
      correctLineStyle: 'solid',
      correctArrowHead: 'none',
      correctDiamond: 'filled',
      label: 'Bestellung *— Bestellposition',
    },
    {
      id: 'bestellposition-produkt',
      x1: 590, y1: 110,
      x2: 380, y2: 200,
      correctLineStyle: 'solid',
      correctArrowHead: 'open',
      correctDiamond: 'none',
      label: 'Bestellposition → Produkt',
    },
    {
      id: 'warenkorb-produkt',
      x1: 190, y1: 230,
      x2: 280, y2: 230,
      correctLineStyle: 'solid',
      correctArrowHead: 'none',
      correctDiamond: 'empty',
      label: 'Warenkorb o— Produkt',
    },
    {
      id: 'mitarbeiter-lagerist',
      x1: 190, y1: 330,
      x2: 280, y2: 330,
      correctLineStyle: 'solid',
      correctArrowHead: 'closed',
      correctDiamond: 'none',
      label: 'Mitarbeiter ◁— Lagerist',
    },
    {
      id: 'abhängigkeit',
      x1: 420, y1: 330,
      x2: 520, y2: 230,
      correctLineStyle: 'dashed',
      correctArrowHead: 'open',
      correctDiamond: 'none',
      label: 'Abhängigkeit',
    },
  ],
}

export const hotspotIdentifier: HotspotExerciseData = {
  id: 'ueb-hotspot-01',
  version: 1,
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
    <!-- Kunde -->
    <rect x="50" y="30" width="140" height="80" fill="white" stroke="#1e293b" stroke-width="2" rx="2"/>
    <text x="120" y="55" text-anchor="middle" font-weight="bold" font-size="14" fill="#1e293b">Kunde</text>
    <line x1="50" y1="62" x2="190" y2="62" stroke="#1e293b" stroke-width="1"/>
    <text x="60" y="78" font-size="11" fill="#1e293b">- name : String</text>
    <text x="60" y="95" font-size="11" fill="#1e293b">- kundenNr : int</text>

    <!-- Bestellung -->
    <rect x="300" y="30" width="140" height="80" fill="white" stroke="#1e293b" stroke-width="2" rx="2"/>
    <text x="370" y="55" text-anchor="middle" font-weight="bold" font-size="14" fill="#1e293b">Bestellung</text>
    <line x1="300" y1="62" x2="440" y2="62" stroke="#1e293b" stroke-width="1"/>
    <text x="310" y="78" font-size="11" fill="#1e293b">- bestellNr : int</text>
    <text x="310" y="95" font-size="11" fill="#1e293b">- datum : Date</text>

    <!-- Bestellposition -->
    <rect x="550" y="30" width="160" height="80" fill="white" stroke="#1e293b" stroke-width="2" rx="2"/>
    <text x="630" y="55" text-anchor="middle" font-weight="bold" font-size="14" fill="#1e293b">Bestellposition</text>
    <line x1="550" y1="62" x2="710" y2="62" stroke="#1e293b" stroke-width="1"/>
    <text x="560" y="78" font-size="11" fill="#1e293b">- menge : int</text>
    <text x="560" y="95" font-size="11" fill="#1e293b">- einzelpreis : double</text>

    <!-- Produkt -->
    <rect x="550" y="200" width="160" height="80" fill="white" stroke="#1e293b" stroke-width="2" rx="2"/>
    <text x="630" y="225" text-anchor="middle" font-weight="bold" font-size="14" fill="#1e293b">Produkt</text>
    <line x1="550" y1="232" x2="710" y2="232" stroke="#1e293b" stroke-width="1"/>
    <text x="560" y="248" font-size="11" fill="#1e293b">- name : String</text>
    <text x="560" y="265" font-size="11" fill="#1e293b">- preis : double</text>

    <!-- Assoziation: Kunde -- Bestellung -->
    <line x1="190" y1="70" x2="300" y2="70" stroke="#1e293b" stroke-width="2"/>
    <text x="245" y="62" text-anchor="middle" font-size="10" fill="#64748b">1</text>
    <text x="245" y="85" text-anchor="middle" font-size="10" fill="#64748b">0..*</text>

    <!-- Komposition: Bestellung *-- Bestellposition -->
    <line x1="440" y1="70" x2="550" y2="70" stroke="#1e293b" stroke-width="2"/>
    <polygon points="440,70 452,63 464,70 452,77" fill="#1e293b" stroke="#1e293b" stroke-width="1"/>
    <text x="475" y="62" text-anchor="middle" font-size="10" fill="#64748b">1</text>
    <text x="530" y="62" text-anchor="middle" font-size="10" fill="#64748b">1..*</text>

    <!-- Assoziation: Bestellposition --> Produkt -->
    <line x1="630" y1="110" x2="630" y2="200" stroke="#1e293b" stroke-width="2"/>
    <polygon points="630,200 624,188 636,188" fill="none" stroke="#1e293b" stroke-width="2"/>
  `,
  regions: [
    {
      id: 'assoziation-kunde-bestellung',
      shape: 'rect',
      coords: [190, 50, 110, 40],
      label: 'Assoziation zwischen Kunde und Bestellung',
      isCorrect: false,
      feedback: 'Das ist eine einfache Assoziation, keine Komposition. Es fehlt die gefüllte Raute.',
    },
    {
      id: 'komposition-bestellung-bestellposition',
      shape: 'rect',
      coords: [440, 50, 110, 40],
      label: 'Beziehung zwischen Bestellung und Bestellposition',
      isCorrect: true,
      feedback: 'Richtig! Die gefüllte Raute zeigt eine Komposition an. Bestellpositionen existieren nicht ohne ihre Bestellung.',
    },
    {
      id: 'assoziation-bestellposition-produkt',
      shape: 'rect',
      coords: [610, 110, 40, 90],
      label: 'Beziehung zwischen Bestellposition und Produkt',
      isCorrect: false,
      feedback: 'Das ist eine gerichtete Assoziation (offene Pfeilspitze), keine Komposition.',
    },
  ],
}

export const uebergreifendeExercises = [notationsPaintbrush, hotspotIdentifier]
