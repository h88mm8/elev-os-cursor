import { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { authService } from '@/services/authService'
import { useToastStore } from '@/store/useToastStore'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { success } = useToastStore()
  const user = authService.getUser()

  const handleLogout = async () => {
    await authService.logout()
    success('Logout realizado com sucesso!')
    navigate('/login')
  }

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="logo">
          <h1>B2B Lead</h1>
        </div>
        <ul className="nav-menu">
          <li>
            <Link
              to="/"
              className={location.pathname === '/' ? 'active' : ''}
            >
              Sistema Solar
            </Link>
          </li>
          <li>
            <Link
              to="/feed"
              className={location.pathname === '/feed' ? 'active' : ''}
            >
              Feed Diário
            </Link>
          </li>
          <li>
            <Link
              to="/search"
              className={location.pathname === '/search' ? 'active' : ''}
            >
              Buscar Leads
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={location.pathname === '/settings' ? 'active' : ''}
            >
              Configurações
            </Link>
          </li>
        </ul>
        <div className="user-section">
          <div className="user-info">
            <span className="user-name">{user?.name || 'Usuário'}</span>
            <span className="user-email">{user?.email || ''}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

