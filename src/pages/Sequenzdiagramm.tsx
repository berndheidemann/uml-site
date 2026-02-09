import { ChapterLayout } from '../components/common/ChapterLayout.tsx'
import { TheorySectionComponent } from '../components/common/TheorySection.tsx'
import { InteractiveExample } from '../components/common/InteractiveExample.tsx'
import { ExerciseCard } from '../components/common/ExerciseCard.tsx'
import { TimedChallenge } from '../components/exercises/TimedChallenge.tsx'
import { DragDropExercise } from '../components/exercises/DragDropExercise.tsx'
import { sequenzdiagrammContent } from '../data/content/sequenzdiagramm.ts'
import {
  nachrichtenTypSchnelltrainer,
  rueckantwortVervollstaendiger,
  szenarioZuSequenzBuilder,
  reihenfolgePuzzle,
} from '../data/exercises/sequenzdiagramm.ts'

function TheorieTab() {
  return <TheorySectionComponent sections={sequenzdiagrammContent.sections} />
}

function BeispielTab() {
  if (!sequenzdiagrammContent.interactiveExample) return null
  const ex = sequenzdiagrammContent.interactiveExample
  return <InteractiveExample title={ex.title} description={ex.description} steps={ex.steps} />
}

function UebungenTab() {
  const total = 4
  return (
    <div className="space-y-6">
      <ExerciseCard index={1} total={total}>
        <TimedChallenge exercise={nachrichtenTypSchnelltrainer} />
      </ExerciseCard>
      <ExerciseCard index={2} total={total}>
        <DragDropExercise exercise={rueckantwortVervollstaendiger} />
      </ExerciseCard>
      <ExerciseCard index={3} total={total}>
        <DragDropExercise exercise={szenarioZuSequenzBuilder} />
      </ExerciseCard>
      <ExerciseCard index={4} total={total}>
        <DragDropExercise exercise={reihenfolgePuzzle} />
      </ExerciseCard>
    </div>
  )
}

export default function Sequenzdiagramm() {
  return (
    <ChapterLayout
      title={sequenzdiagrammContent.title}
      tabs={[
        { id: 'theorie', label: 'Theorie', content: <TheorieTab /> },
        { id: 'beispiel', label: 'Beispiel', content: <BeispielTab /> },
        { id: 'uebungen', label: 'Übungen', content: <UebungenTab /> },
      ]}
    />
  )
}
