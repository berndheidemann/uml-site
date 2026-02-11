import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ------------------------------------------------------------------ */
/*  Types & constants                                                  */
/* ------------------------------------------------------------------ */

type Phase =
  | 'idle'
  | 'sending'       // message travelling from WebShop to Lager
  | 'processing'    // Lager is processing
  | 'responding'    // return message travelling from Lager to WebShop
  | 'done'

const WEBSHOP_X = 80
const LAGER_X = 260
const HEADER_Y = 15
const HEADER_H = 36
const LIFELINE_TOP = HEADER_Y + HEADER_H
const MSG1_Y = LIFELINE_TOP + 50
const MSG2_Y = LIFELINE_TOP + 160
const ACTIVATION_W = 12
const LIFELINE_END = LIFELINE_TOP + 230
const SVG_W = 340
const SVG_H = LIFELINE_END + 20

const SEND_DURATION = 600   // ms for message travel
const PROCESS_DURATION = 2000 // ms Lager processes

/* ------------------------------------------------------------------ */
/*  Shared SVG building blocks                                         */
/* ------------------------------------------------------------------ */

function LifelineHeader({ x, label }: { x: number; label: string }) {
  return (
    <g>
      <rect
        x={x - 48}
        y={HEADER_Y}
        width={96}
        height={HEADER_H}
        rx={5}
        fill="#f1f5f9"
        stroke="#1e293b"
        strokeWidth={1.5}
      />
      <text
        x={x}
        y={HEADER_Y + HEADER_H / 2 + 5}
        textAnchor="middle"
        fontSize={12}
        fontWeight="bold"
        fill="#1e293b"
      >
        {label}
      </text>
      <line
        x1={x}
        y1={LIFELINE_TOP}
        x2={x}
        y2={LIFELINE_END}
        stroke="#94a3b8"
        strokeWidth={1}
        strokeDasharray="6 4"
      />
    </g>
  )
}

function FilledArrow({ x, y, direction, color }: { x: number; y: number; direction: 'right' | 'left'; color: string }) {
  const sign = direction === 'right' ? -1 : 1
  return (
    <polygon
      points={`${x},${y} ${x + sign * 9},${y - 4} ${x + sign * 9},${y + 4}`}
      fill={color}
    />
  )
}

function OpenArrow({ x, y, direction, color }: { x: number; y: number; direction: 'right' | 'left'; color: string }) {
  const sign = direction === 'right' ? -1 : 1
  return (
    <polyline
      points={`${x + sign * 9},${y - 4} ${x},${y} ${x + sign * 9},${y + 4}`}
      fill="none"
      stroke={color}
      strokeWidth={2}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Panel: Synchron                                                    */
/* ------------------------------------------------------------------ */

function SyncPanel({ phase, elapsed: _elapsed }: { phase: Phase; elapsed: number }) {
  const showMsg1 = phase !== 'idle'
  const showMsg2 = phase === 'responding' || phase === 'done'

  // Activation bar for WebShop: active from sending until done
  const wsActive = phase !== 'idle'
  const wsWaiting = phase === 'processing' || phase === 'sending'
  // Activation bar for Lager: active while processing / responding
  const lagerActive = phase === 'processing' || phase === 'responding'

  // WebShop is active from sending until done, bar spans full range
  const wsBarTop = MSG1_Y - 8
  const wsBarBottom = MSG2_Y + 8  // always full height when active
  // Lager activation
  const lgBarTop = MSG1_Y - 8
  const lgBarBottom = MSG2_Y + 8  // always full height when active

  return (
    <div className="flex-1 min-w-[280px]">
      <h4 className="text-base font-bold text-text mb-2 text-center">
        Synchrone Kommunikation
      </h4>

      <div className="bg-white rounded-lg border border-border p-2">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="xMidYMin meet"
          className="w-full"
          role="img"
          aria-label="Synchrone Kommunikation: WebShop wartet auf Antwort vom Lager"
        >
          <LifelineHeader x={WEBSHOP_X} label="WebShop" />
          <LifelineHeader x={LAGER_X} label="Lager" />

          {/* WebShop activation bar */}
          {wsActive && (
            <motion.rect
              x={WEBSHOP_X - ACTIVATION_W / 2}
              y={wsBarTop}
              width={ACTIVATION_W}
              rx={2}
              fill={wsWaiting ? '#fef3c7' : '#dbeafe'}
              stroke={wsWaiting ? '#f59e0b' : '#3b82f6'}
              strokeWidth={1}
              initial={{ height: 0 }}
              animate={{ height: wsBarBottom - wsBarTop }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Lager activation bar */}
          {lagerActive && (
            <motion.rect
              x={LAGER_X - ACTIVATION_W / 2}
              y={lgBarTop}
              width={ACTIVATION_W}
              rx={2}
              fill="#dbeafe"
              stroke="#3b82f6"
              strokeWidth={1}
              initial={{ height: 0 }}
              animate={{ height: lgBarBottom - lgBarTop }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Message 1: WebShop -> Lager (sync: solid + filled arrow) */}
          {showMsg1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <line
                x1={WEBSHOP_X + ACTIVATION_W / 2}
                y1={MSG1_Y}
                x2={LAGER_X - ACTIVATION_W / 2}
                y2={MSG1_Y}
                stroke="#3b82f6"
                strokeWidth={2}
              />
              <FilledArrow x={LAGER_X - ACTIVATION_W / 2} y={MSG1_Y} direction="right" color="#3b82f6" />
              <text x={(WEBSHOP_X + LAGER_X) / 2} y={MSG1_Y - 8} textAnchor="middle" fontSize={10} fill="#3b82f6">
                pruefeVerfuegbarkeit()
              </text>
            </motion.g>
          )}

          {/* Travelling dot for message 1 */}
          {phase === 'sending' && (
            <motion.circle
              r={5}
              fill="#3b82f6"
              filter="drop-shadow(0 0 2px rgba(0,0,0,0.25))"
              initial={{ cx: WEBSHOP_X + ACTIVATION_W / 2, cy: MSG1_Y }}
              animate={{ cx: LAGER_X - ACTIVATION_W / 2, cy: MSG1_Y }}
              transition={{ duration: SEND_DURATION / 1000, ease: 'easeInOut' }}
            />
          )}

          {/* Waiting indicator on WebShop */}
          {wsWaiting && phase !== 'sending' && (
            <motion.circle
              cx={WEBSHOP_X}
              cy={(MSG1_Y + MSG2_Y) / 2}
              r={8}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="4 4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: `${WEBSHOP_X}px ${(MSG1_Y + MSG2_Y) / 2}px` }}
            />
          )}

          {/* "wartet..." label */}
          {wsWaiting && phase !== 'sending' && (
            <motion.text
              x={WEBSHOP_X - 30}
              y={(MSG1_Y + MSG2_Y) / 2 + 22}
              fontSize={9}
              fill="#f59e0b"
              fontStyle="italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              wartet...
            </motion.text>
          )}

          {/* Message 2: Lager -> WebShop (return: dashed + open arrow) */}
          {showMsg2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <line
                x1={LAGER_X - ACTIVATION_W / 2}
                y1={MSG2_Y}
                x2={WEBSHOP_X + ACTIVATION_W / 2}
                y2={MSG2_Y}
                stroke="#22c55e"
                strokeWidth={2}
                strokeDasharray="8 4"
              />
              <OpenArrow x={WEBSHOP_X + ACTIVATION_W / 2} y={MSG2_Y} direction="left" color="#22c55e" />
              <text x={(WEBSHOP_X + LAGER_X) / 2} y={MSG2_Y - 8} textAnchor="middle" fontSize={10} fill="#22c55e">
                verfuegbar: true
              </text>
            </motion.g>
          )}

          {/* Travelling dot for message 2 */}
          {phase === 'responding' && (
            <motion.circle
              r={5}
              fill="#22c55e"
              filter="drop-shadow(0 0 2px rgba(0,0,0,0.25))"
              initial={{ cx: LAGER_X - ACTIVATION_W / 2, cy: MSG2_Y }}
              animate={{ cx: WEBSHOP_X + ACTIVATION_W / 2, cy: MSG2_Y }}
              transition={{ duration: SEND_DURATION / 1000, ease: 'easeInOut' }}
            />
          )}
        </svg>
      </div>

      {/* Status label */}
      <div className="mt-2 min-h-[32px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.span key="idle" className="text-xs text-text-light italic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Bereit
            </motion.span>
          )}
          {(phase === 'sending' || phase === 'processing') && (
            <motion.span
              key="waiting"
              className="text-xs font-semibold text-warning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              WebShop wartet auf Antwort...
            </motion.span>
          )}
          {phase === 'responding' && (
            <motion.span key="resp" className="text-xs font-semibold text-success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Antwort kommt zurueck
            </motion.span>
          )}
          {phase === 'done' && (
            <motion.span key="done" className="text-xs font-semibold text-primary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Abgeschlossen
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Characteristics */}
      <ul className="mt-3 space-y-1 text-xs text-text-light">
        <li className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-warning-light shrink-0" />
          Sender wartet auf Antwort
        </li>
        <li className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-warning-light shrink-0" />
          Blockierend
        </li>
        <li className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success-light shrink-0" />
          Einfache Fehlerbehandlung
        </li>
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Panel: Asynchron                                                   */
/* ------------------------------------------------------------------ */

function AsyncPanel({ phase, elapsed: _elapsed }: { phase: Phase; elapsed: number }) {
  const showMsg1 = phase !== 'idle'
  const showMsg2 = phase === 'responding' || phase === 'done'

  // In async, WebShop is NOT active (fire-and-forget)
  // Lager processes independently
  const lagerActive = phase === 'processing' || phase === 'responding'

  const lgBarTop = MSG1_Y - 8
  const lgBarBottom =
    phase === 'done' || phase === 'responding' ? MSG2_Y + 8 : MSG1_Y + 50

  return (
    <div className="flex-1 min-w-[280px]">
      <h4 className="text-base font-bold text-text mb-2 text-center">
        Asynchrone Kommunikation
      </h4>

      <div className="bg-white rounded-lg border border-border p-2">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="xMidYMin meet"
          className="w-full"
          role="img"
          aria-label="Asynchrone Kommunikation: WebShop arbeitet weiter waehrend Lager verarbeitet"
        >
          <LifelineHeader x={WEBSHOP_X} label="WebShop" />
          <LifelineHeader x={LAGER_X} label="Lager" />

          {/* Lager activation bar */}
          {lagerActive && (
            <motion.rect
              x={LAGER_X - ACTIVATION_W / 2}
              y={lgBarTop}
              width={ACTIVATION_W}
              rx={2}
              fill="#dbeafe"
              stroke="#3b82f6"
              strokeWidth={1}
              initial={{ height: 0 }}
              animate={{ height: lgBarBottom - lgBarTop }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* WebShop short activation at sending point */}
          {showMsg1 && (
            <motion.rect
              x={WEBSHOP_X - ACTIVATION_W / 2}
              y={MSG1_Y - 8}
              width={ACTIVATION_W}
              rx={2}
              fill="#dbeafe"
              stroke="#3b82f6"
              strokeWidth={1}
              initial={{ height: 0 }}
              animate={{ height: 16 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Message 1: WebShop -> Lager (async: solid + OPEN arrow) */}
          {showMsg1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <line
                x1={WEBSHOP_X + ACTIVATION_W / 2}
                y1={MSG1_Y}
                x2={LAGER_X - ACTIVATION_W / 2}
                y2={MSG1_Y}
                stroke="#3b82f6"
                strokeWidth={2}
              />
              <OpenArrow x={LAGER_X - ACTIVATION_W / 2} y={MSG1_Y} direction="right" color="#3b82f6" />
              <text x={(WEBSHOP_X + LAGER_X) / 2} y={MSG1_Y - 8} textAnchor="middle" fontSize={10} fill="#3b82f6">
                pruefeVerfuegbarkeit()
              </text>
            </motion.g>
          )}

          {/* Travelling dot for message 1 */}
          {phase === 'sending' && (
            <motion.circle
              r={5}
              fill="#3b82f6"
              filter="drop-shadow(0 0 2px rgba(0,0,0,0.25))"
              initial={{ cx: WEBSHOP_X + ACTIVATION_W / 2, cy: MSG1_Y }}
              animate={{ cx: LAGER_X - ACTIVATION_W / 2, cy: MSG1_Y }}
              transition={{ duration: SEND_DURATION / 1000, ease: 'easeInOut' }}
            />
          )}

          {/* Working indicator on WebShop (active, not waiting) */}
          {phase === 'processing' && (
            <>
              {/* Animated gear/pulse to show "working" */}
              <motion.rect
                x={WEBSHOP_X - 22}
                y={(MSG1_Y + MSG2_Y) / 2 - 10}
                width={44}
                height={20}
                rx={4}
                fill="#dbeafe"
                stroke="#3b82f6"
                strokeWidth={1}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <motion.text
                x={WEBSHOP_X}
                y={(MSG1_Y + MSG2_Y) / 2 + 4}
                textAnchor="middle"
                fontSize={8}
                fontWeight="bold"
                fill="#3b82f6"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                arbeitet
              </motion.text>
            </>
          )}

          {/* Message 2: Lager -> WebShop (async callback: solid + open arrow) */}
          {showMsg2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <line
                x1={LAGER_X - ACTIVATION_W / 2}
                y1={MSG2_Y}
                x2={WEBSHOP_X + ACTIVATION_W / 2}
                y2={MSG2_Y}
                stroke="#3b82f6"
                strokeWidth={2}
              />
              <OpenArrow x={WEBSHOP_X + ACTIVATION_W / 2} y={MSG2_Y} direction="left" color="#3b82f6" />
              <text x={(WEBSHOP_X + LAGER_X) / 2} y={MSG2_Y - 8} textAnchor="middle" fontSize={10} fill="#3b82f6">
                callback(verfuegbar)
              </text>
            </motion.g>
          )}

          {/* Travelling dot for message 2 */}
          {phase === 'responding' && (
            <motion.circle
              r={5}
              fill="#3b82f6"
              filter="drop-shadow(0 0 2px rgba(0,0,0,0.25))"
              initial={{ cx: LAGER_X - ACTIVATION_W / 2, cy: MSG2_Y }}
              animate={{ cx: WEBSHOP_X + ACTIVATION_W / 2, cy: MSG2_Y }}
              transition={{ duration: SEND_DURATION / 1000, ease: 'easeInOut' }}
            />
          )}
        </svg>
      </div>

      {/* Status label */}
      <div className="mt-2 min-h-[32px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.span key="idle" className="text-xs text-text-light italic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Bereit
            </motion.span>
          )}
          {(phase === 'sending' || phase === 'processing') && (
            <motion.span
              key="working"
              className="text-xs font-semibold text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              WebShop arbeitet weiter...
            </motion.span>
          )}
          {phase === 'responding' && (
            <motion.span key="resp" className="text-xs font-semibold text-primary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Asynchroner Callback empfangen
            </motion.span>
          )}
          {phase === 'done' && (
            <motion.span key="done" className="text-xs font-semibold text-primary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Abgeschlossen
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Characteristics */}
      <ul className="mt-3 space-y-1 text-xs text-text-light">
        <li className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary-light shrink-0" />
          Sender arbeitet weiter
        </li>
        <li className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary-light shrink-0" />
          Nicht-blockierend
        </li>
        <li className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-warning-light shrink-0" />
          Callback noetig
        </li>
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function SyncAsyncComparison() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (elapsedRef.current) {
      clearInterval(elapsedRef.current)
      elapsedRef.current = null
    }
  }, [])

  // Clean up on unmount
  useEffect(() => clearTimers, [clearTimers])

  const startAnimation = useCallback(() => {
    clearTimers()
    setElapsed(0)
    setPhase('sending')

    // Elapsed counter for visual feedback
    elapsedRef.current = setInterval(() => {
      setElapsed((prev) => prev + 100)
    }, 100)

    // After message travel -> processing phase
    timerRef.current = setTimeout(() => {
      setPhase('processing')

      // After processing delay -> responding
      timerRef.current = setTimeout(() => {
        setPhase('responding')

        // After return message travel -> done
        timerRef.current = setTimeout(() => {
          setPhase('done')
          if (elapsedRef.current) {
            clearInterval(elapsedRef.current)
            elapsedRef.current = null
          }
        }, SEND_DURATION)
      }, PROCESS_DURATION)
    }, SEND_DURATION)
  }, [clearTimers])

  const handleReset = () => {
    clearTimers()
    setPhase('idle')
    setElapsed(0)
  }

  const isRunning = phase !== 'idle' && phase !== 'done'

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <h3 className="text-xl font-bold text-text mb-1">
          Synchron vs. Asynchron
        </h3>
        <p className="text-sm text-text-light">
          TechStore-Szenario: Der WebShop prueft die Verfuegbarkeit eines Produkts im Lager.
          Vergleiche, wie sich synchrone und asynchrone Kommunikation unterscheiden.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {phase === 'idle' && (
          <button
            onClick={startAnimation}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Nachricht senden und Animation starten"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <polygon points="5,3 17,10 5,17" />
            </svg>
            Nachricht senden
          </button>
        )}

        {isRunning && (
          <span className="text-sm text-text-light italic">Animation laeuft...</span>
        )}

        {phase === 'done' && (
          <button
            onClick={startAnimation}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Animation erneut abspielen"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0115.4-5.4M20 15a9 9 0 01-15.4 5.4" />
            </svg>
            Erneut abspielen
          </button>
        )}

        {phase !== 'idle' && (
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg border border-border text-text text-sm hover:bg-surface-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Zuruecksetzen"
          >
            Zuruecksetzen
          </button>
        )}
      </div>

      {/* Phase progress indicator */}
      {phase !== 'idle' && (
        <div className="flex items-center gap-2 text-xs text-text-light">
          {(['sending', 'processing', 'responding', 'done'] as Phase[]).map((p, i) => {
            const labels: Record<string, string> = {
              sending: 'Senden',
              processing: 'Verarbeiten',
              responding: 'Antworten',
              done: 'Fertig',
            }
            const phaseOrder: Phase[] = ['sending', 'processing', 'responding', 'done']
            const currentIdx = phaseOrder.indexOf(phase)
            const thisIdx = i
            const isActive = thisIdx === currentIdx
            const isDone = thisIdx < currentIdx

            return (
              <div key={p} className="flex items-center gap-1">
                {i > 0 && <span className="text-border mx-1">&#8594;</span>}
                <span
                  className={`px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-primary text-white font-semibold'
                      : isDone
                        ? 'bg-success/20 text-success'
                        : 'bg-surface-dark text-text-light'
                  }`}
                >
                  {labels[p]}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Side-by-side panels */}
      <div className="flex flex-col md:flex-row gap-4">
        <SyncPanel phase={phase} elapsed={elapsed} />
        <AsyncPanel phase={phase} elapsed={elapsed} />
      </div>

      {/* Comparison highlight */}
      <AnimatePresence>
        {phase === 'processing' && (
          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-lg p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-text">
              <span className="font-bold text-warning">Links (Synchron):</span>{' '}
              Der WebShop ist <strong>blockiert</strong> und wartet auf die Antwort vom Lager.
            </p>
            <p className="text-sm text-text mt-1">
              <span className="font-bold text-primary">Rechts (Asynchron):</span>{' '}
              Der WebShop <strong>arbeitet weiter</strong> und wird spaeter per Callback benachrichtigt.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
