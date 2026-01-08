import OpenAI from 'openai'
import { config } from '../config'
import { Lead, DailyActivity, CommunicationChannel, LeadStage } from '../models/Lead'
import { retryRequest } from '../utils/retry'
import logger from '../utils/logger'

class OpenAIService {
  private client: OpenAI
  private apiKey: string

  constructor() {
    this.apiKey = config.openai.apiKey
    
    if (!this.apiKey) {
      logger.warn('OpenAI API Key não configurada. As chamadas falharão.')
    }

    this.client = new OpenAI({
      apiKey: this.apiKey,
      timeout: 60000, // 60 segundos para respostas longas
    })
  }

  private validateApiKey() {
    if (!this.apiKey) {
      throw new Error('OpenAI API Key não configurada. Configure OPENAI_API_KEY no arquivo .env')
    }
  }

  async analyzeLead(leadId: string, lead: Lead, companyData?: any): Promise<any> {
    try {
      this.validateApiKey()

      logger.info(`Analisando lead ${leadId} com OpenAI`)

      const prompt = `Analise estrategicamente este lead B2B e forneça insights:

Nome: ${lead.firstName} ${lead.lastName}
Cargo: ${lead.jobTitle}
Empresa: ${lead.company.name}
Indústria: ${lead.company.industry}
Tamanho da Empresa: ${lead.company.size}
Localização: ${lead.company.location}
Descrição da Empresa: ${lead.company.description}

Forneça uma análise estratégica com:
1. Resumo executivo
2. Principais pontos de dor (pain points) que nosso produto pode resolver
3. Oportunidades identificadas
4. Abordagem recomendada para abordar este lead

Formate a resposta como JSON com as seguintes chaves:
- summary (string)
- painPoints (array de strings)
- opportunities (array de strings)
- recommendedApproach (string)`

      const response = await retryRequest(
        async () => {
          return await this.client.chat.completions.create({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'Você é um especialista em vendas B2B e análise de leads. Forneça análises estratégicas detalhadas e acionáveis.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' },
          })
        },
        {
          maxAttempts: 2,
          onRetry: (attempt, error) => {
            logger.warn(`Tentativa ${attempt} falhou ao analisar lead:`, error.message)
          },
        }
      )

      const analysis = JSON.parse(response.choices[0]?.message?.content || '{}')

      return {
        leadId,
        strategicAnalysis: {
          summary: analysis.summary || '',
          painPoints: analysis.painPoints || [],
          opportunities: analysis.opportunities || [],
          recommendedApproach: analysis.recommendedApproach || '',
        },
        analyzedAt: new Date(),
      }
    } catch (error: any) {
      console.error('Erro ao analisar lead com OpenAI:', error.message)
      throw new Error(`Falha na análise: ${error.message}`)
    }
  }

  async generateDailyActivities(leadIds: string[], leads: Lead[]): Promise<DailyActivity[]> {
    try {
      this.validateApiKey()

      logger.info(`Gerando atividades diárias para ${leads.length} leads`)

      const activities: DailyActivity[] = []

      // Processar em lotes para não sobrecarregar a API
      const batchSize = 5
      for (let i = 0; i < leads.length; i += batchSize) {
        const batch = leads.slice(i, i + batchSize)
        
        const batchActivities = await Promise.all(
          batch
            .filter(lead => leadIds.includes(lead.id))
            .map(lead => this.generateActivityForLead(lead))
        )

        activities.push(...batchActivities.filter(Boolean) as DailyActivity[])
      }

      logger.info(`${activities.length} atividades geradas com sucesso`)
      return activities
    } catch (error: any) {
      logger.error('Erro ao gerar atividades diárias:', error)
      throw new Error(`Falha ao gerar atividades: ${error.message}`)
    }
  }

  private async generateActivityForLead(lead: Lead): Promise<DailyActivity | null> {
    try {
      this.validateApiKey()

      const prompt = `Para este lead B2B, gere uma atividade diária de outreach:

Nome: ${lead.firstName} ${lead.lastName}
Cargo: ${lead.jobTitle}
Empresa: ${lead.company.name}
Estágio Atual: ${lead.stage}
Último Contato: ${lead.lastContactDate || 'Nunca'}

Considere:
- O estágio do lead no funil
- A melhor forma de abordagem (email, WhatsApp, LinkedIn)
- Uma mensagem personalizada e persuasiva
- O timing ideal

Responda em JSON com:
- channel: "email", "whatsapp" ou "linkedin"
- message: mensagem personalizada
- linkedinAction (opcional): "connect", "connect_with_message", "like_post", "comment_post"
- reasoning: explicação da escolha

Seja conciso e acionável.`

      const response = await retryRequest(
        async () => {
          return await this.client.chat.completions.create({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'Você é um especialista em vendas B2B e geração de atividades de outreach. Crie mensagens personalizadas e eficazes.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.8,
            response_format: { type: 'json_object' },
          })
        },
        {
          maxAttempts: 2,
        }
      )

      const activityData = JSON.parse(response.choices[0]?.message?.content || '{}')

      return {
        id: `activity-${Date.now()}-${Math.random()}`,
        leadId: lead.id,
        date: new Date(),
        channel: activityData.channel as CommunicationChannel,
        message: activityData.message || '',
        linkedinAction: activityData.linkedinAction,
        linkedinPostId: activityData.linkedinPostId,
        status: 'pending',
        createdAt: new Date(),
      }
    } catch (error: any) {
      logger.error(`Erro ao gerar atividade para lead ${lead.id}:`, error)
      return null
    }
  }

  async generateMessage(
    leadId: string,
    channel: string,
    context?: string
  ): Promise<string> {
    try {
      this.validateApiKey()

      logger.info(`Gerando mensagem para lead ${leadId} no canal ${channel}`)

      const prompt = `Gere uma mensagem personalizada para um lead B2B.

Canal: ${channel}
Contexto: ${context || 'Sem contexto adicional'}

A mensagem deve ser:
- Profissional mas calorosa
- Personalizada e relevante
- Com call-to-action claro
- Concisa (máximo 150 palavras)

Gere apenas a mensagem, sem formatação adicional.`

      const response = await retryRequest(
        async () => {
          return await this.client.chat.completions.create({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'Você é um especialista em copywriting para vendas B2B. Escreva mensagens persuasivas e personalizadas.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.8,
            max_tokens: 300,
          })
        },
        {
          maxAttempts: 2,
        }
      )

      const message = response.choices[0]?.message?.content || ''
      logger.info(`Mensagem gerada com sucesso (${message.length} caracteres)`)
      return message
    } catch (error: any) {
      logger.error('Erro ao gerar mensagem:', error)
      
      if (error.status === 401) {
        throw new Error('OpenAI API Key inválida')
      } else if (error.status === 429) {
        throw new Error('Limite de requisições da OpenAI excedido')
      }
      
      throw new Error(`Falha ao gerar mensagem: ${error.message}`)
    }
  }
}

export const openAIService = new OpenAIService()

