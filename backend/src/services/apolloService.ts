import axios, { AxiosInstance } from 'axios'
import { config } from '../config'
import { SearchFilters } from '../types'
import { Lead, Company } from '../models/Lead'
import { retryRequest } from '../utils/retry'
import logger from '../utils/logger'

class ApolloService {
  private client: AxiosInstance
  private apiKey: string

  constructor() {
    this.apiKey = config.apollo.apiKey
    
    if (!this.apiKey) {
      logger.warn('Apollo API Key não configurada. As chamadas falharão.')
    }

    this.client = axios.create({
      baseURL: config.apollo.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      timeout: 30000, // 30 segundos
    })
  }

  private getAuthHeaders() {
    if (!this.apiKey) {
      throw new Error('Apollo API Key não configurada. Configure no arquivo .env')
    }
    
    return {
      'X-Api-Key': this.apiKey,
    }
  }

  async searchLeads(filters: SearchFilters): Promise<Lead[]> {
    try {
      if (!this.apiKey) {
        throw new Error('Apollo API Key não configurada. Configure APOLLO_API_KEY no arquivo .env')
      }

      // Mapear filtros para formato da API Apollo
      const params: any = {
        per_page: 25,
        page: 1,
        api_key: this.apiKey,
      }

      // Person titles (cargos)
      if (filters.jobTitle && filters.jobTitle.length > 0) {
        params.person_titles = filters.jobTitle
      }

      // Industries
      if (filters.industry && filters.industry.length > 0) {
        params.organization_industries = filters.industry
      }

      // Company size (mapear para formato Apollo)
      if (filters.companySize && filters.companySize.length > 0) {
        // Apollo usa ranges como: "1,10", "11,50", etc
        params.organization_num_employees_ranges = filters.companySize.map(size => {
          const ranges: Record<string, string> = {
            '1-10': '1,10',
            '11-50': '11,50',
            '51-200': '51,200',
            '201-500': '201,500',
            '501-1000': '501,1000',
            '1001-5000': '1001,5000',
            '5001-10000': '5001,10000',
            '10001+': '10001,',
          }
          return ranges[size] || size
        })
      }

      // Locations
      if (filters.location && filters.location.length > 0) {
        params.person_locations = filters.location
      }

      // Keywords
      if (filters.keywords && filters.keywords.length > 0) {
        params.q_keywords = filters.keywords.join(' ')
      }

      logger.info('Buscando leads na Apollo com filtros:', params)

      const response = await retryRequest(
        () =>
          this.client.post('/mixed_people/search', params, {
            headers: this.getAuthHeaders(),
          }),
        {
          maxAttempts: 3,
          onRetry: (attempt, error) => {
            logger.warn(`Tentativa ${attempt} falhou ao buscar leads na Apollo:`, error.message)
          },
        }
      )

      logger.info(`Apollo retornou ${response.data?.people?.length || 0} leads`)

      const people = response.data?.people || []
      
      if (people.length === 0) {
        logger.warn('Nenhum lead encontrado com os filtros fornecidos')
        return []
      }
      
      return people.map((person: any) => this.mapApolloToLead(person))
    } catch (error: any) {
      logger.error('Erro ao buscar leads na Apollo:', error)
      
      // Tratar erros específicos da API
      if (error.response?.status === 401) {
        throw new Error('Apollo API Key inválida. Verifique sua chave de API.')
      } else if (error.response?.status === 429) {
        throw new Error('Limite de requisições da Apollo excedido. Tente novamente mais tarde.')
      } else if (error.response?.data?.error) {
        throw new Error(`Erro da Apollo API: ${error.response.data.error}`)
      }
      
      throw new Error(`Falha ao buscar leads: ${error.message}`)
    }
  }

  async enrichLead(leadId: string): Promise<Lead> {
    try {
      if (!this.apiKey) {
        throw new Error('Apollo API Key não configurada')
      }

      // Buscar dados enriquecidos do lead
      const response = await retryRequest(
        () =>
          this.client.get(`/people/${leadId}`, {
            headers: this.getAuthHeaders(),
            params: {
              api_key: this.apiKey,
            },
          }),
        {
          maxAttempts: 2,
        }
      )

      const person = response.data?.person || response.data
      if (!person) {
        throw new Error('Lead não encontrado na Apollo')
      }

      logger.info(`Lead ${leadId} enriquecido com sucesso`)
      return this.mapApolloToLead(person)
    } catch (error: any) {
      logger.error('Erro ao enriquecer lead na Apollo:', error)
      
      if (error.response?.status === 404) {
        throw new Error('Lead não encontrado na Apollo')
      } else if (error.response?.status === 401) {
        throw new Error('Apollo API Key inválida')
      }
      
      throw new Error(`Falha ao enriquecer lead: ${error.message}`)
    }
  }

  private mapApolloToLead(person: any): Lead {
    const company = this.mapApolloToCompany(person.organization || {})

    return {
      id: person.id || `apollo-${Date.now()}-${Math.random()}`,
      firstName: person.first_name || '',
      lastName: person.last_name || '',
      email: person.email,
      phone: person.phone_numbers?.[0]?.raw_number,
      linkedinUrl: person.linkedin_url,
      jobTitle: person.title || '',
      company,
      stage: 'unknown' as any,
      score: person.probability_score || 0,
      profilePicture: person.profile_pic_url,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  private mapApolloToCompany(org: any): Company {
    return {
      id: org.id || `company-${Date.now()}`,
      name: org.name || '',
      domain: org.primary_domain || '',
      industry: org.industry || '',
      size: org.estimated_num_employees?.toString() || '',
      revenue: org.estimated_annual_revenue?.toString() || '',
      location: this.formatLocation(org),
      description: org.organization_raw?.description || '',
      website: org.website_url,
      linkedinUrl: org.linkedin_url,
      logo: org.logo_url,
    }
  }

  private formatLocation(org: any): string {
    const city = org.city || ''
    const state = org.state || ''
    const country = org.country || ''
    const parts = [city, state, country].filter(Boolean)
    return parts.join(', ') || 'Não especificado'
  }
}

export const apolloService = new ApolloService()

