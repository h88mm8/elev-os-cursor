import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Layout } from './components/Layout'
import { SolarSystemView } from './pages/SolarSystemView'
import { FeedView } from './pages/FeedView'
import { LeadDetailView } from './pages/LeadDetailView'
import { SearchView } from './pages/SearchView'
import { SettingsView } from './pages/SettingsView'
import { LoginView } from './pages/LoginView'
import { ToastContainer } from './components/ToastContainer'
import { LoadingSpinner } from './components/LoadingSpinner'
import { useStore } from './store/useStore'
import { useToastStore } from './store/useToastStore'
import { authService } from './services/authService'
import { leadsService, settingsService } from './services/api'
import { trackPageView } from './utils/tracking'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        const user = await authService.verifyToken()
        setIsAuthenticated(!!user)
      } else {
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])

  if (isAuthenticated === null) {
    return <LoadingSpinner fullScreen message="Verificando autenticação..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  const { setLeads, setLoading, setError } = useStore()
  const { toasts, removeToast } = useToastStore()

  useEffect(() => {
    // Carregar configurações e inicializar GTM
    const loadSettings = async () => {
      try {
        const settings = await settingsService.load()
        if (settings?.apiKeys?.googleTagManager) {
          const { initializeGTM } = await import('./utils/tracking')
          initializeGTM(settings.apiKeys.googleTagManager)
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error)
      }
    }

    // Carregar leads salvos ao iniciar (apenas se autenticado)
    const loadLeads = async () => {
      if (!authService.isAuthenticated()) return

      setLoading(true)
      try {
        const leads = await leadsService.getAll()
        setLeads(leads)
      } catch (error: any) {
        console.error('Erro ao carregar leads:', error)
        if (error.response?.status !== 404) {
          setError('Erro ao carregar leads salvos')
        }
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
    loadLeads()
  }, [setLeads, setLoading, setError])

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<SolarSystemView />} />
                    <Route path="/feed" element={<FeedView />} />
                    <Route path="/lead/:id" element={<LeadDetailView />} />
                    <Route path="/search" element={<SearchView />} />
                    <Route path="/settings" element={<SettingsView />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </Router>
    </ErrorBoundary>
  )
}

export default App

