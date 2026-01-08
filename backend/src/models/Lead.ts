import { LeadStage, CommunicationChannel } from '../types'

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
  score: number
  lastContactDate?: Date
  nextActivityDate?: Date
  profilePicture?: string
  createdAt: Date
  updatedAt: Date
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

export interface Communication {
  id: string
  leadId: string
  channel: CommunicationChannel
  type: 'sent' | 'received'
  content: string
  subject?: string
  sentAt: Date
  delivered?: boolean
  opened?: boolean
  clicked?: boolean
  replied?: boolean
}

export interface DailyActivity {
  id: string
  leadId: string
  date: Date
  channel: CommunicationChannel
  message: string
  linkedinAction?: string
  linkedinPostId?: string
  status: 'pending' | 'approved' | 'edited' | 'ignored'
  createdAt: Date
}

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

