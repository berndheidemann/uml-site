import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Node & Edge definitions ───

type NodeType = 'start' | 'action' | 'decision' | 'fork' | 'join' | 'end'

interface DiagramNode {
  id: string
  type: NodeType
  label?: string
  x: number
  y: number
}

interface DiagramEdge {
  from: string
  to: string
  guard?: string
  /** Extra waypoints for routing edges around nodes */
  waypoints?: { x: number; y: number }[]
}

interface StepDef {
  activeNodes: string[]
  tokenPositions: { x: number; y: number }[]
  description: string
}

// ─── Diagram data ───

const NODES: DiagramNode[] = [
  { id: 'start', type: 'start', x: 350, y: 30 },
  { id: 'bestellen', type: 'action', label: 'Bestellung aufgeben', x: 350, y: 100 },
  { id: 'zahlung', type: 'action', label: 'Zahlung prüfen', x: 350, y: 185 },
  { id: 'decision', type: 'decision', x: 350, y: 270 },
  // Retry path (loop)
  { id: 'zahlungsart', type: 'action', label: 'Zahlungsart ändern', x: 540, y: 230 },
  // Success path
  { id: 'verpacken', type: 'action', label: 'Ware verpacken', x: 190, y: 365 },
  { id: 'fork', type: 'fork', x: 190, y: 435 },
  { id: 'rechnung', type: 'action', label: 'Rechnung erstellen', x: 95, y: 510 },
  { id: 'versand', type: 'action', label: 'Versandlabel drucken', x: 295, y: 510 },
  { id: 'join', type: 'join', x: 190, y: 590 },
  { id: 'paket', type: 'action', label: 'Paket versenden', x: 190, y: 660 },
  // Failure path
  { id: 'benachrichtigen', type: 'action', label: 'Kunde benachrichtigen', x: 540, y: 365 },
  { id: 'stornieren', type: 'action', label: 'Bestellung stornieren', x: 540, y: 455 },
  // End
  { id: 'end', type: 'end', x: 350, y: 740 },
]

const EDGES: DiagramEdge[] = [
  { from: 'start', to: 'bestellen' },
  { from: 'bestellen', to: 'zahlung' },
  { from: 'zahlung', to: 'decision' },
  { from: 'decision', to: 'verpacken', guard: '[Zahlung erfolgreich]' },
  { from: 'decision', to: 'zahlungsart', guard: '[Zahlung fehlgeschlagen]' },
  { from: 'decision', to: 'benachrichtigen', guard: '[max. Versuche erreicht]' },
  { from: 'zahlungsart', to: 'zahlung', waypoints: [{ x: 610, y: 230 }, { x: 610, y: 155 }, { x: 425, y: 155 }] },
  { from: 'verpacken', to: 'fork' },
  { from: 'fork', to: 'rechnung' },
  { from: 'fork', to: 'versand' },
  { from: 'rechnung', to: 'join' },
  { from: 'versand', to: 'join' },
  { from: 'join', to: 'paket' },
  { from: 'paket', to: 'end', waypoints: [{ x: 190, y: 700 }, { x: 350, y: 720 }] },
  { from: 'benachrichtigen', to: 'stornieren' },
  { from: 'stornieren', to: 'end', waypoints: [{ x: 540, y: 500 }, { x: 540, y: 720 }, { x: 370, y: 740 }] },
]

const nodeById = (id: string) => NODES.find((n) => n.id === id)!

// ─── Step sequences ───

const COMMON_STEPS: StepDef[] = [
  {
    activeNodes: ['start'],
    tokenPositions: [{ x: 350, y: 30 }],
    description: 'Der Prozess beginnt am Startknoten.',
  },
  {
    activeNodes: ['bestellen'],
    tokenPositions: [{ x: 350, y: 100 }],
    description: 'Der Kunde gibt eine Bestellung im TechStore auf.',
  },
  {
    activeNodes: ['zahlung'],
    tokenPositions: [{ x: 350, y: 185 }],
    description: 'Das System prüft die gewählte Zahlungsmethode.',
  },
  {
    activeNodes: ['decision'],
    tokenPositions: [{ x: 350, y: 270 }],
    description: 'Entscheidungspunkt: War die Zahlung erfolgreich? Wählen Sie den Pfad.',
  },
]

const RETRY_STEPS: StepDef[] = [
  {
    activeNodes: ['zahlungsart'],
    tokenPositions: [{ x: 540, y: 230 }],
    description: 'Die Zahlung ist fehlgeschlagen. Der Kunde ändert seine Zahlungsart (z.B. von Kreditkarte zu PayPal).',
  },
  {
    activeNodes: ['zahlung'],
    tokenPositions: [{ x: 350, y: 185 }],
    description: 'Das System prüft die neue Zahlungsmethode. Die Schleife hat den Token zurück zur Aktion „Zahlung prüfen" geführt.',
  },
  {
    activeNodes: ['decision'],
    tokenPositions: [{ x: 350, y: 270 }],
    description: 'Erneuter Entscheidungspunkt: War die Zahlung diesmal erfolgreich? (Zweiter Versuch)',
  },
]

const SUCCESS_STEPS: StepDef[] = [
  {
    activeNodes: ['verpacken'],
    tokenPositions: [{ x: 190, y: 365 }],
    description: 'Die Zahlung war erfolgreich. Die bestellte Ware wird verpackt.',
  },
  {
    activeNodes: ['fork'],
    tokenPositions: [{ x: 190, y: 435 }],
    description: 'Parallelisierungsbalken (Fork): Ab hier laufen zwei Aktivitäten gleichzeitig.',
  },
  {
    activeNodes: ['rechnung', 'versand'],
    tokenPositions: [{ x: 95, y: 510 }, { x: 295, y: 510 }],
    description: 'Parallele Aktivitäten: Rechnung wird erstellt und Versandlabel wird gedruckt — gleichzeitig!',
  },
  {
    activeNodes: ['join'],
    tokenPositions: [{ x: 190, y: 590 }],
    description: 'Synchronisationsbalken (Join): Beide parallelen Aktivitäten müssen abgeschlossen sein.',
  },
  {
    activeNodes: ['paket'],
    tokenPositions: [{ x: 190, y: 660 }],
    description: 'Das fertige Paket wird an den Kunden versendet.',
  },
  {
    activeNodes: ['end'],
    tokenPositions: [{ x: 350, y: 740 }],
    description: 'Der Bestellprozess ist erfolgreich abgeschlossen.',
  },
]

const FAILURE_STEPS: StepDef[] = [
  {
    activeNodes: ['benachrichtigen'],
    tokenPositions: [{ x: 540, y: 365 }],
    description: 'Die Zahlung ist auch beim zweiten Versuch fehlgeschlagen. Der Kunde wird benachrichtigt.',
  },
  {
    activeNodes: ['stornieren'],
    tokenPositions: [{ x: 540, y: 455 }],
    description: 'Die Bestellung wird storniert und alle Reservierungen aufgehoben.',
  },
  {
    activeNodes: ['end'],
    tokenPositions: [{ x: 350, y: 740 }],
    description: 'Der Prozess endet nach der Stornierung.',
  },
]

// ─── Drawing helpers ───

const ACTION_W = 150
const ACTION_H = 40
const ACTION_R = 12
const DIAMOND_SIZE = 26
const BAR_W = 120
const BAR_H = 6

function arrowMarkerDef() {
  return (
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
      </marker>
      <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
      </marker>
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  )
}

function getNodeAnchor(node: DiagramNode, direction: 'top' | 'bottom' | 'left' | 'right'): { x: number; y: number } {
  const { x, y, type } = node
  switch (type) {
    case 'start':
      if (direction === 'bottom') return { x, y: y + 12 }
      return { x, y: y - 12 }
    case 'end':
      if (direction === 'top') return { x, y: y - 14 }
      return { x, y: y + 14 }
    case 'action':
      if (direction === 'top') return { x, y: y - ACTION_H / 2 }
      if (direction === 'bottom') return { x, y: y + ACTION_H / 2 }
      if (direction === 'left') return { x: x - ACTION_W / 2, y }
      return { x: x + ACTION_W / 2, y }
    case 'decision':
      if (direction === 'top') return { x, y: y - DIAMOND_SIZE }
      if (direction === 'bottom') return { x, y: y + DIAMOND_SIZE }
      if (direction === 'left') return { x: x - DIAMOND_SIZE, y }
      return { x: x + DIAMOND_SIZE, y }
    case 'fork':
    case 'join':
      if (direction === 'top') return { x, y: y - BAR_H / 2 }
      if (direction === 'bottom') return { x, y: y + BAR_H / 2 }
      if (direction === 'left') return { x: x - BAR_W / 2, y }
      return { x: x + BAR_W / 2, y }
    default:
      return { x, y }
  }
}

function edgePath(edge: DiagramEdge): string {
  const from = nodeById(edge.from)
  const to = nodeById(edge.to)

  if (edge.waypoints && edge.waypoints.length > 0) {
    // For the loop-back edge (zahlungsart → zahlung), start from the right side and end at the top
    if (edge.from === 'zahlungsart' && edge.to === 'zahlung') {
      const start = getNodeAnchor(from, 'right')
      const end = getNodeAnchor(to, 'right')
      const pts = [start, ...edge.waypoints, end]
      return pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ')
    }

    const start = getNodeAnchor(from, 'bottom')
    const end = getNodeAnchor(to, to.x < from.x ? 'right' : from.x < to.x ? 'left' : 'top')
    const pts = [start, ...edge.waypoints, end]
    return pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ')
  }

  // Determine directions
  const dy = to.y - from.y
  const dx = to.x - from.x

  let fromDir: 'top' | 'bottom' | 'left' | 'right' = 'bottom'
  let toDir: 'top' | 'bottom' | 'left' | 'right' = 'top'

  if (Math.abs(dx) > Math.abs(dy) * 1.5) {
    fromDir = dx > 0 ? 'right' : 'left'
    toDir = dx > 0 ? 'left' : 'right'
  }

  // Decision to side nodes: go from left/right of diamond
  if (from.type === 'decision') {
    if (dx < -30) { fromDir = 'left'; toDir = 'top' }
    else if (dx > 30) { fromDir = 'right'; toDir = 'top' }
    else { fromDir = 'bottom'; toDir = 'top' }
  }

  // Special case: decision → zahlungsart (goes right and slightly up)
  if (from.id === 'decision' && to.id === 'zahlungsart') {
    fromDir = 'right'
    toDir = 'left'
  }

  // Special case: decision → benachrichtigen (goes right and down)
  if (from.id === 'decision' && to.id === 'benachrichtigen') {
    fromDir = 'bottom'
    toDir = 'top'
  }

  // Fork to parallel nodes
  if (from.type === 'fork') {
    fromDir = 'bottom'
    toDir = 'top'
  }

  // Parallel nodes to join
  if (to.type === 'join') {
    fromDir = 'bottom'
    toDir = 'top'
  }

  const start = getNodeAnchor(from, fromDir)
  const end = getNodeAnchor(to, toDir)

  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`
}

function edgeLabelPos(edge: DiagramEdge): { x: number; y: number } {
  const from = nodeById(edge.from)
  const to = nodeById(edge.to)

  if (from.type === 'decision' && to.x < from.x) {
    // Left branch guard
    return { x: (from.x + to.x) / 2 - 10, y: from.y + 5 }
  }
  if (from.type === 'decision' && to.id === 'zahlungsart') {
    // Right branch guard (to zahlungsart, slightly above center)
    return { x: (from.x + to.x) / 2 + 10, y: from.y - 15 }
  }
  if (from.type === 'decision' && to.id === 'benachrichtigen') {
    // Down-right branch guard (to benachrichtigen via bottom)
    return { x: from.x + 90, y: from.y + DIAMOND_SIZE + 30 }
  }
  if (from.type === 'decision' && to.x > from.x) {
    // Right branch guard (generic)
    return { x: (from.x + to.x) / 2 + 10, y: from.y + 5 }
  }

  return { x: (from.x + to.x) / 2 + 12, y: (from.y + to.y) / 2 }
}

// ─── Component ───

export function ProcessTokenAnimator() {
  const [stepIndex, setStepIndex] = useState(0)
  const [chosenPath, setChosenPath] = useState<'success' | 'failure' | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set(['start']))
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Decision step indices
  const FIRST_DECISION_STEP = COMMON_STEPS.length - 1 // = 3
  const RETRY_DECISION_STEP = COMMON_STEPS.length + RETRY_STEPS.length - 1 // = 6

  const isAtFirstDecision = stepIndex === FIRST_DECISION_STEP && chosenPath === null && retryCount === 0
  const isAtRetryDecision = stepIndex === RETRY_DECISION_STEP && chosenPath === null && retryCount >= 1
  const isAtDecision = isAtFirstDecision || isAtRetryDecision

  const getPathOffset = useCallback(() => {
    return retryCount > 0 ? COMMON_STEPS.length + RETRY_STEPS.length : COMMON_STEPS.length
  }, [retryCount])

  const getMaxStep = useCallback(() => {
    if (chosenPath === null) {
      if (retryCount > 0) {
        return COMMON_STEPS.length + RETRY_STEPS.length - 1
      }
      return COMMON_STEPS.length - 1
    }
    const offset = getPathOffset()
    const pathLength = chosenPath === 'success' ? SUCCESS_STEPS.length : FAILURE_STEPS.length
    return offset + pathLength - 1
  }, [chosenPath, retryCount, getPathOffset])

  const isFinished = chosenPath !== null && stepIndex >= getMaxStep()

  const getCurrentStep = useCallback((): StepDef => {
    // Common steps phase
    if (stepIndex < COMMON_STEPS.length) {
      return COMMON_STEPS[stepIndex]
    }

    // Retry steps phase
    if (retryCount > 0 && stepIndex < COMMON_STEPS.length + RETRY_STEPS.length) {
      const retryIdx = stepIndex - COMMON_STEPS.length
      return RETRY_STEPS[Math.min(retryIdx, RETRY_STEPS.length - 1)]
    }

    // Final path phase (success or failure)
    const offset = getPathOffset()
    const pathIndex = stepIndex - offset

    if (chosenPath === 'success') {
      return SUCCESS_STEPS[Math.min(pathIndex, SUCCESS_STEPS.length - 1)]
    }
    if (chosenPath === 'failure') {
      return FAILURE_STEPS[Math.min(pathIndex, FAILURE_STEPS.length - 1)]
    }

    // Fallback: show last common step (at decision)
    return COMMON_STEPS[COMMON_STEPS.length - 1]
  }, [stepIndex, chosenPath, retryCount, getPathOffset])

  const currentStep = getCurrentStep()

  // Update visited nodes when step changes
  useEffect(() => {
    setVisitedNodes((prev) => {
      const next = new Set(prev)
      for (const nid of currentStep.activeNodes) {
        next.add(nid)
      }
      return next
    })
  }, [currentStep])

  // Autoplay
  useEffect(() => {
    if (isPlaying && !isAtDecision && !isFinished) {
      intervalRef.current = setInterval(() => {
        setStepIndex((prev) => {
          const maxStep = getMaxStep()
          if (prev >= maxStep) {
            setIsPlaying(false)
            return prev
          }
          // Pause before first decision
          if (prev === FIRST_DECISION_STEP - 1 && chosenPath === null && retryCount === 0) {
            return prev + 1 // advance to decision, then next tick will pause
          }
          if (prev === FIRST_DECISION_STEP && chosenPath === null && retryCount === 0) {
            setIsPlaying(false)
            return prev
          }
          // Pause before retry decision
          if (retryCount > 0 && prev === RETRY_DECISION_STEP - 1 && chosenPath === null) {
            return prev + 1
          }
          if (retryCount > 0 && prev === RETRY_DECISION_STEP && chosenPath === null) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 1200)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, isAtDecision, isFinished, chosenPath, retryCount, getMaxStep, FIRST_DECISION_STEP, RETRY_DECISION_STEP])

  const handleNext = () => {
    if (isAtDecision || isFinished) return
    const maxStep = getMaxStep()
    if (stepIndex < maxStep) {
      setStepIndex((s) => s + 1)
    }
  }

  const handleChooseRetry = () => {
    setRetryCount(1)
    setStepIndex(COMMON_STEPS.length) // First retry step
    if (isPlaying) {
      // Continue autoplay through retry steps
    }
  }

  const handleChoosePath = (path: 'success' | 'failure') => {
    setChosenPath(path)
    const offset = retryCount > 0 ? COMMON_STEPS.length + RETRY_STEPS.length : COMMON_STEPS.length
    setStepIndex(offset) // First step of chosen path
    if (isPlaying) {
      // Continue autoplay
    }
  }

  const handleReset = () => {
    setStepIndex(0)
    setChosenPath(null)
    setRetryCount(0)
    setIsPlaying(false)
    setVisitedNodes(new Set(['start']))
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const toggleAutoplay = () => {
    setIsPlaying((p) => !p)
  }

  // ─── Render helpers ───

  const isNodeActive = (id: string) => currentStep.activeNodes.includes(id)
  const isNodeVisited = (id: string) => visitedNodes.has(id) && !isNodeActive(id)

  const renderNode = (node: DiagramNode) => {
    const active = isNodeActive(node.id)
    const visited = isNodeVisited(node.id)

    switch (node.type) {
      case 'start':
        return (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r={12} fill="#1e293b" />
            {visited && renderCheckmark(node.x + 14, node.y - 14)}
          </g>
        )
      case 'end':
        return (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r={14} fill="none" stroke="#1e293b" strokeWidth={2.5} />
            <circle cx={node.x} cy={node.y} r={8} fill="#1e293b" />
            {visited && renderCheckmark(node.x + 16, node.y - 16)}
          </g>
        )
      case 'action':
        return (
          <g key={node.id}>
            {active && (
              <motion.rect
                x={node.x - ACTION_W / 2 - 4}
                y={node.y - ACTION_H / 2 - 4}
                width={ACTION_W + 8}
                height={ACTION_H + 8}
                rx={ACTION_R + 2}
                fill="none"
                stroke="#3b82f6"
                strokeWidth={2.5}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}
            <rect
              x={node.x - ACTION_W / 2}
              y={node.y - ACTION_H / 2}
              width={ACTION_W}
              height={ACTION_H}
              rx={ACTION_R}
              fill={active ? '#dbeafe' : visited ? '#f0fdf4' : 'white'}
              stroke={active ? '#2563eb' : visited ? '#16a34a' : '#1e293b'}
              strokeWidth={active ? 2.5 : 1.5}
            />
            <text
              x={node.x}
              y={node.y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11}
              fontWeight={active ? 700 : 500}
              fill="#1e293b"
            >
              {node.label}
            </text>
            {visited && renderCheckmark(node.x + ACTION_W / 2 - 4, node.y - ACTION_H / 2 - 4)}
          </g>
        )
      case 'decision':
        return (
          <g key={node.id}>
            {active && (
              <motion.polygon
                points={`${node.x},${node.y - DIAMOND_SIZE - 4} ${node.x + DIAMOND_SIZE + 4},${node.y} ${node.x},${node.y + DIAMOND_SIZE + 4} ${node.x - DIAMOND_SIZE - 4},${node.y}`}
                fill="none"
                stroke="#3b82f6"
                strokeWidth={2.5}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}
            <polygon
              points={`${node.x},${node.y - DIAMOND_SIZE} ${node.x + DIAMOND_SIZE},${node.y} ${node.x},${node.y + DIAMOND_SIZE} ${node.x - DIAMOND_SIZE},${node.y}`}
              fill={active ? '#dbeafe' : visited ? '#f0fdf4' : 'white'}
              stroke={active ? '#2563eb' : visited ? '#16a34a' : '#1e293b'}
              strokeWidth={active ? 2.5 : 1.5}
            />
            {visited && renderCheckmark(node.x + DIAMOND_SIZE - 2, node.y - DIAMOND_SIZE - 2)}
          </g>
        )
      case 'fork':
      case 'join':
        return (
          <g key={node.id}>
            {active && (
              <motion.rect
                x={node.x - BAR_W / 2 - 4}
                y={node.y - BAR_H / 2 - 4}
                width={BAR_W + 8}
                height={BAR_H + 8}
                rx={3}
                fill="none"
                stroke="#3b82f6"
                strokeWidth={2.5}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}
            <rect
              x={node.x - BAR_W / 2}
              y={node.y - BAR_H / 2}
              width={BAR_W}
              height={BAR_H}
              rx={2}
              fill={active ? '#2563eb' : '#1e293b'}
            />
            {visited && renderCheckmark(node.x + BAR_W / 2 - 2, node.y - BAR_H / 2 - 10)}
          </g>
        )
      default:
        return null
    }
  }

  const renderCheckmark = (cx: number, cy: number) => (
    <g>
      <circle cx={cx} cy={cy} r={7} fill="#16a34a" />
      <path
        d={`M ${cx - 3} ${cy} L ${cx - 1} ${cy + 2.5} L ${cx + 3.5} ${cy - 2.5}`}
        fill="none"
        stroke="white"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  )

  const renderEdge = (edge: DiagramEdge, index: number) => {
    const from = nodeById(edge.from)
    const to = nodeById(edge.to)

    // Determine if this edge is on the "active path"
    const isOnActivePath = (() => {
      const commonNodeIds = ['start', 'bestellen', 'zahlung', 'decision']
      const retryEdge = (from.id === 'decision' && to.id === 'zahlungsart') || (from.id === 'zahlungsart' && to.id === 'zahlung')
      const failureDirectEdge = from.id === 'decision' && to.id === 'benachrichtigen'

      if (chosenPath === null && retryCount === 0) {
        // Only common path edges, no branch edges
        if (retryEdge || failureDirectEdge) return false
        if (from.id === 'decision' && to.id === 'verpacken') return false
        return commonNodeIds.includes(from.id) && commonNodeIds.includes(to.id)
      }

      if (chosenPath === null && retryCount >= 1) {
        // Common path + retry loop edges
        if (failureDirectEdge) return false
        if (from.id === 'decision' && to.id === 'verpacken') return false
        if (retryEdge) return true
        return commonNodeIds.includes(from.id) && commonNodeIds.includes(to.id)
      }

      if (chosenPath === 'success') {
        const successIds = new Set(['start', 'bestellen', 'zahlung', 'decision', 'verpacken', 'fork', 'rechnung', 'versand', 'join', 'paket', 'end'])
        if (failureDirectEdge) return false
        if (from.id === 'benachrichtigen' || from.id === 'stornieren') return false
        // Include retry edges if retry was done
        if (retryEdge) return retryCount > 0
        return successIds.has(from.id) && successIds.has(to.id)
      }

      if (chosenPath === 'failure') {
        const failureIds = new Set(['start', 'bestellen', 'zahlung', 'decision', 'benachrichtigen', 'stornieren', 'end'])
        if (from.id === 'decision' && to.id === 'verpacken') return false
        if (['verpacken', 'fork', 'rechnung', 'versand', 'join', 'paket'].includes(from.id)) return false
        // Include retry edges since failure only happens after retry
        if (retryEdge) return retryCount > 0
        return failureIds.has(from.id) && failureIds.has(to.id)
      }

      return false
    })()

    const path = edgePath(edge)
    const labelPos = edge.guard ? edgeLabelPos(edge) : null

    return (
      <g key={`edge-${index}`} opacity={isOnActivePath || (chosenPath === null && retryCount === 0) ? 1 : 0.25}>
        <path
          d={path}
          fill="none"
          stroke={isOnActivePath ? '#64748b' : '#cbd5e1'}
          strokeWidth={isOnActivePath ? 1.8 : 1.2}
          markerEnd={isOnActivePath ? 'url(#arrowhead)' : 'url(#arrowhead)'}
        />
        {labelPos && edge.guard && (
          <text
            x={labelPos.x}
            y={labelPos.y}
            textAnchor="middle"
            fontSize={9.5}
            fontStyle="italic"
            fill={isOnActivePath ? '#1e293b' : '#94a3b8'}
            fontWeight={500}
          >
            {edge.guard}
          </text>
        )}
      </g>
    )
  }

  const renderTokens = () => {
    return currentStep.tokenPositions.map((pos, i) => (
      <motion.circle
        key={`token-${i}-${stepIndex}`}
        r={10}
        fill="#3b82f6"
        filter="url(#glow)"
        initial={
          currentStep.tokenPositions.length === 2 && stepIndex > 0
            ? { cx: currentStep.tokenPositions.length === 2 ? 190 : pos.x, cy: pos.y - 60, opacity: 0.6 }
            : { opacity: 0.3 }
        }
        animate={{ cx: pos.x, cy: pos.y, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18, duration: 0.5 }}
      />
    ))
  }

  // ─── Render ───

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-border p-4 overflow-x-auto">
        <svg
          viewBox="0 0 700 770"
          className="w-full max-w-2xl mx-auto"
          role="img"
          aria-label="Interaktives Aktivitätsdiagramm: TechStore Bestellprozess mit Schleife"
        >
          {arrowMarkerDef()}

          {/* Edges */}
          {EDGES.map((edge, i) => renderEdge(edge, i))}

          {/* Nodes */}
          {NODES.map((node) => renderNode(node))}

          {/* Tokens */}
          <AnimatePresence>
            {!isFinished && renderTokens()}
          </AnimatePresence>

          {/* Fork/Join labels */}
          <text x={190} y={435 + BAR_H / 2 + 14} textAnchor="middle" fontSize={8.5} fill="#64748b" fontWeight={500}>
            Fork (Parallelisierung)
          </text>
          <text x={190} y={590 - BAR_H / 2 - 6} textAnchor="middle" fontSize={8.5} fill="#64748b" fontWeight={500}>
            Join (Synchronisation)
          </text>
        </svg>
      </div>

      {/* Current description */}
      <div
        className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-900 min-h-[3rem] flex items-center"
        aria-live="polite"
      >
        <span className="font-medium mr-2">Aktuell:</span> {currentStep.description}
      </div>

      {/* Decision buttons — first encounter (retryCount === 0) */}
      <AnimatePresence>
        {isAtFirstDecision && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center"
          >
            <p className="text-sm text-text-light text-center sm:text-left font-medium">
              Welchen Pfad soll der Prozess nehmen?
            </p>
            <button
              onClick={() => handleChoosePath('success')}
              className="px-4 py-2 bg-success text-white rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2"
            >
              Zahlung erfolgreich
            </button>
            <button
              onClick={handleChooseRetry}
              className="px-4 py-2 bg-error text-white rounded-lg font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2"
            >
              Zahlung fehlgeschlagen
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decision buttons — second encounter after retry (retryCount >= 1) */}
      <AnimatePresence>
        {isAtRetryDecision && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center"
          >
            <p className="text-sm text-text-light text-center sm:text-left font-medium">
              Zweiter Versuch — war die Zahlung diesmal erfolgreich?
            </p>
            <button
              onClick={() => handleChoosePath('success')}
              className="px-4 py-2 bg-success text-white rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2"
            >
              Zahlung erfolgreich
            </button>
            <button
              onClick={() => handleChoosePath('failure')}
              className="px-4 py-2 bg-error text-white rounded-lg font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2"
            >
              Zahlung erneut fehlgeschlagen
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={handleNext}
          disabled={isAtDecision || isFinished}
          className="px-5 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Nächster Schritt"
        >
          Nächster Schritt
        </button>
        <button
          onClick={toggleAutoplay}
          disabled={isAtDecision || isFinished}
          className={`px-5 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isPlaying
              ? 'bg-warning text-white hover:bg-amber-700 focus:ring-warning'
              : 'bg-surface-dark text-text border border-border hover:bg-gray-200 focus:ring-primary'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
          aria-pressed={isPlaying}
          aria-label={isPlaying ? 'Automatisches Abspielen stoppen' : 'Automatisch abspielen'}
        >
          {isPlaying ? 'Pause' : 'Automatisch abspielen'}
        </button>
        <button
          onClick={handleReset}
          className="px-5 py-2 border border-border text-text rounded-lg font-medium hover:bg-surface-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Zurücksetzen"
        >
          Zurücksetzen
        </button>
        {isFinished && (
          <span className="text-success font-semibold text-sm ml-2">Prozess abgeschlossen</span>
        )}
      </div>

      {/* Legend */}
      <div className="bg-surface rounded-lg border border-border p-4">
        <h4 className="text-sm font-semibold text-text mb-3">Legende</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-xs text-text-light">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="8" cy="8" r="6" fill="#1e293b" />
            </svg>
            <span>Startknoten</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="8" cy="8" r="7" fill="none" stroke="#1e293b" strokeWidth="1.5" />
              <circle cx="8" cy="8" r="4" fill="#1e293b" />
            </svg>
            <span>Endknoten</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="20" height="16" viewBox="0 0 20 16" aria-hidden="true">
              <rect x="1" y="2" width="18" height="12" rx="4" fill="white" stroke="#1e293b" strokeWidth="1.5" />
            </svg>
            <span>Aktion</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <polygon points="8,1 15,8 8,15 1,8" fill="white" stroke="#1e293b" strokeWidth="1.5" />
            </svg>
            <span>Entscheidung</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="20" height="10" viewBox="0 0 20 10" aria-hidden="true">
              <rect x="1" y="3" width="18" height="4" rx="1" fill="#1e293b" />
            </svg>
            <span>Fork / Join</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="8" cy="8" r="6" fill="#3b82f6" />
            </svg>
            <span>Token (Prozessmarke)</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="20" height="16" viewBox="0 0 20 16" aria-hidden="true">
              <path d="M 4 12 L 4 4 L 12 4" fill="none" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
              <path d="M 16 8 A 6 6 0 1 1 10 2" fill="none" stroke="#64748b" strokeWidth="1.5" />
            </svg>
            <span>Schleife / Loop</span>
          </div>
        </div>
      </div>
    </div>
  )
}
