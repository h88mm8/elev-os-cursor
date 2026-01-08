import axios from 'axios'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

interface WebhookEvent {
  event: string
  data: any
  timestamp: Date
}

class WebhookService {
  async registerWebhook(url: string, events: string[], secret?: string) {
    return await prisma.webhook.create({
      data: {
        url,
        events,
        secret: secret || this.generateSecret(),
        active: true,
      },
    })
  }

  async triggerWebhook(event: string, data: any) {
    // Buscar webhooks ativos que escutam este evento
    const webhooks = await prisma.webhook.findMany({
      where: {
        active: true,
        events: {
          has: event,
        },
      },
    })

    const payload = {
      event,
      data,
      timestamp: new Date().toISOString(),
    }

    // Enviar para cada webhook
    const deliveries = await Promise.allSettled(
      webhooks.map((webhook) => this.deliverWebhook(webhook, payload))
    )

    return deliveries
  }

  private async deliverWebhook(webhook: any, payload: any) {
    const delivery = await prisma.webhookDelivery.create({
      data: {
        webhookId: webhook.id,
        event: payload.event,
        payload,
        status: 'pending',
        attempts: 0,
      },
    })

    try {
      const headers: any = {
        'Content-Type': 'application/json',
        'X-Webhook-Event': payload.event,
      }

      // Adicionar assinatura HMAC se houver secret
      if (webhook.secret) {
        const signature = this.createSignature(JSON.stringify(payload), webhook.secret)
        headers['X-Webhook-Signature'] = signature
      }

      const response = await axios.post(webhook.url, payload, {
        headers,
        timeout: 10000, // 10 segundos
      })

      // Atualizar delivery como sucesso
      await prisma.webhookDelivery.update({
        where: { id: delivery.id },
        data: {
          status: 'success',
          statusCode: response.status,
          response: JSON.stringify(response.data),
          deliveredAt: new Date(),
          attempts: delivery.attempts + 1,
        },
      })

      return { success: true, deliveryId: delivery.id }
    } catch (error: any) {
      // Atualizar delivery como falha
      await prisma.webhookDelivery.update({
        where: { id: delivery.id },
        data: {
          status: 'failed',
          statusCode: error.response?.status || 0,
          response: error.message,
          attempts: delivery.attempts + 1,
        },
      })

      throw error
    }
  }

  private createSignature(payload: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex')
  }

  private generateSecret(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  async retryFailedDeliveries() {
    // Buscar deliveries falhados com menos de 5 tentativas
    const failedDeliveries = await prisma.webhookDelivery.findMany({
      where: {
        status: 'failed',
        attempts: {
          lt: 5,
        },
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24h
        },
      },
      include: {
        webhook: true,
      },
      take: 50, // Limitar a 50 por vez
    })

    for (const delivery of failedDeliveries) {
      if (!delivery.webhook.active) continue

      try {
        await this.deliverWebhook(delivery.webhook, delivery.payload)
      } catch (error) {
        console.error(`Erro ao retentar delivery ${delivery.id}:`, error)
      }
    }
  }

  async getWebhookDeliveries(webhookId: string, limit: number = 50) {
    return await prisma.webhookDelivery.findMany({
      where: { webhookId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }
}

export const webhookService = new WebhookService()

