import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ──────────────────────────────────────────────────────────────────────

type MachineState = 'Bereit' | 'GeldEingeworfen' | 'Ausgabe'

interface Product {
  name: string
  price: number
  color: string
}

interface HistoryEntry {
  event: string
  from: MachineState
  to: MachineState
  timestamp: number
}

// ── Data ───────────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  { name: 'Cola', price: 1.5, color: '#dc2626' },
  { name: 'Wasser', price: 1.0, color: '#3b82f6' },
]

// ── State diagram positions ────────────────────────────────────────────────────

const STATE_POSITIONS: Record<MachineState, { x: number; y: number }> = {
  Bereit: { x: 150, y: 120 },
  GeldEingeworfen: { x: 450, y: 120 },
  Ausgabe: { x: 450, y: 330 },
}

const STATE_LABELS: Record<MachineState, { display: string; entry?: string; doActivity?: string }> = {
  Bereit: { display: 'Bereit', entry: 'balance = 0' },
  GeldEingeworfen: { display: 'GeldEingeworfen', entry: 'kredit_anzeigen' },
  Ausgabe: { display: 'Ausgabe', entry: 'produkt_ausgeben', doActivity: 'warte_auf_entnahme' },
}

// ── Helper: format currency ────────────────────────────────────────────────────

function formatEuro(value: number): string {
  return value.toFixed(2).replace('.', ',') + ' €'
}

// ── SVG State Machine Diagram ──────────────────────────────────────────────────

function StateDiagram({
  currentState,
  kredit,
  activeTransition,
}: {
  currentState: MachineState
  kredit: number
  activeTransition: string | null
}) {
  const stateWidth = 180
  const stateHeight = 90

  // Arrow drawing helper
  function drawArrow(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    label: string,
    guardLabel?: string,
    actionLabel?: string,
    curveOffset = 0,
  ) {
    const dx = x2 - x1
    const dy = y2 - y1
    const len = Math.sqrt(dx * dx + dy * dy)
    const ndx = dx / len
    const ndy = dy / len

    // Perpendicular for curve
    const px = -ndy * curveOffset
    const py = ndx * curveOffset

    const mx = (x1 + x2) / 2 + px
    const my = (y1 + y2) / 2 + py

    const path = curveOffset !== 0
      ? `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`
      : `M ${x1} ${y1} L ${x2} ${y2}`

    // Arrowhead at end
    const angle = Math.atan2(
      curveOffset !== 0 ? y2 - my : dy,
      curveOffset !== 0 ? x2 - mx : dx,
    )
    const arrowLen = 10
    const arrowAngle = Math.PI / 6
    const ax1 = x2 - arrowLen * Math.cos(angle - arrowAngle)
    const ay1 = y2 - arrowLen * Math.sin(angle - arrowAngle)
    const ax2 = x2 - arrowLen * Math.cos(angle + arrowAngle)
    const ay2 = y2 - arrowLen * Math.sin(angle + arrowAngle)

    const textX = mx
    const textY = my - 6

    return (
      <g>
        <path d={path} fill="none" stroke={color} strokeWidth={2} />
        <polygon points={`${x2},${y2} ${ax1},${ay1} ${ax2},${ay2}`} fill={color} />
        <text x={textX} y={textY - (guardLabel ? 8 : 0)} textAnchor="middle" fontSize={12} fontWeight="bold" fill={color}>
          {label}
        </text>
        {guardLabel && (
          <text x={textX} y={textY + 8} textAnchor="middle" fontSize={11} fill={color}>
            {guardLabel}
          </text>
        )}
        {actionLabel && (
          <text x={textX} y={textY + (guardLabel ? 22 : 14)} textAnchor="middle" fontSize={11} fill="#64748b">
            / {actionLabel}
          </text>
        )}
      </g>
    )
  }

  return (
    <svg viewBox="0 0 650 430" className="w-full" role="img" aria-label="Zustandsdiagramm des Getrankeautomaten">
      <title>Zustandsdiagramm des Getrankeautomaten</title>
      {/* Initial pseudo-state */}
      <circle cx={30} cy={120} r={9} fill="#1e293b" />
      <line x1={39} y1={120} x2={STATE_POSITIONS.Bereit.x - stateWidth / 2} y2={120} stroke="#1e293b" strokeWidth={2} />
      <polygon
        points={`${STATE_POSITIONS.Bereit.x - stateWidth / 2},120 ${STATE_POSITIONS.Bereit.x - stateWidth / 2 - 10},115 ${STATE_POSITIONS.Bereit.x - stateWidth / 2 - 10},125`}
        fill="#1e293b"
      />

      {/* Transitions */}
      {/* t1: Bereit → GeldEingeworfen */}
      {drawArrow(
        STATE_POSITIONS.Bereit.x + stateWidth / 2,
        STATE_POSITIONS.Bereit.y - 12,
        STATE_POSITIONS.GeldEingeworfen.x - stateWidth / 2,
        STATE_POSITIONS.GeldEingeworfen.y - 12,
        activeTransition === 't1' ? '#16a34a' : currentState === 'Bereit' ? '#3b82f6' : '#94a3b8',
        'geld_einwerfen',
        undefined,
        'balance += betrag',
      )}

      {/* t2: GeldEingeworfen → GeldEingeworfen (self-loop) */}
      <g>
        <path
          d={`M ${STATE_POSITIONS.GeldEingeworfen.x - 35} ${STATE_POSITIONS.GeldEingeworfen.y - stateHeight / 2} C ${STATE_POSITIONS.GeldEingeworfen.x - 50} ${STATE_POSITIONS.GeldEingeworfen.y - stateHeight / 2 - 60}, ${STATE_POSITIONS.GeldEingeworfen.x + 50} ${STATE_POSITIONS.GeldEingeworfen.y - stateHeight / 2 - 60}, ${STATE_POSITIONS.GeldEingeworfen.x + 35} ${STATE_POSITIONS.GeldEingeworfen.y - stateHeight / 2}`}
          fill="none"
          stroke={activeTransition === 't2' ? '#16a34a' : currentState === 'GeldEingeworfen' ? '#3b82f6' : '#94a3b8'}
          strokeWidth={2}
        />
        <polygon
          points={`${STATE_POSITIONS.GeldEingeworfen.x + 35},${STATE_POSITIONS.GeldEingeworfen.y - stateHeight / 2} ${STATE_POSITIONS.GeldEingeworfen.x + 27},${STATE_POSITIONS.GeldEingeworfen.y - stateHeight / 2 - 10} ${STATE_POSITIONS.GeldEingeworfen.x + 42},${STATE_POSITIONS.GeldEingeworfen.y - stateHeight / 2 - 6}`}
          fill={activeTransition === 't2' ? '#16a34a' : currentState === 'GeldEingeworfen' ? '#3b82f6' : '#94a3b8'}
        />
        <text
          x={STATE_POSITIONS.GeldEingeworfen.x}
          y={STATE_POSITIONS.GeldEingeworfen.y - stateHeight / 2 - 52}
          textAnchor="middle"
          fontSize={12}
          fontWeight="bold"
          fill={activeTransition === 't2' ? '#16a34a' : currentState === 'GeldEingeworfen' ? '#3b82f6' : '#94a3b8'}
        >
          geld_einwerfen
        </text>
        <text
          x={STATE_POSITIONS.GeldEingeworfen.x}
          y={STATE_POSITIONS.GeldEingeworfen.y - stateHeight / 2 - 38}
          textAnchor="middle"
          fontSize={11}
          fill="#64748b"
        >
          / balance += betrag
        </text>
      </g>

      {/* t3: GeldEingeworfen → Ausgabe */}
      {drawArrow(
        STATE_POSITIONS.GeldEingeworfen.x + 20,
        STATE_POSITIONS.GeldEingeworfen.y + stateHeight / 2,
        STATE_POSITIONS.Ausgabe.x + 20,
        STATE_POSITIONS.Ausgabe.y - stateHeight / 2,
        activeTransition === 't3' ? '#16a34a' : currentState === 'GeldEingeworfen' ? '#3b82f6' : '#94a3b8',
        'produkt_waehlen',
        '[balance >= preis]',
        'balance -= preis',
      )}

      {/* t4: GeldEingeworfen → Bereit */}
      {drawArrow(
        STATE_POSITIONS.GeldEingeworfen.x - stateWidth / 2,
        STATE_POSITIONS.GeldEingeworfen.y + 12,
        STATE_POSITIONS.Bereit.x + stateWidth / 2,
        STATE_POSITIONS.Bereit.y + 12,
        activeTransition === 't4' ? '#16a34a' : currentState === 'GeldEingeworfen' ? '#3b82f6' : '#94a3b8',
        'abbrechen',
        undefined,
        'geld_zurueckgeben',
      )}

      {/* t5: Ausgabe → Bereit [balance == 0] */}
      {drawArrow(
        STATE_POSITIONS.Ausgabe.x - stateWidth / 2,
        STATE_POSITIONS.Ausgabe.y,
        STATE_POSITIONS.Bereit.x,
        STATE_POSITIONS.Bereit.y + stateHeight / 2,
        activeTransition === 't5' ? '#16a34a' : currentState === 'Ausgabe' ? '#3b82f6' : '#94a3b8',
        'entnahme',
        '[balance == 0]',
        'wechselgeld_ausgeben',
        -40,
      )}

      {/* t6: Ausgabe → GeldEingeworfen [balance > 0] */}
      {drawArrow(
        STATE_POSITIONS.Ausgabe.x - 20,
        STATE_POSITIONS.Ausgabe.y - stateHeight / 2,
        STATE_POSITIONS.GeldEingeworfen.x - 20,
        STATE_POSITIONS.GeldEingeworfen.y + stateHeight / 2,
        activeTransition === 't6' ? '#16a34a' : currentState === 'Ausgabe' ? '#3b82f6' : '#94a3b8',
        'entnahme',
        '[balance > 0]',
        undefined,
        -30,
      )}

      {/* States */}
      {(Object.keys(STATE_POSITIONS) as MachineState[]).map((stateId) => {
        const pos = STATE_POSITIONS[stateId]
        const info = STATE_LABELS[stateId]
        const isCurrent = stateId === currentState
        const hasActions = info.entry || info.doActivity
        const h = hasActions ? stateHeight : 50

        return (
          <g key={stateId}>
            {/* Glow for current state */}
            {isCurrent && (
              <motion.rect
                x={pos.x - stateWidth / 2 - 4}
                y={pos.y - h / 2 - 4}
                width={stateWidth + 8}
                height={h + 8}
                rx={18}
                fill="none"
                stroke="#3b82f6"
                strokeWidth={3}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            <rect
              x={pos.x - stateWidth / 2}
              y={pos.y - h / 2}
              width={stateWidth}
              height={h}
              rx={15}
              fill={isCurrent ? '#dbeafe' : 'white'}
              stroke={isCurrent ? '#3b82f6' : '#1e293b'}
              strokeWidth={2}
            />
            {/* State name */}
            <text
              x={pos.x}
              y={pos.y - (hasActions ? 16 : 0) + 5}
              textAnchor="middle"
              fontSize={14}
              fontWeight="bold"
              fill="#1e293b"
            >
              {info.display}
            </text>
            {/* Separator line + actions */}
            {hasActions && (
              <>
                <line
                  x1={pos.x - stateWidth / 2 + 5}
                  y1={pos.y - 4}
                  x2={pos.x + stateWidth / 2 - 5}
                  y2={pos.y - 4}
                  stroke="#cbd5e1"
                  strokeWidth={1}
                />
                {info.entry && (
                  <text x={pos.x - stateWidth / 2 + 10} y={pos.y + 14} fontSize={11} fill="#64748b">
                    entry / {info.entry}
                  </text>
                )}
                {info.doActivity && (
                  <text x={pos.x - stateWidth / 2 + 10} y={pos.y + 28} fontSize={11} fill="#64748b">
                    do / {info.doActivity}
                  </text>
                )}
              </>
            )}
            {/* Kredit display inside GeldEingeworfen */}
            {stateId === 'GeldEingeworfen' && isCurrent && (
              <text x={pos.x} y={pos.y + 40} textAnchor="middle" fontSize={11} fill="#2563eb" fontWeight="bold">
                Kredit: {formatEuro(kredit)}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ── Vending Machine Visual ─────────────────────────────────────────────────────

function VendingMachineVisual({
  currentState,
  kredit,
  displayMessage,
  onInsertCoin,
  onSelectProduct,
  onCancel,
  onTakeProduct,
  dispensingProduct,
  coinAnimating,
}: {
  currentState: MachineState
  kredit: number
  displayMessage: string
  onInsertCoin: (amount: number) => void
  onSelectProduct: (product: Product) => void
  onCancel: () => void
  onTakeProduct: () => void
  dispensingProduct: Product | null
  coinAnimating: boolean
}) {
  return (
    <div
      className="relative bg-gradient-to-b from-gray-700 to-gray-800 rounded-2xl p-5 shadow-xl border-2 border-gray-600 max-w-sm mx-auto"
      role="region"
      aria-label="Getrankeautomat"
    >
      {/* Title */}
      <div className="text-center mb-3">
        <span className="text-white font-bold text-lg tracking-wide">TechStore Automat</span>
      </div>

      {/* Display screen */}
      <div className="bg-black/60 rounded-lg p-4 mb-4 border border-gray-500 min-h-[80px] flex flex-col items-center justify-center">
        <motion.div
          key={displayMessage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-green-400 font-mono text-sm leading-relaxed">{displayMessage}</p>
          {kredit > 0 && (
            <p className="text-yellow-300 font-mono text-lg font-bold mt-1">
              {formatEuro(kredit)}
            </p>
          )}
        </motion.div>
      </div>

      {/* Coin slot with animation zone */}
      <div className="mb-4 relative">
        <p className="text-gray-300 text-xs mb-2 text-center">Munzeinwurf</p>
        {/* Coin animation */}
        <AnimatePresence>
          {coinAnimating && (
            <motion.div
              className="absolute left-1/2 -top-2 w-6 h-6 rounded-full bg-yellow-400 border-2 border-yellow-600 z-10"
              initial={{ y: -30, x: -12, opacity: 1, scale: 1 }}
              animate={{ y: 20, x: -12, opacity: 0.5, scale: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeIn' }}
            />
          )}
        </AnimatePresence>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => onInsertCoin(0.5)}
            disabled={currentState === 'Ausgabe'}
            className="px-3 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 rounded-lg text-sm font-bold shadow-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-300"
            aria-label="50 Cent einwerfen"
          >
            50ct einwerfen
          </button>
          <button
            onClick={() => onInsertCoin(1.0)}
            disabled={currentState === 'Ausgabe'}
            className="px-3 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 rounded-lg text-sm font-bold shadow-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-300"
            aria-label="1 Euro einwerfen"
          >
            1€ einwerfen
          </button>
        </div>
      </div>

      {/* Product buttons */}
      <div className="mb-4">
        <p className="text-gray-300 text-xs mb-2 text-center">Produktauswahl</p>
        <div className="flex gap-2 justify-center">
          {PRODUCTS.map((product) => (
            <button
              key={product.name}
              onClick={() => onSelectProduct(product)}
              disabled={currentState !== 'GeldEingeworfen'}
              className="px-4 py-2.5 rounded-lg text-sm font-bold text-white shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
              style={{
                backgroundColor: currentState === 'GeldEingeworfen' ? product.color : '#6b7280',
              }}
              aria-label={`${product.name} auswahlen (${formatEuro(product.price)})`}
            >
              {product.name} ({formatEuro(product.price)})
            </button>
          ))}
        </div>
      </div>

      {/* Cancel button */}
      <div className="mb-4 flex justify-center">
        <button
          onClick={onCancel}
          disabled={currentState !== 'GeldEingeworfen'}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-bold shadow-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Vorgang abbrechen"
        >
          Abbrechen
        </button>
      </div>

      {/* Output tray */}
      <div className="bg-gray-900 rounded-lg p-3 border border-gray-600 min-h-[60px] flex items-center justify-center relative overflow-hidden">
        <p className="text-gray-500 text-xs absolute top-1 left-2">Ausgabefach</p>
        <AnimatePresence>
          {dispensingProduct && (
            <motion.div
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={onTakeProduct}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onTakeProduct() }}
              aria-label={`${dispensingProduct.name} entnehmen`}
            >
              <div
                className="w-10 h-14 rounded-md shadow-lg flex items-center justify-center"
                style={{ backgroundColor: dispensingProduct.color }}
              >
                <span className="text-white text-xs font-bold text-center leading-tight">
                  {dispensingProduct.name}
                </span>
              </div>
              <span className="text-green-400 text-xs animate-pulse">Klicken zum Entnehmen</span>
            </motion.div>
          )}
          {!dispensingProduct && currentState !== 'Ausgabe' && (
            <span className="text-gray-600 text-xs italic">Leer</span>
          )}
        </AnimatePresence>
      </div>

      {/* Change return */}
      <AnimatePresence>
        {currentState === 'Bereit' && kredit === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-center"
          >
            <span className="text-gray-400 text-xs">Ruckgabefach</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function VendingMachineAnalogy() {
  const [currentState, setCurrentState] = useState<MachineState>('Bereit')
  const [kredit, setKredit] = useState(0)
  const [displayMessage, setDisplayMessage] = useState('Bitte Geld einwerfen')
  const [activeTransition, setActiveTransition] = useState<string | null>(null)
  const [dispensingProduct, setDispensingProduct] = useState<Product | null>(null)
  const [coinAnimating, setCoinAnimating] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Clear error message after timeout
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  const flashTransition = useCallback((transitionId: string) => {
    setActiveTransition(transitionId)
  }, [])

  const addHistory = useCallback((event: string, from: MachineState, to: MachineState) => {
    setHistory((h) => [...h, { event, from, to, timestamp: Date.now() }])
  }, [])

  const handleInsertCoin = useCallback((amount: number) => {
    if (currentState === 'Ausgabe') return

    setCoinAnimating(true)
    setTimeout(() => setCoinAnimating(false), 500)

    const newKredit = Math.round((kredit + amount) * 100) / 100

    if (currentState === 'Bereit') {
      flashTransition('t1')
      setCurrentState('GeldEingeworfen')
      setKredit(newKredit)
      setDisplayMessage(`Kredit: ${formatEuro(newKredit)}`)
      addHistory(`geld_einwerfen (${formatEuro(amount)})`, 'Bereit', 'GeldEingeworfen')
    } else if (currentState === 'GeldEingeworfen') {
      flashTransition('t2')
      setKredit(newKredit)
      setDisplayMessage(`Kredit: ${formatEuro(newKredit)}`)
      addHistory(`geld_einwerfen (${formatEuro(amount)})`, 'GeldEingeworfen', 'GeldEingeworfen')
    }
  }, [currentState, kredit, flashTransition, addHistory])

  const handleSelectProduct = useCallback((product: Product) => {
    if (currentState !== 'GeldEingeworfen') return

    if (kredit < product.price) {
      setErrorMessage(`Nicht genug Geld! ${product.name} kostet ${formatEuro(product.price)}, Kredit: ${formatEuro(kredit)}`)
      return
    }

    flashTransition('t3')
    const change = Math.round((kredit - product.price) * 100) / 100
    setCurrentState('Ausgabe')
    setKredit(change)
    setDisplayMessage(
      change > 0
        ? `${product.name} wird ausgegeben... Restguthaben: ${formatEuro(change)}`
        : `${product.name} wird ausgegeben...`
    )
    setDispensingProduct(product)
    addHistory(`produkt_waehlen (${product.name})`, 'GeldEingeworfen', 'Ausgabe')
  }, [currentState, kredit, flashTransition, addHistory])

  const handleCancel = useCallback(() => {
    if (currentState !== 'GeldEingeworfen') return

    flashTransition('t4')
    const returned = kredit
    setCurrentState('Bereit')
    setKredit(0)
    setDisplayMessage(`${formatEuro(returned)} zurueckgegeben. Bitte Geld einwerfen`)
    addHistory('abbrechen', 'GeldEingeworfen', 'Bereit')
  }, [currentState, kredit, flashTransition, addHistory])

  const handleTakeProduct = useCallback(() => {
    if (currentState !== 'Ausgabe') return

    setDispensingProduct(null)
    if (kredit > 0) {
      flashTransition('t6')
      setCurrentState('GeldEingeworfen')
      setDisplayMessage(`Produkt entnommen. Restguthaben: ${formatEuro(kredit)}`)
      addHistory('entnahme [balance > 0]', 'Ausgabe', 'GeldEingeworfen')
    } else {
      flashTransition('t5')
      setCurrentState('Bereit')
      setKredit(0)
      setDisplayMessage('Bitte Geld einwerfen')
      addHistory('entnahme [balance == 0]', 'Ausgabe', 'Bereit')
    }
  }, [currentState, kredit, flashTransition, addHistory])

  const handleReset = useCallback(() => {
    setCurrentState('Bereit')
    setKredit(0)
    setDisplayMessage('Bitte Geld einwerfen')
    setActiveTransition(null)
    setDispensingProduct(null)
    setHistory([])
    setErrorMessage(null)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-text mb-2">
          Alltagsautomat-Analogie: Der Getrankeautomat
        </h3>
        <p className="text-text-light">
          Bediene den Getrankeautomaten auf der linken Seite und beobachte, wie sich der Zustandsautomat
          auf der rechten Seite verandert. Jede Aktion am Automaten entspricht einem Zustandsubergang.
        </p>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-error-light/10 border border-error-light text-error rounded-lg px-4 py-3 text-sm font-medium"
            role="alert"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout: Machine + Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Vending Machine */}
        <div>
          <h4 className="text-sm font-semibold text-text mb-3 text-center">Getrankeautomat</h4>
          <VendingMachineVisual
            currentState={currentState}
            kredit={kredit}
            displayMessage={displayMessage}
            onInsertCoin={handleInsertCoin}
            onSelectProduct={handleSelectProduct}
            onCancel={handleCancel}
            onTakeProduct={handleTakeProduct}
            dispensingProduct={dispensingProduct}
            coinAnimating={coinAnimating}
          />
        </div>

        {/* Right: State Diagram */}
        <div>
          <h4 className="text-sm font-semibold text-text mb-3 text-center">Zustandsdiagramm</h4>
          <div className="bg-white rounded-lg border border-border p-4">
            <StateDiagram
              currentState={currentState}
              kredit={kredit}
              activeTransition={activeTransition}
            />
          </div>
          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-text-light px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm border-2 border-blue-500 bg-blue-100 inline-block" />
              <span>Aktueller Zustand</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-green-500 inline-block" />
              <span>Aktiver Ubergang</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-gray-800 inline-block" />
              <span>Startzustand</span>
            </div>
          </div>
        </div>
      </div>

      {/* State info bar */}
      <div className="bg-surface rounded-lg p-4 flex flex-wrap gap-6 items-center">
        <div>
          <span className="text-xs text-text-light">Aktueller Zustand:</span>
          <motion.span
            key={currentState}
            initial={{ scale: 1.2, color: '#3b82f6' }}
            animate={{ scale: 1, color: '#1e293b' }}
            className="ml-2 font-bold text-text"
          >
            {currentState}
          </motion.span>
        </div>
        <div>
          <span className="text-xs text-text-light">Kredit:</span>
          <span className="ml-2 font-bold text-primary">{formatEuro(kredit)}</span>
        </div>
        <div className="ml-auto">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs border border-border text-text-light rounded-lg hover:bg-surface-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Zurucksetzen
          </button>
        </div>
      </div>

      {/* History log */}
      {history.length > 0 && (
        <div className="bg-surface rounded-lg p-4">
          <h4 className="text-sm font-semibold text-text mb-2">Ubergangsverlauf:</h4>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {history.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm flex items-center gap-2"
              >
                <span className="text-text-light font-mono w-6">{i + 1}.</span>
                <span className="font-medium text-primary">{entry.from}</span>
                <span className="text-text-light">&rarr;</span>
                <span className="font-medium text-primary">{entry.to}</span>
                <span className="text-text-light text-xs">({entry.event})</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Didactic info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Beobachte:</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Jeder Knopfdruck am Automaten entspricht einem <strong>Ereignis</strong> (Event) im Zustandsdiagramm.</li>
          <li>Der Automat reagiert nur auf Ereignisse, die im <strong>aktuellen Zustand</strong> vorgesehen sind.</li>
          <li>Die Transition <em>produkt_waehlen</em> hat eine <strong>Guard-Bedingung</strong>: [balance &gt;= preis] &mdash; sie feuert nur, wenn genug Geld eingeworfen wurde.</li>
          <li>Jeder Zustand hat <strong>Entry-Aktionen</strong>, die beim Betreten automatisch ausgefuhrt werden.</li>
          <li>Der Zustand <em>Ausgabe</em> hat zusatzlich eine <strong>Do-Aktivitat</strong> (warte_auf_entnahme), die andauert, bis das Produkt entnommen wird.</li>
          <li>Nach der Produktausgabe prüft der Automat, ob noch <strong>Restguthaben</strong> vorhanden ist — wenn ja, kann direkt ein weiteres Produkt gewählt werden.</li>
        </ul>
      </div>
    </div>
  )
}
