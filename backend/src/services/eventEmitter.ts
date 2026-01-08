import { EventEmitter } from 'events'
import { webhookService } from './webhookService'

class AppEventEmitter extends EventEmitter {
  constructor() {
    super()
    this.setupListeners()
  }

  private setupListeners() {
    // Escutar eventos e disparar webhooks
    this.on('lead.created', async (data) => {
      await webhookService.triggerWebhook('lead.created', data)
    })

    this.on('lead.updated', async (data) => {
      await webhookService.triggerWebhook('lead.updated', data)
    })

    this.on('communication.sent', async (data) => {
      await webhookService.triggerWebhook('communication.sent', data)
    })

    this.on('communication.opened', async (data) => {
      await webhookService.triggerWebhook('communication.opened', data)
    })

    this.on('communication.clicked', async (data) => {
      await webhookService.triggerWebhook('communication.clicked', data)
    })

    this.on('communication.replied', async (data) => {
      await webhookService.triggerWebhook('communication.replied', data)
    })

    this.on('activity.approved', async (data) => {
      await webhookService.triggerWebhook('activity.approved', data)
    })

    this.on('tracking.event', async (data) => {
      await webhookService.triggerWebhook('tracking.event', data)
    })
  }
}

export const eventEmitter = new AppEventEmitter()

