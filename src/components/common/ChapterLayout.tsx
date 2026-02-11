import { useState } from 'react'
import type { ReactNode } from 'react'

type TabId = 'theorie' | 'beispiel' | 'erkunden' | 'uebungen'

interface Tab {
  id: TabId
  label: string
  content: ReactNode
}

interface Props {
  title: string
  tabs: Tab[]
  defaultTab?: TabId
}

export function ChapterLayout({ title, tabs, defaultTab = 'theorie' }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab)
  const currentTab = tabs.find((t) => t.id === activeTab) ?? tabs[0]

  return (
    <div>
      <h1 className="text-3xl font-bold text-text mb-6">{title}</h1>

      <div className="border-b border-border mb-6" role="tablist" aria-label={`${title} Abschnitte`}>
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-light hover:text-text hover:border-border'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`tabpanel-${currentTab.id}`}
        aria-labelledby={`tab-${currentTab.id}`}
        tabIndex={0}
      >
        {currentTab.content}
      </div>
    </div>
  )
}
