import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthGuard from './components/AuthGuard'
import Layout from './components/Layout'
import TopicsPage from './pages/TopicsPage'
import DraftEditorPage from './pages/DraftEditorPage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'
import AuthCallbackPage from './pages/AuthCallbackPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route index element={<Navigate to="/topics" replace />} />
          <Route path="topics" element={<TopicsPage />} />
          <Route path="drafts/:id" element={<DraftEditorPage />} />
          <Route path="drafts" element={<Navigate to="/topics" replace />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/topics" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
