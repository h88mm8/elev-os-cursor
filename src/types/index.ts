// Tipos principais do sistema

export enum LeadStage {
  UNKNOWN = 'unknown', // Desconhecido
  AWARE = 'aware', // Consciente
  CONSIDERING = 'considering', // Consideração
  DECIDING = 'deciding', // Decisão
  ACTING = 'acting', // Ação
}

export enum CommunicationChannel {
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  LINKEDIN = 'linkedin',
}

export enum LinkedInAction {
  CONNECT = 'connect',
  CONNECT_WITH_MESSAGE = 'connect_with_message',
  SEND_INVITE = 'send_invite',
  LIKE_POST = 'like_post',
  COMMENT_POST = 'comment_post',
}

export interface Company {
  id: string
  name: string
  domain: string
  industry: string
  size: string
  revenue: string
  location: string
  description: string
  logo?: string
  website?: string
  linkedinUrl?: string
}

export interface Lead {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  linkedinUrl?: string
  jobTitle: string
  company: Company
  stage: LeadStage
  score: number // 0-100
  lastContactDate?: Date
  nextActivityDate?: Date
  profilePicture?: string
  createdAt: Date
  updatedAt: Date
}

export interface LeadEnrichment {
  leadId: string
  email?: string
  phone?: string
  companyData?: Partial<Company>
  linkedinData?: {
    profileUrl: string
    connections: number
    posts: LinkedInPost[]
  }
  enrichmentDate: Date
}

export interface LinkedInPost {
  id: string
  content: string
  publishedDate: Date
  likes: number
  comments: number
  url: string
}

export interface AIAnalysis {
  leadId: string
  strategicAnalysis: {
    summary: string
    painPoints: string[]
    opportunities: string[]
    recommendedApproach: string
  }
  dailyAnalysis: {
    date: Date
    activity: DailyActivity
    reasoning: string
    confidence: number
  }
  analyzedAt: Date
}

export interface DailyActivity {
  id: string
  leadId: string
  date: Date
  channel: CommunicationChannel
  message: string
  linkedinAction?: LinkedInAction
  linkedinPostId?: string // Se for like/comment
  status: 'pending' | 'approved' | 'edited' | 'ignored'
  createdAt: Date
}

export interface Communication {
  id: string
  leadId: string
  channel: CommunicationChannel
  type: 'sent' | 'received'
  content: string
  subject?: string // Para email
  sentAt: Date
  delivered?: boolean
  opened?: boolean
  clicked?: boolean
  replied?: boolean
}

export interface TrackingData {
  leadId: string
  companyDomain: string
  events: TrackingEvent[]
}

export interface TrackingEvent {
  id: string
  type: 'page_view' | 'scroll' | 'cta_click'
  url: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface CalendarLink {
  id: string
  leadId: string
  link: string
  expiresAt?: Date
  used: boolean
}

export interface SearchFilters {
  jobTitle?: string[]
  companySize?: string[]
  industry?: string[]
  location?: string[]
  seniority?: string[]
  keywords?: string[]
}

