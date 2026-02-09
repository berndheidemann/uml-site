import type { ContentBlock } from '../../types/index.ts'
import { UmlDiagram } from './UmlDiagram.tsx'

function TextBlockView({ html }: { html: string }) {
  return (
    <div
      className="content-text"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function InfoBlockView({ title, html }: { title?: string; html: string }) {
  return (
    <div className="my-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4" role="note">
      <div className="flex gap-3">
        <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          {title && <p className="font-bold text-blue-800 mb-1">{title}</p>}
          <div className="content-text content-text-blue text-blue-700 text-sm" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  )
}

function TipBlockView({ title, html }: { title?: string; html: string }) {
  return (
    <div className="my-4 bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg p-4" role="note">
      <div className="flex gap-3">
        <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <div>
          {title && <p className="font-bold text-emerald-800 mb-1">{title}</p>}
          <div className="content-text content-text-emerald text-emerald-700 text-sm" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  )
}

function WarningBlockView({ title, html }: { title?: string; html: string }) {
  return (
    <div className="my-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4" role="alert">
      <div className="flex gap-3">
        <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          {title && <p className="font-bold text-amber-800 mb-1">{title}</p>}
          <div className="content-text content-text-amber text-amber-700 text-sm" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  )
}

function ImportantBlockView({ title, html }: { title?: string; html: string }) {
  return (
    <div className="my-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4" role="alert">
      <div className="flex gap-3">
        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          {title && <p className="font-bold text-red-800 mb-1">{title}</p>}
          <div className="content-text content-text-red text-red-700 text-sm" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  )
}

function ComparisonBlockView({ left, right }: { left: { title: string; color: string; points: string[] }; right: { title: string; color: string; points: string[] } }) {
  return (
    <div className="my-4 grid md:grid-cols-2 gap-4">
      <div className={`rounded-lg border border-slate-200 overflow-hidden`}>
        <div className={`px-4 py-2 font-bold text-white`} style={{ backgroundColor: left.color }}>
          {left.title}
        </div>
        <ul className="p-4 space-y-2">
          {left.points.map((point, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="text-slate-400 flex-shrink-0">&#8226;</span>
              <span dangerouslySetInnerHTML={{ __html: point }} />
            </li>
          ))}
        </ul>
      </div>
      <div className={`rounded-lg border border-slate-200 overflow-hidden`}>
        <div className={`px-4 py-2 font-bold text-white`} style={{ backgroundColor: right.color }}>
          {right.title}
        </div>
        <ul className="p-4 space-y-2">
          {right.points.map((point, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="text-slate-400 flex-shrink-0">&#8226;</span>
              <span dangerouslySetInnerHTML={{ __html: point }} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function TableBlockView({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full">
        <thead>
          <tr className="bg-slate-700 text-white">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left text-sm font-semibold" dangerouslySetInnerHTML={{ __html: h }} />
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3 text-sm border-t border-slate-200" dangerouslySetInnerHTML={{ __html: cell }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CodeBlockView({ code, label, language }: { code: string; label?: string; language?: string }) {
  return (
    <div className="my-4">
      {label && <div className="text-xs font-semibold text-slate-400 bg-slate-800 rounded-t-lg px-4 pt-3 pb-0">{label}</div>}
      <pre className={`bg-slate-800 text-slate-100 p-4 overflow-x-auto text-sm ${label ? 'rounded-b-lg' : 'rounded-lg'}`}>
        <code className={language ? `language-${language}` : ''}>{code}</code>
      </pre>
    </div>
  )
}

function DiagramBlockView({ code, alt, caption }: { code: string; alt: string; caption?: string }) {
  return (
    <figure className="my-4 bg-white rounded-lg shadow-sm border border-border p-4 flex flex-col items-center">
      <UmlDiagram code={code} alt={alt} className="w-full" />
      {caption && <figcaption className="mt-2 text-sm text-text-light italic text-center">{caption}</figcaption>}
    </figure>
  )
}

function SummaryBlockView({ title, points }: { title?: string; points: string[] }) {
  return (
    <div className="my-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
      <div className="flex gap-2 items-center mb-3">
        <svg className="w-5 h-5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-bold text-slate-700">{title ?? 'Zusammenfassung'}</p>
      </div>
      <ul className="space-y-2">
        {points.map((point, i) => (
          <li key={i} className="flex gap-2 text-sm text-slate-600">
            <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span dangerouslySetInnerHTML={{ __html: point }} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function ContentBlockItem({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'text':
      return <TextBlockView html={block.html} />
    case 'info':
      return <InfoBlockView title={block.title} html={block.html} />
    case 'tip':
      return <TipBlockView title={block.title} html={block.html} />
    case 'warning':
      return <WarningBlockView title={block.title} html={block.html} />
    case 'important':
      return <ImportantBlockView title={block.title} html={block.html} />
    case 'comparison':
      return <ComparisonBlockView left={block.left} right={block.right} />
    case 'table':
      return <TableBlockView headers={block.headers} rows={block.rows} />
    case 'code':
      return <CodeBlockView code={block.code} label={block.label} language={block.language} />
    case 'diagram':
      return <DiagramBlockView code={block.code} alt={block.alt} caption={block.caption} />
    case 'summary':
      return <SummaryBlockView title={block.title} points={block.points} />
  }
}

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => (
        <ContentBlockItem key={i} block={block} />
      ))}
    </div>
  )
}
