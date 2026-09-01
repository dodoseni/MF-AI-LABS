import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import './components/app.css'
import Dashboard from './pages/Dashboard'
import Certifications from './pages/Certifications'
import Competencies from './pages/Competencies'
import CareerPath from './pages/CareerPath'
import LearningPlan from './pages/LearningPlan'
import AiAssistant from './pages/AiAssistant'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/certifications': 'Certifications',
  '/competencies': 'Competency Development',
  '/career': 'Career Path',
  '/learning': 'Learning Plan',
  '/assistant': 'AI Assistant',
}

function Shell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const title = pageTitles[location.pathname] ?? 'LevelUP'

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <div className="app-shell">
      <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="main-area">
        <Topbar title={title} onMenu={() => setMobileOpen(true)} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/competencies" element={<Competencies />} />
            <Route path="/career" element={<CareerPath />} />
            <Route path="/learning" element={<LearningPlan />} />
            <Route path="/assistant" element={<AiAssistant />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return <Shell />
}
