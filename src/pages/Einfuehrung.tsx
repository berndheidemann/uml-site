import { useState } from 'react'
import { TheorySectionComponent } from '../components/common/TheorySection.tsx'
import { RosettaStone } from '../components/interactive/uebergreifend/RosettaStone.tsx'
import { NotationFlashcards } from '../components/interactive/uebergreifend/NotationFlashcards.tsx'
import { einfuehrungContent } from '../data/content/einfuehrung.ts'

type TabId = 'theorie' | 'erkunden'

export default function Einfuehrung() {
  const [tab, setTab] = useState<TabId>('theorie')

  return (
    <div>
      <h1 className="text-3xl font-bold text-text mb-2">{einfuehrungContent.title}</h1>
      <p className="text-text-light mb-6">{einfuehrungContent.introduction}</p>

      <div className="border-b border-border mb-6" role="tablist">
        <div className="flex gap-1">
          <button
            role="tab"
            aria-selected={tab === 'theorie'}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'theorie' ? 'border-primary text-primary' : 'border-transparent text-text-light hover:text-text hover:border-border'}`}
            onClick={() => setTab('theorie')}
          >
            Theorie
          </button>
          <button
            role="tab"
            aria-selected={tab === 'erkunden'}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'erkunden' ? 'border-primary text-primary' : 'border-transparent text-text-light hover:text-text hover:border-border'}`}
            onClick={() => setTab('erkunden')}
          >
            Erkunden
          </button>
        </div>
      </div>

      {tab === 'theorie' && (
        <TheorySectionComponent sections={einfuehrungContent.sections} />
      )}

      {tab === 'erkunden' && (
        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-text mb-2">UML-Rosetta-Stone</h2>
            <p className="text-text-light mb-4">Dasselbe Szenario aus 5 verschiedenen UML-Perspektiven betrachtet.</p>
            <RosettaStone />
          </section>
          <section>
            <h2 className="text-2xl font-bold text-text mb-2">Notation-Schnelltrainer</h2>
            <p className="text-text-light mb-4">Teste dein Wissen über UML-Notationen mit Flashcards.</p>
            <NotationFlashcards />
          </section>
        </div>
      )}
    </div>
  )
}
