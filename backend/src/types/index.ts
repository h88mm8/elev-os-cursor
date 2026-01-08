export enum LeadStage {
  UNKNOWN = 'unknown',
  AWARE = 'aware',
  CONSIDERING = 'considering',
  DECIDING = 'deciding',
  ACTING = 'acting',
}

export enum CommunicationChannel {
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  LINKEDIN = 'linkedin',
}

export interface SearchFilters {
  jobTitle?: string[]
  companySize?: string[]
  industry?: string[]
  location?: string[]
  seniority?: string[]
  keywords?: string[]
}

export interface TrackingEvent {
  id: string
  type: 'page_view' | 'scroll' | 'cta_click'
  url: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface TrackingData {
  leadId: string
  companyDomain: string
  events: TrackingEvent[]
}

