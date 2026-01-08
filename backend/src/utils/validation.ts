import { z } from 'zod'

// Schemas de validação
export const leadSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  linkedinUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  jobTitle: z.string().min(1, 'Cargo é obrigatório'),
  company: z.object({
    name: z.string().min(1, 'Nome da empresa é obrigatório'),
    domain: z.string().min(1, 'Domínio é obrigatório'),
    industry: z.string().optional(),
    size: z.string().optional(),
    revenue: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    logo: z.string().optional(),
    website: z.string().optional(),
    linkedinUrl: z.string().optional(),
  }),
  stage: z.enum(['unknown', 'aware', 'considering', 'deciding', 'acting']).optional(),
  score: z.number().min(0).max(100).optional(),
})

export const searchFiltersSchema = z.object({
  jobTitle: z.array(z.string()).optional(),
  companySize: z.array(z.string()).optional(),
  industry: z.array(z.string()).optional(),
  location: z.array(z.string()).optional(),
  seniority: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
}).refine(
  (data) => {
    // Pelo menos um filtro deve ser fornecido
    return (
      (data.jobTitle && data.jobTitle.length > 0) ||
      (data.companySize && data.companySize.length > 0) ||
      (data.industry && data.industry.length > 0) ||
      (data.location && data.location.length > 0) ||
      (data.keywords && data.keywords.length > 0)
    )
  },
  {
    message: 'Pelo menos um filtro deve ser fornecido',
  }
)

export const communicationSchema = z.object({
  leadId: z.string().uuid('ID do lead inválido'),
  channel: z.enum(['email', 'whatsapp', 'linkedin']),
  type: z.enum(['sent', 'received']),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  subject: z.string().optional(),
})

export const dailyActivitySchema = z.object({
  leadId: z.string().uuid('ID do lead inválido'),
  channel: z.enum(['email', 'whatsapp', 'linkedin']),
  message: z.string().min(1, 'Mensagem é obrigatória'),
  linkedinAction: z.enum(['connect', 'connect_with_message', 'like_post', 'comment_post']).optional(),
  linkedinPostId: z.string().optional(),
})

export const webhookSchema = z.object({
  url: z.string().url('URL inválida'),
  events: z.array(z.string()).min(1, 'Pelo menos um evento é obrigatório'),
  secret: z.string().optional(),
})

// Helper para validar
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}

// Helper para validação segura (retorna erro ao invés de throw)
export function safeValidate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

