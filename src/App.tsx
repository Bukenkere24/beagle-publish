import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthGuard from './components/AuthGuard'
import Layout from './components/Layout'
import TopicsPage from './pages/TopicsPage'
import DraftEditorPage from './pages/DraftEditorPage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'

import LandingPage from './pages/LandingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route path="topics" element={<TopicsPage />} />
          <Route path="drafts/:id" element={<DraftEditorPage />} />
          <Route path="drafts" element={<Navigate to="/topics" replace />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
