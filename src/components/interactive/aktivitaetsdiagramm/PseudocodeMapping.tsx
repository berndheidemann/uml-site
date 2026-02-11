import { useState, useRef, useCallback } from 'react'

// ─── Data structures ───

interface CodeLine {
  num: number
  /** Pre-tokenized segments for syntax highlighting */
  tokens: { text: string; type: 'keyword' | 'func' | 'string' | 'op' | 'var' | 'bracket' | 'plain' | 'comment' }[]
  /** Which diagram element IDs this line maps to */
  mappedTo: string[]
}

interface DiagramElement {
  id: string
  type: 'start' | 'action' | 'decision' | 'merge' | 'end'
  label?: string
  x: number
  y: number
  /** Which code line numbers this element maps to */
  mappedLines: number[]
}

interface DiagramEdge {
  from: string
  to: string
  guard?: string
}

// ─── Mapping color palette ───

const MAPPING_COLORS: Record<string, { bg: string; border: string; line: string }> = {
  start:         { bg: '#fef3c7', border: '#f59e0b', line: '#f59e0b' },
  loopCheck:     { bg: '#e0e7ff', border: '#6366f1', line: '#6366f1' },
  verfuegbar:    { bg: '#dbeafe', border: '#3b82f6', line: '#3b82f6' },
  decision1:     { bg: '#fce7f3', border: '#ec4899', line: '#ec4899' },
  gesamtpreis:   { bg: '#d1fae5', border: '#10b981', line: '#10b981' },
  decision2:     { bg: '#ede9fe', border: '#8b5cf6', line: '#8b5cf6' },
  rabatt:        { bg: '#fef3c7', border: '#f59e0b', line: '#f59e0b' },
  rechnung:      { bg: '#e0f2fe', border: '#0ea5e9', line: '#0ea5e9' },
  benachrichtigen: { bg: '#fee2e2', border: '#ef4444', line: '#ef4444' },
  stornieren:    { bg: '#ffedd5', border: '#f97316', line: '#f97316' },
  loopEnd:       { bg: '#e0e7ff', border: '#6366f1', line: '#6366f1' },
  end:           { bg: '#f0fdf4', border: '#16a34a', line: '#16a34a' },
}

function getColor(id: string) {
  return MAPPING_COLORS[id] ?? { bg: '#fef3c7', border: '#d97706', line: '#d97706' }
}

// ─── Code lines with syntax highlighting tokens ───

const CODE_LINES: CodeLine[] = [
  {
    num: 1,
    tokens: [
      { text: 'bestellungPruefen', type: 'func' },
      { text: '(', type: 'bracket' },
      { text: 'bestellung', type: 'var' },
      { text: ') {', type: 'bracket' },
    ],
    mappedTo: ['start'],
  },
  {
    num: 2,
    tokens: [
      { text: '  ', type: 'plain' },
      { text: 'FUER JEDEN', type: 'keyword' },
      { text: ' artikel ', type: 'var' },
      { text: 'IN', type: 'keyword' },
      { text: ' bestellung.artikel', type: 'var' },
    ],
    mappedTo: ['loopCheck'],
  },
  {
    num: 3,
    tokens: [
      { text: '    ', type: 'plain' },
      { text: 'status', type: 'var' },
      { text: ' = ', type: 'op' },
      { text: 'pruefeVerfuegbarkeit', type: 'func' },
      { text: '(', type: 'bracket' },
      { text: 'artikel', type: 'var' },
      { text: ')', type: 'bracket' },
    ],
    mappedTo: ['verfuegbar'],
  },
  {
    num: 4,
    tokens: [
      { text: '    ', type: 'plain' },
      { text: 'WENN', type: 'keyword' },
      { text: ' status == ', type: 'op' },
      { text: '"verfuegbar"', type: 'string' },
    ],
    mappedTo: ['decision1'],
  },
  {
    num: 5,
    tokens: [
      { text: '      ', type: 'plain' },
      { text: 'preis', type: 'var' },
      { text: ' = ', type: 'op' },
      { text: 'berechneGesamtpreis', type: 'func' },
      { text: '(', type: 'bracket' },
      { text: 'artikel', type: 'var' },
      { text: ')', type: 'bracket' },
    ],
    mappedTo: ['gesamtpreis'],
  },
  {
    num: 6,
    tokens: [
      { text: '      ', type: 'plain' },
      { text: 'WENN', type: 'keyword' },
      { text: ' preis > 100', type: 'op' },
    ],
    mappedTo: ['decision2'],
  },
  {
    num: 7,
    tokens: [
      { text: '        ', type: 'plain' },
      { text: 'rabatt', type: 'var' },
      { text: ' = ', type: 'op' },
      { text: 'berechneRabatt', type: 'func' },
      { text: '(', type: 'bracket' },
      { text: 'preis', type: 'var' },
      { text: ')', type: 'bracket' },
    ],
    mappedTo: ['rabatt'],
  },
  {
    num: 8,
    tokens: [
      { text: '      ', type: 'plain' },
      { text: 'ENDE-WENN', type: 'keyword' },
    ],
    mappedTo: ['merge1'],
  },
  {
    num: 9,
    tokens: [
      { text: '      ', type: 'plain' },
      { text: 'erstelleRechnung', type: 'func' },
      { text: '(', type: 'bracket' },
      { text: 'artikel', type: 'var' },
      { text: ', ', type: 'plain' },
      { text: 'preis', type: 'var' },
      { text: ')', type: 'bracket' },
    ],
    mappedTo: ['rechnung'],
  },
  {
    num: 10,
    tokens: [
      { text: '    ', type: 'plain' },
      { text: 'SONST', type: 'keyword' },
    ],
    mappedTo: ['decision1'],
  },
  {
    num: 11,
    tokens: [
      { text: '      ', type: 'plain' },
      { text: 'benachrichtigeKunde', type: 'func' },
      { text: '(', type: 'bracket' },
      { text: '"Nicht verfügbar"', type: 'string' },
      { text: ')', type: 'bracket' },
    ],
    mappedTo: ['benachrichtigen'],
  },
  {
    num: 12,
    tokens: [
      { text: '      ', type: 'plain' },
      { text: 'storniereArtikel', type: 'func' },
      { text: '(', type: 'bracket' },
      { text: 'artikel', type: 'var' },
      { text: ')', type: 'bracket' },
    ],
    mappedTo: ['stornieren'],
  },
  {
    num: 13,
    tokens: [
      { text: '    ', type: 'plain' },
      { text: 'ENDE-WENN', type: 'keyword' },
    ],
    mappedTo: ['merge2'],
  },
  {
    num: 14,
    tokens: [
      { text: '  ', type: 'plain' },
      { text: 'ENDE-FUER', type: 'keyword' },
    ],
    mappedTo: ['loopEnd'],
  },
  {
    num: 15,
    tokens: [
      { text: '}', type: 'bracket' },
    ],
    mappedTo: ['end'],
  },
]

// ─── Diagram elements ───

const DIAGRAM_ELEMENTS: DiagramElement[] = [
  { id: 'start', type: 'start', x: 190, y: 30, mappedLines: [1] },
  { id: 'loopCheck', type: 'decision', x: 190, y: 95, mappedLines: [2] },
  { id: 'verfuegbar', type: 'action', label: 'Verfügbarkeit prüfen', x: 190, y: 170, mappedLines: [3] },
  { id: 'decision1', type: 'decision', x: 190, y: 248, mappedLines: [4, 10] },
  { id: 'gesamtpreis', type: 'action', label: 'Gesamtpreis berechnen', x: 120, y: 330, mappedLines: [5] },
  { id: 'decision2', type: 'decision', x: 120, y: 405, mappedLines: [6] },
  { id: 'rabatt', type: 'action', label: 'Rabatt berechnen', x: 60, y: 480, mappedLines: [7] },
  { id: 'merge1', type: 'merge', x: 120, y: 540, mappedLines: [8] },
  { id: 'rechnung', type: 'action', label: 'Rechnung erstellen', x: 120, y: 610, mappedLines: [9] },
  { id: 'benachrichtigen', type: 'action', label: 'Kunde\nbenachrichtigen', x: 310, y: 330, mappedLines: [11] },
  { id: 'stornieren', type: 'action', label: 'Artikel\nstornieren', x: 310, y: 415, mappedLines: [12] },
  { id: 'merge2', type: 'merge', x: 190, y: 685, mappedLines: [13] },
  { id: 'loopEnd', type: 'merge', x: 190, y: 745, mappedLines: [14] },
  { id: 'end', type: 'end', x: 190, y: 820, mappedLines: [15] },
]

const DIAGRAM_EDGES: DiagramEdge[] = [
  { from: 'start', to: 'loopCheck' },
  { from: 'loopCheck', to: 'verfuegbar', guard: '[noch Artikel]' },
  { from: 'loopCheck', to: 'end', guard: '[alle geprüft]' },
  { from: 'verfuegbar', to: 'decision1' },
  { from: 'decision1', to: 'gesamtpreis', guard: '[verfügbar]' },
  { from: 'decision1', to: 'benachrichtigen', guard: '[nicht verfügbar]' },
  { from: 'gesamtpreis', to: 'decision2' },
  { from: 'decision2', to: 'rabatt', guard: '[preis > 100]' },
  { from: 'decision2', to: 'merge1', guard: '[sonst]' },
  { from: 'rabatt', to: 'merge1' },
  { from: 'merge1', to: 'rechnung' },
  { from: 'rechnung', to: 'merge2' },
  { from: 'benachrichtigen', to: 'stornieren' },
  { from: 'stornieren', to: 'merge2' },
  { from: 'merge2', to: 'loopEnd' },
  { from: 'loopEnd', to: 'loopCheck' },
]

const elementById = (id: string) => DIAGRAM_ELEMENTS.find((e) => e.id === id)!

// ─── Constants ───

const ACT_W = 130
const ACT_H = 38
const ACT_R = 10
const DIAMOND_R = 22
const MERGE_R = 10

// ─── Token type to Tailwind class ───

function tokenClass(type: string): string {
  switch (type) {
    case 'keyword': return 'text-purple-600 font-bold'
    case 'func': return 'text-blue-600'
    case 'string': return 'text-green-700'
    case 'op': return 'text-gray-500'
    case 'var': return 'text-amber-800'
    case 'bracket': return 'text-gray-600'
    case 'comment': return 'text-gray-400 italic'
    default: return 'text-gray-800'
  }
}

// ─── SVG helpers ───

function getAnchor(el: DiagramElement, dir: 'top' | 'bottom' | 'left' | 'right'): { x: number; y: number } {
  switch (el.type) {
    case 'start':
      return dir === 'bottom' ? { x: el.x, y: el.y + 10 } : { x: el.x, y: el.y - 10 }
    case 'end':
      return dir === 'top' ? { x: el.x, y: el.y - 12 } : { x: el.x, y: el.y + 12 }
    case 'action':
      if (dir === 'top') return { x: el.x, y: el.y - ACT_H / 2 }
      if (dir === 'bottom') return { x: el.x, y: el.y + ACT_H / 2 }
      if (dir === 'left') return { x: el.x - ACT_W / 2, y: el.y }
      return { x: el.x + ACT_W / 2, y: el.y }
    case 'decision':
      if (dir === 'top') return { x: el.x, y: el.y - DIAMOND_R }
      if (dir === 'bottom') return { x: el.x, y: el.y + DIAMOND_R }
      if (dir === 'left') return { x: el.x - DIAMOND_R, y: el.y }
      return { x: el.x + DIAMOND_R, y: el.y }
    case 'merge':
      if (dir === 'top') return { x: el.x, y: el.y - MERGE_R }
      if (dir === 'bottom') return { x: el.x, y: el.y + MERGE_R }
      if (dir === 'left') return { x: el.x - MERGE_R, y: el.y }
      return { x: el.x + MERGE_R, y: el.y }
    default:
      return { x: el.x, y: el.y }
  }
}

function computeEdgePath(edge: DiagramEdge): string {
  const from = elementById(edge.from)
  const to = elementById(edge.to)

  const dx = to.x - from.x
  const dy = to.y - from.y

  // ─── Loop-back edge: loopEnd → loopCheck ───
  // Route along the left side of the diagram
  if (from.id === 'loopEnd' && to.id === 'loopCheck') {
    const start = getAnchor(from, 'left')
    const end = getAnchor(to, 'left')
    const loopX = 18 // far left x for the loop-back path
    return `M ${start.x} ${start.y} L ${loopX} ${start.y} L ${loopX} ${end.y} L ${end.x} ${end.y}`
  }

  // ─── Loop exit edge: loopCheck → end ───
  // Route along the right side of the diagram
  if (from.id === 'loopCheck' && to.id === 'end') {
    const start = getAnchor(from, 'right')
    const end = getAnchor(to, 'right')
    const exitX = 375 // far right x for the exit path
    return `M ${start.x} ${start.y} L ${exitX} ${start.y} L ${exitX} ${end.y} L ${end.x + 12} ${end.y}`
  }

  // Decide direction based on node types and positions
  let fromDir: 'top' | 'bottom' | 'left' | 'right' = 'bottom'
  let toDir: 'top' | 'bottom' | 'left' | 'right' = 'top'

  // Decision going left to action
  if (from.type === 'decision' && dx < -20) {
    fromDir = 'left'
    toDir = 'top'
  }
  // Decision going right to action
  if (from.type === 'decision' && dx > 20) {
    fromDir = 'right'
    toDir = 'top'
  }
  // Decision going down (no significant horizontal offset)
  if (from.type === 'decision' && Math.abs(dx) <= 20) {
    fromDir = 'bottom'
    toDir = 'top'
  }

  // Stornieren to merge2: need to route down and left
  if (from.id === 'stornieren' && to.id === 'merge2') {
    const start = getAnchor(from, 'bottom')
    const end = getAnchor(to, 'right')
    return `M ${start.x} ${start.y} L ${start.x} ${end.y} L ${end.x} ${end.y}`
  }

  // Rechnung to merge2: straight down then right
  if (from.id === 'rechnung' && to.id === 'merge2') {
    const start = getAnchor(from, 'bottom')
    const end = getAnchor(to, 'left')
    return `M ${start.x} ${start.y} L ${start.x} ${end.y} L ${end.x} ${end.y}`
  }

  // Decision2 to merge1 (else path): route right then down
  if (from.id === 'decision2' && to.id === 'merge1') {
    const start = getAnchor(from, 'right')
    const end = getAnchor(to, 'right')
    const midX = Math.max(start.x, end.x) + 30
    return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`
  }

  // Rabatt to merge1: down then right
  if (from.id === 'rabatt' && to.id === 'merge1') {
    const start = getAnchor(from, 'bottom')
    const end = getAnchor(to, 'left')
    return `M ${start.x} ${start.y} L ${start.x} ${end.y} L ${end.x} ${end.y}`
  }

  const start = getAnchor(from, fromDir)
  const end = getAnchor(to, toDir)

  // If significant horizontal and vertical distance, use elbow
  if (Math.abs(dx) > 30 && Math.abs(dy) > 30) {
    return `M ${start.x} ${start.y} L ${start.x} ${start.y + (dy > 0 ? 15 : -15)} L ${end.x} ${start.y + (dy > 0 ? 15 : -15)} L ${end.x} ${end.y}`
  }

  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`
}

function edgeGuardPos(edge: DiagramEdge): { x: number; y: number } | null {
  if (!edge.guard) return null
  const from = elementById(edge.from)
  const to = elementById(edge.to)

  // Special guard position for loop exit (loopCheck → end)
  if (from.id === 'loopCheck' && to.id === 'end') {
    return { x: from.x + DIAMOND_R + 5, y: from.y + 2 }
  }

  if (from.type === 'decision') {
    const dx = to.x - from.x
    if (dx < -20) return { x: from.x - DIAMOND_R - 5, y: from.y + 2 }
    if (dx > 20) return { x: from.x + DIAMOND_R + 5, y: from.y + 2 }
    // Down
    return { x: from.x + 18, y: from.y + DIAMOND_R + 12 }
  }

  return { x: (from.x + to.x) / 2 + 15, y: (from.y + to.y) / 2 }
}

// ─── Component ───

export function PseudocodeMapping() {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Compute what's highlighted
  const highlightedElementIds = new Set<string>()
  const highlightedLineNums = new Set<number>()

  if (hoveredLine !== null) {
    const line = CODE_LINES.find((l) => l.num === hoveredLine)
    if (line) {
      for (const id of line.mappedTo) {
        highlightedElementIds.add(id)
        const el = elementById(id)
        for (const ln of el.mappedLines) {
          highlightedLineNums.add(ln)
        }
      }
    }
    highlightedLineNums.add(hoveredLine)
  }

  if (hoveredElement !== null) {
    highlightedElementIds.add(hoveredElement)
    const el = DIAGRAM_ELEMENTS.find((e) => e.id === hoveredElement)
    if (el) {
      for (const ln of el.mappedLines) {
        highlightedLineNums.add(ln)
        // Also highlight the element itself and any elements sharing those lines
        const codeLine = CODE_LINES.find((l) => l.num === ln)
        if (codeLine) {
          for (const id of codeLine.mappedTo) {
            highlightedElementIds.add(id)
          }
        }
      }
    }
  }

  const hasHighlight = highlightedElementIds.size > 0 || highlightedLineNums.size > 0

  // Get the primary color for a highlighted element
  const getHighlightColor = useCallback((): string | null => {
    if (hoveredElement) return getColor(hoveredElement).bg
    if (hoveredLine !== null) {
      const line = CODE_LINES.find((l) => l.num === hoveredLine)
      if (line && line.mappedTo.length > 0) return getColor(line.mappedTo[0]).bg
    }
    return '#fef3c7'
  }, [hoveredElement, hoveredLine])

  const highlightBg = getHighlightColor() ?? '#fef3c7'

  // ─── Render code panel ───

  const renderCodePanel = () => (
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-semibold text-text mb-2">Pseudocode</h4>
      <div
        className="bg-gray-900 rounded-lg overflow-hidden font-mono text-sm leading-relaxed"
        role="region"
        aria-label="Pseudocode der Bestellprüfung"
      >
        {CODE_LINES.map((line) => {
          const isHighlighted = highlightedLineNums.has(line.num)
          const hasMappings = line.mappedTo.length > 0
          const lineColor = hasMappings ? getColor(line.mappedTo[0]) : null

          return (
            <div
              key={line.num}
              className="flex items-stretch cursor-default"
              style={{
                backgroundColor: isHighlighted && lineColor ? lineColor.bg : 'transparent',
                borderLeft: isHighlighted && lineColor ? `3px solid ${lineColor.border}` : '3px solid transparent',
                transition: 'background-color 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={() => hasMappings ? setHoveredLine(line.num) : undefined}
              onMouseLeave={() => setHoveredLine(null)}
              aria-label={hasMappings ? `Zeile ${line.num}, verknüpft mit Diagrammelement` : `Zeile ${line.num}`}
            >
              {/* Line number */}
              <span
                className="w-8 flex-shrink-0 text-right pr-2 select-none text-xs leading-7"
                style={{ color: isHighlighted ? '#92400e' : '#6b7280' }}
              >
                {line.num}
              </span>
              {/* Code */}
              <span className="flex-1 py-0.5 pr-3 leading-7 whitespace-pre" style={{ minHeight: '1.75rem' }}>
                {line.tokens.length === 0 ? (
                  <span>&nbsp;</span>
                ) : (
                  line.tokens.map((tok, i) => (
                    <span
                      key={i}
                      className={isHighlighted ? 'text-gray-900' : tokenClass(tok.type)}
                      style={{ transition: 'color 0.2s ease' }}
                    >
                      {tok.text}
                    </span>
                  ))
                )}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )

  // ─── Render diagram panel ───

  const renderDiagramElement = (el: DiagramElement) => {
    const isHighlighted = highlightedElementIds.has(el.id)
    const color = getColor(el.id)
    const hasMappings = el.mappedLines.length > 0

    const commonHover = {
      onMouseEnter: () => hasMappings ? setHoveredElement(el.id) : undefined,
      onMouseLeave: () => setHoveredElement(null),
      style: { cursor: hasMappings ? 'pointer' : 'default' },
    }

    switch (el.type) {
      case 'start':
        return (
          <g key={el.id} {...commonHover}>
            <circle
              cx={el.x}
              cy={el.y}
              r={10}
              fill={isHighlighted ? color.border : '#1e293b'}
              style={{ transition: 'fill 0.2s ease' }}
            />
          </g>
        )
      case 'end':
        return (
          <g key={el.id} {...commonHover}>
            <circle
              cx={el.x}
              cy={el.y}
              r={12}
              fill="none"
              stroke={isHighlighted ? color.border : '#1e293b'}
              strokeWidth={2}
              style={{ transition: 'stroke 0.2s ease' }}
            />
            <circle
              cx={el.x}
              cy={el.y}
              r={7}
              fill={isHighlighted ? color.border : '#1e293b'}
              style={{ transition: 'fill 0.2s ease' }}
            />
          </g>
        )
      case 'action': {
        // Support multi-line labels
        const lines = (el.label ?? '').split('\n')
        return (
          <g key={el.id} {...commonHover}>
            <rect
              x={el.x - ACT_W / 2}
              y={el.y - ACT_H / 2}
              width={ACT_W}
              height={ACT_H}
              rx={ACT_R}
              fill={isHighlighted ? color.bg : 'white'}
              stroke={isHighlighted ? color.border : '#1e293b'}
              strokeWidth={isHighlighted ? 2.5 : 1.5}
              style={{ transition: 'fill 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease' }}
            />
            {lines.map((line, i) => (
              <text
                key={i}
                x={el.x}
                y={el.y + (i - (lines.length - 1) / 2) * 13}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10.5}
                fontWeight={isHighlighted ? 600 : 400}
                fill="#1e293b"
              >
                {line}
              </text>
            ))}
          </g>
        )
      }
      case 'decision':
        return (
          <g key={el.id} {...commonHover}>
            <polygon
              points={`${el.x},${el.y - DIAMOND_R} ${el.x + DIAMOND_R},${el.y} ${el.x},${el.y + DIAMOND_R} ${el.x - DIAMOND_R},${el.y}`}
              fill={isHighlighted ? color.bg : 'white'}
              stroke={isHighlighted ? color.border : '#1e293b'}
              strokeWidth={isHighlighted ? 2.5 : 1.5}
              style={{ transition: 'fill 0.2s ease, stroke 0.2s ease' }}
            />
          </g>
        )
      case 'merge':
        return (
          <g key={el.id} {...commonHover}>
            <polygon
              points={`${el.x},${el.y - MERGE_R} ${el.x + MERGE_R},${el.y} ${el.x},${el.y + MERGE_R} ${el.x - MERGE_R},${el.y}`}
              fill={isHighlighted ? color.bg : 'white'}
              stroke={isHighlighted ? color.border : '#1e293b'}
              strokeWidth={isHighlighted ? 2.5 : 1.5}
              style={{ transition: 'fill 0.2s ease, stroke 0.2s ease' }}
            />
          </g>
        )
      default:
        return null
    }
  }

  const renderDiagramEdge = (edge: DiagramEdge, index: number) => {
    const path = computeEdgePath(edge)
    const guardPos = edgeGuardPos(edge)

    const from = elementById(edge.from)
    const to = elementById(edge.to)
    const isEdgeHighlighted = highlightedElementIds.has(from.id) || highlightedElementIds.has(to.id)

    // Is this the loop-back edge?
    const isLoopBack = from.id === 'loopEnd' && to.id === 'loopCheck'
    // Is this the loop exit edge?
    const isLoopExit = from.id === 'loopCheck' && to.id === 'end'

    // Anchor for guard text
    const fromEl = elementById(edge.from)
    let guardAnchor: 'start' | 'middle' | 'end' = 'middle'
    if (edge.guard && fromEl.type === 'decision') {
      if (isLoopExit) {
        guardAnchor = 'start'
      } else {
        guardAnchor = elementById(edge.to).x < fromEl.x ? 'end' : 'start'
      }
    }

    // Color for loop-related edges
    const loopColor = '#6366f1'
    const edgeStroke = isLoopBack || isLoopExit
      ? (isEdgeHighlighted ? loopColor : '#94a3b8')
      : (isEdgeHighlighted ? '#1e293b' : '#94a3b8')

    return (
      <g key={`edge-${index}`}>
        <path
          d={path}
          fill="none"
          stroke={edgeStroke}
          strokeWidth={isEdgeHighlighted ? 1.8 : 1.2}
          strokeDasharray={isLoopBack ? '6 3' : 'none'}
          markerEnd="url(#pm-arrow)"
          style={{ transition: 'stroke 0.2s ease' }}
        />
        {guardPos && edge.guard && (
          <text
            x={guardPos.x}
            y={guardPos.y}
            textAnchor={guardAnchor}
            fontSize={8.5}
            fontStyle="italic"
            fill={isEdgeHighlighted ? (isLoopBack || isLoopExit ? loopColor : '#1e293b') : '#64748b'}
            fontWeight={isEdgeHighlighted ? 600 : 400}
            style={{ transition: 'fill 0.2s ease' }}
          >
            {edge.guard}
          </text>
        )}
        {/* Label on the loop-back edge */}
        {isLoopBack && (
          <text
            x={10}
            y={(from.y + to.y) / 2}
            textAnchor="start"
            fontSize={8}
            fontStyle="italic"
            fill={isEdgeHighlighted ? loopColor : '#94a3b8'}
            fontWeight={isEdgeHighlighted ? 600 : 400}
            transform={`rotate(-90, 10, ${(from.y + to.y) / 2})`}
            style={{ transition: 'fill 0.2s ease' }}
          >
            Schleife
          </text>
        )}
      </g>
    )
  }

  const renderDiagramPanel = () => (
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-semibold text-text mb-2">Aktivitätsdiagramm</h4>
      <div className="bg-white rounded-lg border border-border p-2 overflow-x-auto">
        <svg
          viewBox="0 0 400 860"
          className="w-full max-w-sm mx-auto"
          role="img"
          aria-label="Aktivitätsdiagramm der Bestellprüfung mit Schleife"
        >
          <defs>
            <marker id="pm-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
            </marker>
          </defs>

          {/* Loop region background (subtle indicator) */}
          <rect
            x={12}
            y={70}
            width={370}
            height={700}
            rx={8}
            fill="none"
            stroke="#c7d2fe"
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={0.6}
          />
          <text
            x={382}
            y={86}
            textAnchor="end"
            fontSize={8}
            fill="#a5b4fc"
            fontStyle="italic"
          >
            Schleifenbereich
          </text>

          {/* Edges first (behind nodes) */}
          {DIAGRAM_EDGES.map((edge, i) => renderDiagramEdge(edge, i))}

          {/* Elements */}
          {DIAGRAM_ELEMENTS.map((el) => renderDiagramElement(el))}
        </svg>
      </div>
    </div>
  )

  // ─── Mapping legend ───

  const renderLegend = () => (
    <div className="bg-surface rounded-lg border border-border p-4 mt-4">
      <h4 className="text-sm font-semibold text-text mb-3">Zuordnung: Pseudocode-Konstrukte zu UML-Elementen</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="flex items-start gap-2 bg-white rounded p-2 border border-border">
          <div className="flex-shrink-0 mt-0.5">
            <svg width="32" height="20" viewBox="0 0 32 20" aria-hidden="true">
              <polygon points="16,1 31,10 16,19 1,10" fill="white" stroke="#1e293b" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-text">
              <span className="font-mono text-purple-600">WENN</span> / <span className="font-mono text-purple-600">SONST</span>
            </p>
            <p className="text-text-light">Entscheidungsraute (Diamond)</p>
          </div>
        </div>
        <div className="flex items-start gap-2 bg-white rounded p-2 border border-border">
          <div className="flex-shrink-0 mt-0.5">
            <svg width="32" height="20" viewBox="0 0 32 20" aria-hidden="true">
              <rect x="1" y="2" width="30" height="16" rx="5" fill="white" stroke="#1e293b" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-text">
              <span className="font-mono text-blue-600">funktionsaufruf()</span>
            </p>
            <p className="text-text-light">Aktionsknoten (Rounded Rectangle)</p>
          </div>
        </div>
        <div className="flex items-start gap-2 bg-white rounded p-2 border border-border">
          <div className="flex-shrink-0 mt-0.5">
            <svg width="32" height="20" viewBox="0 0 32 20" aria-hidden="true">
              <polygon points="16,1 31,10 16,19 1,10" fill="#e0e7ff" stroke="#6366f1" strokeWidth="1.5" />
              <line x1="1" y1="16" x2="16" y2="16" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 2" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-text">
              <span className="font-mono text-purple-600">FUER JEDEN</span> / <span className="font-mono text-purple-600">ENDE-FUER</span>
            </p>
            <p className="text-text-light">Schleife (Diamond + Rückkante)</p>
          </div>
        </div>
        <div className="flex items-start gap-2 bg-white rounded p-2 border border-border">
          <div className="flex-shrink-0 mt-0.5">
            <svg width="32" height="20" viewBox="0 0 32 20" aria-hidden="true">
              <circle cx="10" cy="10" r="6" fill="#1e293b" />
              <circle cx="24" cy="10" r="7" fill="none" stroke="#1e293b" strokeWidth="1.5" />
              <circle cx="24" cy="10" r="4" fill="#1e293b" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-text">
              <span className="font-mono text-gray-600">{'{'}</span> / <span className="font-mono text-gray-600">{'}'}</span>
            </p>
            <p className="text-text-light">Start- / Endknoten</p>
          </div>
        </div>
      </div>
    </div>
  )

  // ─── Render ───

  return (
    <div className="space-y-2" ref={containerRef}>
      <p className="text-sm text-text-light mb-3">
        Fahren Sie mit der Maus über eine Codezeile oder ein Diagrammelement, um die Zuordnung zu sehen.
        {hasHighlight && (
          <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: highlightBg, color: '#92400e' }}>
            Zuordnung aktiv
          </span>
        )}
      </p>

      <div
        className="flex flex-col lg:flex-row gap-4"
        onMouseLeave={() => { setHoveredElement(null); setHoveredLine(null) }}
      >
        {renderCodePanel()}
        {renderDiagramPanel()}
      </div>

      {renderLegend()}
    </div>
  )
}
