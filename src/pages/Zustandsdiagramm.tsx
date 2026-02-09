import { ChapterLayout } from '../components/common/ChapterLayout.tsx'
import { TheorySectionComponent } from '../components/common/TheorySection.tsx'
import { InteractiveExample } from '../components/common/InteractiveExample.tsx'
import { ExerciseCard } from '../components/common/ExerciseCard.tsx'
import { DragDropExercise } from '../components/exercises/DragDropExercise.tsx'
import { GuardEvaluatorComponent } from '../components/exercises/zustandsdiagramm/GuardEvaluator.tsx'
import { ZustandsautomatSimulator } from '../components/exercises/zustandsdiagramm/ZustandsautomatSimulator.tsx'
import { zustandsdiagrammContent } from '../data/content/zustandsdiagramm.ts'
import {
  entryExitZuordner,
  guardEvaluator,
  zustandsautomatSimulator,
} from '../data/exercises/zustandsdiagramm.ts'

function TheorieTab() {
  return <TheorySectionComponent sections={zustandsdiagrammContent.sections} />
}

function BeispielTab() {
  if (!zustandsdiagrammContent.interactiveExample) return null
  const ex = zustandsdiagrammContent.interactiveExample
  return <InteractiveExample title={ex.title} description={ex.description} steps={ex.steps} />
}

function UebungenTab() {
  const total = 3
  return (
    <div className="space-y-6">
      <ExerciseCard index={1} total={total}>
        <DragDropExercise exercise={entryExitZuordner} />
      </ExerciseCard>
      <ExerciseCard index={2} total={total}>
        <GuardEvaluatorComponent exercise={guardEvaluator} />
      </ExerciseCard>
      <ExerciseCard index={3} total={total}>
        <ZustandsautomatSimulator exercise={zustandsautomatSimulator} />
      </ExerciseCard>
    </div>
  )
}

export default function Zustandsdiagramm() {
  return (
    <ChapterLayout
      title={zustandsdiagrammContent.title}
      tabs={[
        { id: 'theorie', label: 'Theorie', content: <TheorieTab /> },
        { id: 'beispiel', label: 'Beispiel', content: <BeispielTab /> },
        { id: 'uebungen', label: 'Übungen', content: <UebungenTab /> },
      ]}
    />
  )
}
