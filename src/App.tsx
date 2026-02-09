import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/common/Layout.tsx'
import { PageErrorBoundary } from './components/common/PageErrorBoundary.tsx'
import { AchievementToast } from './components/common/AchievementToast.tsx'

const Home = lazy(() => import('./pages/Home.tsx'))
const Einfuehrung = lazy(() => import('./pages/Einfuehrung.tsx'))
const Klassendiagramm = lazy(() => import('./pages/Klassendiagramm.tsx'))
const Sequenzdiagramm = lazy(() => import('./pages/Sequenzdiagramm.tsx'))
const Zustandsdiagramm = lazy(() => import('./pages/Zustandsdiagramm.tsx'))
const Aktivitaetsdiagramm = lazy(() => import('./pages/Aktivitaetsdiagramm.tsx'))
const UseCaseDiagramm = lazy(() => import('./pages/UseCaseDiagramm.tsx'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-text-light" role="status" aria-label="Seite wird geladen">
        <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span>Laden...</span>
      </div>
    </div>
  )
}

function PageWrapper({ children, name }: { children: React.ReactNode; name: string }) {
  return (
    <PageErrorBoundary pageName={name}>
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </PageErrorBoundary>
  )
}

function App() {
  return (
    <HashRouter>
      <AchievementToast />
      <Layout>
        <Routes>
          <Route path="/" element={<PageWrapper name="Start"><Home /></PageWrapper>} />
          <Route path="/einfuehrung" element={<PageWrapper name="Einführung"><Einfuehrung /></PageWrapper>} />
          <Route path="/klassendiagramm" element={<PageWrapper name="Klassendiagramm"><Klassendiagramm /></PageWrapper>} />
          <Route path="/sequenzdiagramm" element={<PageWrapper name="Sequenzdiagramm"><Sequenzdiagramm /></PageWrapper>} />
          <Route path="/zustandsdiagramm" element={<PageWrapper name="Zustandsdiagramm"><Zustandsdiagramm /></PageWrapper>} />
          <Route path="/aktivitaetsdiagramm" element={<PageWrapper name="Aktivitätsdiagramm"><Aktivitaetsdiagramm /></PageWrapper>} />
          <Route path="/usecasediagramm" element={<PageWrapper name="Use-Case-Diagramm"><UseCaseDiagramm /></PageWrapper>} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}

export default App
