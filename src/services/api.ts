import axios from 'axios'
import { Lead, SearchFilters, DailyActivity, AIAnalysis } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      // Redirecionar para login se necessário
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Apollo API
export const apolloService = {
  searchLeads: async (filters: SearchFilters): Promise<Lead[]> => {
    const response = await api.post('/apollo/search', filters)
    return response.data
  },

  enrichLead: async (leadId: string): Promise<Lead> => {
    const response = await api.post(`/apollo/enrich/${leadId}`)
    return response.data
  },
}

// Unipile API
export const unipileService = {
  sendEmail: async (leadId: string, subject: string, message: string) => {
    const response = await api.post('/unipile/email', { leadId, subject, message })
    return response.data
  },

  sendWhatsApp: async (leadId: string, message: string) => {
    const response = await api.post('/unipile/whatsapp', { leadId, message })
    return response.data
  },

  linkedinConnect: async (leadId: string, message?: string) => {
    const response = await api.post('/unipile/linkedin/connect', { leadId, message })
    return response.data
  },

  linkedinLikePost: async (leadId: string, postId: string) => {
    const response = await api.post('/unipile/linkedin/like', { leadId, postId })
    return response.data
  },

  linkedinCommentPost: async (leadId: string, postId: string, comment: string) => {
    const response = await api.post('/unipile/linkedin/comment', { leadId, postId, comment })
    return response.data
  },

  getCalendarLink: async (leadId: string) => {
    const response = await api.get(`/unipile/calendar/${leadId}`)
    return response.data
  },
}

// OpenAI Service
export const openAIService = {
  analyzeLead: async (leadId: string): Promise<AIAnalysis> => {
    const response = await api.post(`/openai/analyze/${leadId}`)
    return response.data
  },

  generateDailyActivities: async (leadIds: string[]): Promise<DailyActivity[]> => {
    const response = await api.post('/openai/daily-activities', { leadIds })
    return response.data
  },

  generateMessage: async (
    leadId: string,
    channel: string,
    context?: string
  ): Promise<string> => {
    const response = await api.post('/openai/generate-message', {
      leadId,
      channel,
      context,
    })
    return response.data.message
  },
}

// Tracking Service (Google Tag Manager)
export const trackingService = {
  getTrackingData: async (companyDomain: string): Promise<any> => {
    const response = await api.get(`/tracking/${encodeURIComponent(companyDomain)}`)
    return response.data
  },
}

// LinkedIn Scraping
export const linkedinScrapingService = {
  scrapePosts: async (leadId: string): Promise<any[]> => {
    const response = await api.post(`/linkedin/scrape-posts/${leadId}`)
    return response.data
  },
}

// Leads Service
export const leadsService = {
  getAll: async (): Promise<Lead[]> => {
    const response = await api.get('/leads')
    return response.data.data || []
  },

  getById: async (leadId: string): Promise<Lead> => {
    const response = await api.get(`/leads/${leadId}`)
    return response.data.data
  },

  create: async (lead: Lead): Promise<Lead> => {
    const response = await api.post('/leads', lead)
    return response.data.data
  },

  update: async (leadId: string, updates: Partial<Lead>): Promise<Lead> => {
    const response = await api.put(`/leads/${leadId}`, updates)
    return response.data.data
  },

  delete: async (leadId: string): Promise<void> => {
    await api.delete(`/leads/${leadId}`)
  },
}

// Communications Service
export const communicationsService = {
  getByLead: async (leadId: string): Promise<any[]> => {
    const response = await api.get(`/communications/lead/${leadId}`)
    return response.data.data || []
  },
}

// Settings Service
export const settingsService = {
  save: async (settings: any): Promise<void> => {
    // Salvar localmente e no backend se necessário
    localStorage.setItem('settings', JSON.stringify(settings))
  },

  load: async (): Promise<any> => {
    const saved = localStorage.getItem('settings')
    return saved ? JSON.parse(saved) : {}
  },
}

export default api

