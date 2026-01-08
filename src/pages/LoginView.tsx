import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/authService'
import { useToastStore } from '@/store/useToastStore'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import './LoginView.css'

export function LoginView() {
  const navigate = useNavigate()
  const { success, error: showError } = useToastStore()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        await authService.login(formData.email, formData.password)
        success('Login realizado com sucesso!')
        navigate('/')
      } else {
        if (!formData.name) {
          showError('Nome é obrigatório para registro')
          setLoading(false)
          return
        }
        await authService.register(formData.email, formData.password, formData.name)
        success('Conta criada com sucesso!')
        navigate('/')
      }
    } catch (error: any) {
      console.error('Erro no login/registro:', error)
      const errorMessage = 
        error.response?.data?.error?.message || 
        error.response?.data?.message ||
        error.message ||
        'Erro ao fazer login/registro'
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen message={isLogin ? 'Fazendo login...' : 'Criando conta...'} />
  }

  return (
    <div className="login-view">
      <div className="login-card">
        <h1>B2B Lead Generator</h1>
        <h2>{isLogin ? 'Login' : 'Criar Conta'}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome"
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn-primary">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <div className="login-footer">
          <button
            type="button"
            className="btn-link"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? 'Não tem conta? Criar conta'
              : 'Já tem conta? Fazer login'}
          </button>
        </div>
      </div>
    </div>
  )
}

