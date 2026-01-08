import axios, { AxiosInstance } from 'axios'
import { config } from '../config'
import { CommunicationChannel, Lead } from '../models/Lead'
import { DataStorage } from '../utils/dataStorage'

import { retryRequest } from '../utils/retry'
import logger from '../utils/logger'

class UnipileService {
  private client: AxiosInstance
  private leadsStorage: DataStorage
  private apiKey: string

  constructor() {
    this.apiKey = config.unipile.apiKey
    
    if (!this.apiKey) {
      logger.warn('Unipile API Key não configurada. As chamadas falharão.')
    }

    this.client = axios.create({
      baseURL: config.unipile.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 segundos
    })
    this.leadsStorage = new DataStorage('leads')
  }

  private getAuthHeaders() {
    if (!this.apiKey) {
      throw new Error('Unipile API Key não configurada. Configure UNIPILE_API_KEY no arquivo .env')
    }
    
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    }
  }

  async sendEmail(leadId: string, subject: string, message: string) {
    try {
      if (!this.apiKey) {
        throw new Error('Unipile API Key não configurada')
      }

      // Buscar dados do lead primeiro
      const lead = await this.getLead(leadId)
      
      if (!lead?.email) {
        throw new Error('Lead não possui email')
      }

      logger.info(`Enviando email via Unipile para ${lead.email}`)

      // Unipile API - Enviar email
      // Formato pode variar, ajustar conforme documentação oficial
      const payload = {
        to: lead.email,
        subject,
        body: message,
        // Adicionar outros campos conforme necessário
      }

      const response = await retryRequest(
        () =>
          this.client.post('/emails/send', payload, {
            headers: this.getAuthHeaders(),
          }),
        {
          maxAttempts: 2,
          onRetry: (attempt, error) => {
            logger.warn(`Tentativa ${attempt} falhou ao enviar email:`, error.message)
          },
        }
      )

      logger.info(`Email enviado com sucesso. Message ID: ${response.data?.id || response.data?.message_id}`)

      return {
        success: true,
        messageId: response.data?.id || response.data?.message_id,
        channel: CommunicationChannel.EMAIL,
      }
    } catch (error: any) {
      logger.error('Erro ao enviar email via Unipile:', error)
      
      if (error.response?.status === 401) {
        throw new Error('Unipile API Key inválida. Verifique sua chave de API.')
      } else if (error.response?.status === 429) {
        throw new Error('Limite de requisições da Unipile excedido.')
      } else if (error.response?.data?.error) {
        throw new Error(`Erro da Unipile API: ${error.response.data.error}`)
      }
      
      throw new Error(`Falha ao enviar email: ${error.message}`)
    }
  }

  async sendWhatsApp(leadId: string, message: string) {
    try {
      if (!this.apiKey) {
        throw new Error('Unipile API Key não configurada')
      }

      const lead = await this.getLead(leadId)
      
      if (!lead?.phone) {
        throw new Error('Lead não possui telefone')
      }

      logger.info(`Enviando WhatsApp via Unipile para ${lead.phone}`)

      const payload = {
        to: lead.phone,
        message,
      }

      const response = await retryRequest(
        () =>
          this.client.post('/whatsapp/send', payload, {
            headers: this.getAuthHeaders(),
          }),
        {
          maxAttempts: 2,
        }
      )

      logger.info(`WhatsApp enviado com sucesso. Message ID: ${response.data?.id}`)

      return {
        success: true,
        messageId: response.data?.id || response.data?.message_id,
        channel: CommunicationChannel.WHATSAPP,
      }
    } catch (error: any) {
      logger.error('Erro ao enviar WhatsApp via Unipile:', error)
      
      if (error.response?.status === 401) {
        throw new Error('Unipile API Key inválida')
      }
      
      throw new Error(`Falha ao enviar WhatsApp: ${error.message}`)
    }
  }

  async linkedinConnect(leadId: string, message?: string) {
    try {
      if (!this.apiKey) {
        throw new Error('Unipile API Key não configurada')
      }

      const lead = await this.getLead(leadId)
      
      if (!lead?.linkedinUrl) {
        throw new Error('Lead não possui perfil LinkedIn')
      }

      logger.info(`Conectando no LinkedIn via Unipile para ${lead.linkedinUrl}`)

      const payload = {
        profile_url: lead.linkedinUrl,
        message: message || '',
      }

      const response = await retryRequest(
        () =>
          this.client.post('/linkedin/connect', payload, {
            headers: this.getAuthHeaders(),
          }),
        {
          maxAttempts: 2,
        }
      )

      logger.info(`LinkedIn connection enviada. Connection ID: ${response.data?.id}`)

      return {
        success: true,
        connectionId: response.data?.id || response.data?.connection_id,
        channel: CommunicationChannel.LINKEDIN,
      }
    } catch (error: any) {
      logger.error('Erro ao conectar no LinkedIn via Unipile:', error)
      
      if (error.response?.status === 401) {
        throw new Error('Unipile API Key inválida')
      } else if (error.response?.status === 403) {
        throw new Error('Não autorizado para conectar no LinkedIn. Verifique permissões.')
      }
      
      throw new Error(`Falha ao conectar no LinkedIn: ${error.message}`)
    }
  }

  async linkedinLikePost(leadId: string, postId: string) {
    try {
      if (!this.apiKey) {
        throw new Error('Unipile API Key não configurada')
      }

      logger.info(`Curtindo post ${postId} no LinkedIn via Unipile`)

      const payload = {
        post_id: postId,
      }

      const response = await retryRequest(
        () =>
          this.client.post('/linkedin/posts/like', payload, {
            headers: this.getAuthHeaders(),
          }),
        {
          maxAttempts: 2,
        }
      )

      return {
        success: true,
        actionId: response.data?.id || response.data?.action_id,
        channel: CommunicationChannel.LINKEDIN,
      }
    } catch (error: any) {
      logger.error('Erro ao curtir post no LinkedIn:', error)
      throw new Error(`Falha ao curtir post: ${error.message}`)
    }
  }

  async linkedinCommentPost(leadId: string, postId: string, comment: string) {
    try {
      if (!this.apiKey) {
        throw new Error('Unipile API Key não configurada')
      }

      logger.info(`Comentando post ${postId} no LinkedIn via Unipile`)

      const payload = {
        post_id: postId,
        comment,
      }

      const response = await retryRequest(
        () =>
          this.client.post('/linkedin/posts/comment', payload, {
            headers: this.getAuthHeaders(),
          }),
        {
          maxAttempts: 2,
        }
      )

      return {
        success: true,
        commentId: response.data?.id || response.data?.comment_id,
        channel: CommunicationChannel.LINKEDIN,
      }
    } catch (error: any) {
      logger.error('Erro ao comentar post no LinkedIn:', error)
      throw new Error(`Falha ao comentar post: ${error.message}`)
    }
  }

  async getCalendarLink(leadId: string) {
    try {
      if (!this.apiKey) {
        // Se não tiver API key, retornar link padrão
        return {
          link: `https://calendly.com/your-calendar/${leadId}`,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        }
      }

      logger.info(`Gerando link de calendário para lead ${leadId}`)

      const payload = {
        lead_id: leadId,
        duration: 30, // minutos
      }

      const response = await retryRequest(
        () =>
          this.client.post('/calendar/generate-link', payload, {
            headers: this.getAuthHeaders(),
          }),
        {
          maxAttempts: 2,
        }
      )

      return {
        link: response.data?.link || response.data?.calendar_link,
        expiresAt: response.data?.expires_at 
          ? new Date(response.data.expires_at)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }
    } catch (error: any) {
      logger.warn('Erro ao gerar link de calendário via Unipile, usando fallback:', error.message)
      // Retornar link padrão se a API falhar
      return {
        link: `https://calendly.com/your-calendar/${leadId}`,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      }
    }
  }

  private async getLead(leadId: string): Promise<Lead> {
    // Tentar buscar do banco de dados primeiro
    const useDatabase = process.env.DATABASE_URL ? true : false
    
    if (useDatabase) {
      try {
        const { db } = await import('../services/databaseService')
        const lead = await db.getLeadById(leadId)
        if (lead) {
          return lead
        }
      } catch (error) {
        console.error('Erro ao buscar lead do banco:', error)
      }
    }

    // Fallback para storage local
    const lead = await this.leadsStorage.get(leadId)
    
    if (!lead) {
      throw new Error('Lead não encontrado')
    }

    return lead as Lead
  }
}

export const unipileService = new UnipileService()

