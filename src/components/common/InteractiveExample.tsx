import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UmlDiagram } from './UmlDiagram.tsx'

interface Step {
  label: string
  diagramCode: string
  explanation: string
}

interface Props {
  title: string
  description: string
  steps: Step[]
}

export function InteractiveExample({ title, description, steps }: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const step = steps[currentStep]

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-2">{title}</h2>
      <p className="text-text-light mb-6">{description}</p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6" aria-label={`Schritt ${currentStep + 1} von ${steps.length}`}>
        {steps.map((s, i) => (
          <button
            key={i}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
              i === currentStep
                ? 'bg-primary text-white'
                : i < currentStep
                  ? 'bg-success/20 text-success'
                  : 'bg-surface-dark text-text-light'
            }`}
            onClick={() => setCurrentStep(i)}
            aria-label={`Schritt ${i + 1}: ${s.label}`}
            aria-current={i === currentStep ? 'step' : undefined}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
              {i < currentStep ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Diagram – full width */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <UmlDiagram
            code={step.diagramCode}
            alt={`Schritt ${currentStep + 1}: ${step.label}`}
            className="bg-white rounded-lg p-4 border border-border"
          />
          {currentStep > 0 && (
            <div className="flex items-center gap-2 text-xs text-text-light mt-2 px-1">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#d4edda', border: '1px solid #2e7d32' }} />
              <span>Neu in diesem Schritt</span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Explanation */}
      <div className="mt-4 bg-surface rounded-lg p-4 border border-border">
        <h3 className="text-lg font-semibold text-text mb-2">{step.label}</h3>
        <div
          className="text-text-light leading-relaxed"
          dangerouslySetInnerHTML={{ __html: step.explanation }}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 text-sm rounded-lg border border-border text-text hover:bg-surface-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Zurück
        </button>
        <button
          onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Weiter
        </button>
      </div>
    </div>
  )
}
