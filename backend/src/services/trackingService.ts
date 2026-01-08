import { TrackingData, TrackingEvent } from '../types'
import { DataStorage } from '../utils/dataStorage'

class TrackingService {
  private storage: DataStorage

  constructor() {
    this.storage = new DataStorage('tracking')
  }

  async recordEvent(
    companyDomain: string,
    event: Omit<TrackingEvent, 'id' | 'timestamp'>
  ): Promise<TrackingEvent> {
    const trackingEvent: TrackingEvent = {
      id: `event-${Date.now()}-${Math.random()}`,
      ...event,
      timestamp: new Date(),
    }

    // Buscar dados existentes ou criar novo
    const existing = await this.getTrackingData(companyDomain)
    
    existing.events.push(trackingEvent)
    
    await this.storage.save(companyDomain, existing)

    return trackingEvent
  }

  async getTrackingData(companyDomain: string): Promise<TrackingData> {
    const data = await this.storage.get(companyDomain)
    
    if (data) {
      return {
        ...data,
        events: data.events.map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp),
        })),
      }
    }

    // Retornar estrutura vazia se não existir
    return {
      leadId: '',
      companyDomain,
      events: [],
    }
  }

  async getEventsByType(
    companyDomain: string,
    type: TrackingEvent['type']
  ): Promise<TrackingEvent[]> {
    const data = await this.getTrackingData(companyDomain)
    return data.events.filter((e) => e.type === type)
  }

  async getPageViews(companyDomain: string): Promise<number> {
    const events = await this.getEventsByType(companyDomain, 'page_view')
    return events.length
  }

  async getCTAClicks(companyDomain: string): Promise<number> {
    const events = await this.getEventsByType(companyDomain, 'cta_click')
    return events.length
  }
}

export const trackingService = new TrackingService()

