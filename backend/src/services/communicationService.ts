import { Communication, CommunicationChannel } from '../models/Lead'
import { DataStorage } from '../utils/dataStorage'

class CommunicationService {
  private storage: DataStorage

  constructor() {
    this.storage = new DataStorage('communications')
  }

  async saveCommunication(communication: Communication): Promise<Communication> {
    const key = `${communication.leadId}-${communication.id}`
    await this.storage.save(key, communication)
    return communication
  }

  async getCommunicationsByLead(leadId: string): Promise<Communication[]> {
    const allKeys = await this.storage.list()
    const leadKeys = allKeys.filter((key) => key.startsWith(`${leadId}-`))
    
    const communications: Communication[] = []
    
    for (const key of leadKeys) {
      const comm = await this.storage.get(key)
      if (comm) {
        communications.push({
          ...comm,
          sentAt: new Date(comm.sentAt),
        } as Communication)
      }
    }

    // Ordenar por data (mais recente primeiro)
    return communications.sort(
      (a, b) => b.sentAt.getTime() - a.sentAt.getTime()
    )
  }

  async getCommunicationsByChannel(
    leadId: string,
    channel: CommunicationChannel
  ): Promise<Communication[]> {
    const all = await this.getCommunicationsByLead(leadId)
    return all.filter((comm) => comm.channel === channel)
  }
}

export const communicationService = new CommunicationService()

