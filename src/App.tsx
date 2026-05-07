import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthGuard from './components/AuthGuard'
import Layout from './components/Layout'
import TopicsPage from './pages/TopicsPage'
import DraftEditorPage from './pages/DraftEditorPage'
import SettingsPage from './pages/SettingsPage'
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage'
import { RoleGuard } from './components/RoleGuard'

import AuthCallback from './pages/AuthCallback'

import LandingPage from './pages/LandingPage'

import { Toaster } from 'sonner'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" theme="dark" richColors />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
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
          <Route
            path="admin"
            element={
              <RoleGuard allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleGuard>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
