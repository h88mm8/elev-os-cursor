import api from './api'
import { settingsService } from './settingsService'

export interface User {
  id: string
  email: string
  name: string
  role: string
}

export interface AuthResponse {
  user: User
  token: string
}

class AuthService {
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        name,
      })

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Erro ao criar conta')
      }

      const { user, token } = response.data.data

      // Salvar token
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user', JSON.stringify(user))

      return { user, token }
    } catch (error: any) {
      console.error('Erro no registro:', error)
      throw error
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Erro ao fazer login')
      }

      const { user, token } = response.data.data

      // Salvar token
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user', JSON.stringify(user))

      return { user, token }
    } catch (error: any) {
      console.error('Erro no login:', error)
      throw error
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  async verifyToken(): Promise<User | null> {
    try {
      const token = this.getToken()
      if (!token) return null

      const response = await api.post(
        '/auth/verify',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      return response.data.data.user
    } catch (error) {
      this.logout()
      return null
    }
  }
}

export const authService = new AuthService()

