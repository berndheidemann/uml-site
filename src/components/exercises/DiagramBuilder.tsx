import { useState } from 'react'
import { UmlDiagram } from '../common/UmlDiagram.tsx'
import { ExerciseFeedback } from '../common/ExerciseFeedback.tsx'
import { useExercise } from '../../hooks/useExercise.ts'
import type { DiagramBuilderExercise } from '../../types/index.ts'

interface Props {
  exercise: DiagramBuilderExercise
  onNext?: () => void
}

export function DiagramBuilder({ exercise, onNext }: Props) {
  const { result, showHints, submit, reset, toggleHints } = useExercise<string[]>(exercise)
  const [currentStep, setCurrentStep] = useState(0)
  const [stepAnswers, setStepAnswers] = useState<string[]>(exercise.steps.map(() => ''))
  const [stepResults, setStepResults] = useState<(boolean | null)[]>(exercise.steps.map(() => null))

  const step = exercise.steps[currentStep]

  const handleCodeChange = (value: string) => {
    if (result) return
    const newAnswers = [...stepAnswers]
    newAnswers[currentStep] = value
    setStepAnswers(newAnswers)
  }

  const checkStep = () => {
    const userCode = stepAnswers[currentStep].trim()
    const expectedCode = step.expectedCode.trim()
    // Normalize whitespace for comparison
    const normalize = (s: string) => s.replace(/\s+/g, ' ').toLowerCase()
    const isCorrect = normalize(userCode) === normalize(expectedCode)

    const newResults = [...stepResults]
    newResults[currentStep] = isCorrect
    setStepResults(newResults)

    if (isCorrect && currentStep < exercise.steps.length - 1) {
      setTimeout(() => setCurrentStep((s) => s + 1), 500)
    } else if (isCorrect && currentStep === exercise.steps.length - 1) {
      // All steps done
      const correctCount = newResults.filter((r) => r === true).length
      submit(() => ({
        correct: correctCount === exercise.steps.length,
        score: Math.round((correctCount / exercise.steps.length) * exercise.maxPoints),
        maxScore: exercise.maxPoints,
        feedback: correctCount === exercise.steps.length
          ? 'Diagramm komplett und korrekt aufgebaut!'
          : `${correctCount} von ${exercise.steps.length} Schritten korrekt.`,
      }))
    }
  }

  const handleReset = () => {
    reset()
    setCurrentStep(0)
    setStepAnswers(exercise.steps.map(() => ''))
    setStepResults(exercise.steps.map(() => null))
  }

  // Build current diagram code from completed steps
  const currentDiagramCode = stepAnswers
    .slice(0, currentStep + 1)
    .filter((_code, i) => stepResults[i] === true || i === currentStep)
    .join('\n')

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-text mb-2">{exercise.title}</h3>
        <p className="text-text-light">{exercise.description}</p>
      </div>

      {/* Step progress */}
      <div className="flex items-center gap-2">
        {exercise.steps.map((s, i) => (
          <button
            key={s.id}
            onClick={() => !result && setCurrentStep(i)}
            disabled={!!result}
            className={`w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center transition-colors ${
              stepResults[i] === true
                ? 'bg-success text-white'
                : stepResults[i] === false
                  ? 'bg-error text-white'
                  : i === currentStep
                    ? 'bg-primary text-white'
                    : 'bg-surface-dark text-text-light'
            }`}
            aria-label={`Schritt ${i + 1}: ${s.instruction}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code editor */}
        <div>
          <p className="text-sm font-medium text-text mb-2">
            Schritt {currentStep + 1}: {step.instruction}
          </p>
          <textarea
            value={stepAnswers[currentStep]}
            onChange={(e) => handleCodeChange(e.target.value)}
            disabled={!!result || stepResults[currentStep] === true}
            rows={8}
            className="w-full font-mono text-sm p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y bg-white disabled:bg-surface-dark"
            placeholder="PlantUML-Code hier eingeben..."
            aria-label={`Code für Schritt ${currentStep + 1}`}
          />

          {step.hints && stepResults[currentStep] === false && (
            <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">{step.hints[0]}</p>
            </div>
          )}

          {!result && stepResults[currentStep] !== true && (
            <button
              onClick={checkStep}
              disabled={!stepAnswers[currentStep].trim()}
              className="mt-3 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Schritt prüfen
            </button>
          )}
        </div>

        {/* Live preview */}
        <div>
          <p className="text-sm font-medium text-text-light mb-2">Vorschau:</p>
          {currentDiagramCode.trim() ? (
            <UmlDiagram
              code={currentDiagramCode}
              alt={`Diagramm Schritt ${currentStep + 1}`}
              className="bg-white rounded-lg border border-border p-4"
            />
          ) : (
            <div className="bg-surface-dark rounded-lg border border-border p-8 text-center text-text-light text-sm">
              Code eingeben um Vorschau zu sehen
            </div>
          )}
        </div>
      </div>

      {result && (
        <ExerciseFeedback
          result={result}
          hints={exercise.hints}
          showHints={showHints}
          onToggleHints={toggleHints}
          onRetry={handleReset}
          onNext={onNext}
        />
      )}
    </div>
  )
}
