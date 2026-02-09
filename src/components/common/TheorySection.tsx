import { useState } from 'react'
import { ContentBlocks } from './ContentBlockRenderer.tsx'
import type { TheorySection as TheorySectionType } from '../../types/index.ts'

interface Props {
  sections: TheorySectionType[]
}

function TheorySectionItem({ section, depth = 0 }: { section: TheorySectionType; depth?: number }) {
  const [expanded, setExpanded] = useState(true)
  const HeadingTag = depth === 0 ? 'h2' : depth === 1 ? 'h3' : 'h4'
  const headingSize = depth === 0 ? 'text-2xl' : depth === 1 ? 'text-xl' : 'text-lg'

  const inner = (
    <section className={depth === 0 ? '' : 'mb-8'}>
      <button
        className={`flex items-center gap-2 ${headingSize} font-bold text-text mb-3 hover:text-primary transition-colors w-full text-left ${depth === 0 ? 'border-l-4 border-primary pl-3' : ''}`}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <svg
          className={`w-4 h-4 transition-transform flex-shrink-0 ${expanded ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <HeadingTag className="inline">{section.title}</HeadingTag>
      </button>

      {expanded && (
        <div className={depth === 0 ? '' : 'pl-6'}>
          <ContentBlocks blocks={section.content} />

          {section.subsections?.map((sub) => (
            <TheorySectionItem key={sub.id} section={sub} depth={depth + 1} />
          ))}
        </div>
      )}
    </section>
  )

  if (depth === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-border p-6 mb-8">
        {inner}
      </div>
    )
  }

  return inner
}

export function TheorySectionComponent({ sections }: Props) {
  return (
    <div>
      {sections.map((section) => (
        <TheorySectionItem key={section.id} section={section} />
      ))}
    </div>
  )
}
