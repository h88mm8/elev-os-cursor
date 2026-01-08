import { PrismaClient } from '@prisma/client'
import { Lead, Company, Communication, DailyActivity } from '../models/Lead'

let prisma: PrismaClient | null = null

// Inicializar Prisma apenas se DATABASE_URL estiver disponível e for válido
const dbUrl = process.env.DATABASE_URL || ''
const isFakeDb = dbUrl.includes('user:password@localhost') || dbUrl === ''

if (dbUrl && !isFakeDb) {
  try {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
    console.log('✅ Prisma Client inicializado com banco de dados.')
  } catch (error) {
    console.warn('⚠️  Não foi possível inicializar Prisma. Usando fallback.')
    prisma = null
  }
} else {
  console.log('⚠️  DATABASE_URL não configurado ou inválido. Prisma não será usado.')
  prisma = null
}

export class DatabaseService {
  // Leads
  async createLead(leadData: any): Promise<Lead> {
    if (!prisma) {
      throw new Error('Database not available. Please configure DATABASE_URL.')
    }
    // Buscar ou criar company
    let company = await prisma.company.findUnique({
      where: { domain: leadData.company.domain },
    })

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: leadData.company.name,
          domain: leadData.company.domain,
          industry: leadData.company.industry || '',
          size: leadData.company.size || '',
          revenue: leadData.company.revenue || '',
          location: leadData.company.location || '',
          description: leadData.company.description,
          logo: leadData.company.logo,
          website: leadData.company.website,
          linkedinUrl: leadData.company.linkedinUrl,
        },
      })
    }

    const lead = await prisma.lead.create({
      data: {
        firstName: leadData.firstName,
        lastName: leadData.lastName,
        email: leadData.email,
        phone: leadData.phone,
        linkedinUrl: leadData.linkedinUrl,
        jobTitle: leadData.jobTitle,
        stage: leadData.stage || 'unknown',
        score: leadData.score || 0,
        lastContactDate: leadData.lastContactDate,
        nextActivityDate: leadData.nextActivityDate,
        profilePicture: leadData.profilePicture,
        companyId: company.id,
      },
      include: {
        company: true,
      },
    })

    return this.mapPrismaLead(lead)
  }

  async getLeadById(id: string): Promise<Lead | null> {
    if (!prisma) {
      throw new Error('Database not available. Please configure DATABASE_URL.')
    }
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { company: true },
    })

    return lead ? this.mapPrismaLead(lead) : null
  }

  async getAllLeads(): Promise<Lead[]> {
    if (!prisma) {
      throw new Error('Database not available. Please configure DATABASE_URL.')
    }
    const leads = await prisma.lead.findMany({
      include: { company: true },
      orderBy: { createdAt: 'desc' },
    })

    return leads.map((lead) => this.mapPrismaLead(lead))
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    if (!prisma) {
      throw new Error('Database not available. Please configure DATABASE_URL.')
    }
    const lead = await prisma.lead.update({
      where: { id },
      data: {
        firstName: updates.firstName,
        lastName: updates.lastName,
        email: updates.email,
        phone: updates.phone,
        linkedinUrl: updates.linkedinUrl,
        jobTitle: updates.jobTitle,
        stage: updates.stage,
        score: updates.score,
        lastContactDate: updates.lastContactDate,
        nextActivityDate: updates.nextActivityDate,
        profilePicture: updates.profilePicture,
      },
      include: { company: true },
    })

    return this.mapPrismaLead(lead)
  }

  async deleteLead(id: string): Promise<void> {
    if (!prisma) {
      throw new Error('Database not available. Please configure DATABASE_URL.')
    }
    await prisma.lead.delete({
      where: { id },
    })
  }

  // Communications
  async createCommunication(commData: any): Promise<Communication> {
    if (!prisma) {
      throw new Error('Database not available. Please configure DATABASE_URL.')
    }
    const comm = await prisma.communication.create({
      data: {
        leadId: commData.leadId,
        channel: commData.channel,
        type: commData.type,
        content: commData.content,
        subject: commData.subject,
        sentAt: commData.sentAt || new Date(),
        delivered: commData.delivered || false,
        opened: commData.opened || false,
        clicked: commData.clicked || false,
        replied: commData.replied || false,
      },
    })

    return this.mapPrismaCommunication(comm)
  }

  async getCommunicationsByLead(leadId: string): Promise<Communication[]> {
    if (!prisma) {
      throw new Error('Database not available. Please configure DATABASE_URL.')
    }
    const comms = await prisma.communication.findMany({
      where: { leadId },
      orderBy: { sentAt: 'desc' },
    })

    return comms.map((comm) => this.mapPrismaCommunication(comm))
  }

  // Daily Activities
  async createDailyActivity(activityData: any): Promise<DailyActivity> {
    if (!prisma) {
      throw new Error('Database not available. Please configure DATABASE_URL.')
    }
    const activity = await prisma.dailyActivity.create({
      data: {
        leadId: activityData.leadId,
        date: activityData.date || new Date(),
        channel: activityData.channel,
        message: activityData.message,
        linkedinAction: activityData.linkedinAction,
        linkedinPostId: activityData.linkedinPostId,
        status: activityData.status || 'pending',
      },
    })

    return this.mapPrismaActivity(activity)
  }

  async getDailyActivitiesByLead(leadId: string): Promise<DailyActivity[]> {
    if (!prisma) {
      throw new Error('Database not available. Please configure DATABASE_URL.')
    }
    const activities = await prisma.dailyActivity.findMany({
      where: { leadId },
      orderBy: { date: 'desc' },
    })

    return activities.map((act) => this.mapPrismaActivity(act))
  }

  // Tracking Events
  async createTrackingEvent(eventData: any): Promise<any> {
    if (!prisma) {
      throw new Error('Database not available. Please configure DATABASE_URL.')
    }
    return await prisma.trackingEvent.create({
      data: {
        leadId: eventData.leadId,
        domain: eventData.domain,
        type: eventData.type,
        url: eventData.url,
        metadata: eventData.metadata || {},
        timestamp: eventData.timestamp || new Date(),
      },
    })
  }

  async getTrackingEventsByDomain(domain: string): Promise<any[]> {
    if (!prisma) {
      throw new Error('Database not available. Please configure DATABASE_URL.')
    }
    return await prisma.trackingEvent.findMany({
      where: { domain },
      orderBy: { timestamp: 'desc' },
    })
  }

  // Mappers
  private mapPrismaLead(lead: any): Lead {
    return {
      id: lead.id,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email || undefined,
      phone: lead.phone || undefined,
      linkedinUrl: lead.linkedinUrl || undefined,
      jobTitle: lead.jobTitle,
      company: {
        id: lead.company.id,
        name: lead.company.name,
        domain: lead.company.domain,
        industry: lead.company.industry,
        size: lead.company.size,
        revenue: lead.company.revenue,
        location: lead.company.location,
        description: lead.company.description || '',
        logo: lead.company.logo || undefined,
        website: lead.company.website || undefined,
        linkedinUrl: lead.company.linkedinUrl || undefined,
      },
      stage: lead.stage as any,
      score: lead.score,
      lastContactDate: lead.lastContactDate || undefined,
      nextActivityDate: lead.nextActivityDate || undefined,
      profilePicture: lead.profilePicture || undefined,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    }
  }

  private mapPrismaCommunication(comm: any): Communication {
    return {
      id: comm.id,
      leadId: comm.leadId,
      channel: comm.channel as any,
      type: comm.type as 'sent' | 'received',
      content: comm.content,
      subject: comm.subject || undefined,
      sentAt: comm.sentAt,
      delivered: comm.delivered || undefined,
      opened: comm.opened || undefined,
      clicked: comm.clicked || undefined,
      replied: comm.replied || undefined,
    }
  }

  private mapPrismaActivity(act: any): DailyActivity {
    return {
      id: act.id,
      leadId: act.leadId,
      date: act.date,
      channel: act.channel as any,
      message: act.message,
      linkedinAction: act.linkedinAction || undefined,
      linkedinPostId: act.linkedinPostId || undefined,
      status: act.status as any,
      createdAt: act.createdAt,
    }
  }

  async disconnect() {
    if (prisma) {
      await prisma.$disconnect()
    }
  }

  // Verificar se o banco está disponível
  isAvailable(): boolean {
    return prisma !== null
  }
}

export const db = new DatabaseService()

