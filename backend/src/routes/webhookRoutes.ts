import { Router, Request, Response } from 'express'
import { webhookService } from '../services/webhookService'
import { PrismaClient } from '@prisma/client'
import { AppError } from '../middleware/errorHandler'
import { authenticate } from '../middleware/auth'
import { validateRequest } from '../middleware/validateRequest'
import { webhookSchema } from '../utils/validation'

const router = Router()

// Proteger todas as rotas
router.use(authenticate)

const prisma = new PrismaClient()

// Registrar webhook
router.post('/register', validateRequest(webhookSchema), async (req: Request, res: Response, next) => {
  try {
    const { url, events, secret } = req.body

    const webhook = await webhookService.registerWebhook(url, events, secret)

    res.json({
      success: true,
      data: webhook,
    })
  } catch (error: any) {
    next(error)
  }
})

// Listar webhooks
router.get('/', async (req: Request, res: Response, next) => {
  try {
    const webhooks = await prisma.webhook.findMany({
      orderBy: { createdAt: 'desc' },
    })

    res.json({
      success: true,
      data: webhooks,
    })
  } catch (error: any) {
    next(error)
  }
})

// Desativar/ativar webhook
router.patch('/:id/toggle', async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params

    const webhook = await prisma.webhook.findUnique({
      where: { id },
    })

    if (!webhook) {
      throw new AppError('Webhook não encontrado', 404)
    }

    const updated = await prisma.webhook.update({
      where: { id },
      data: {
        active: !webhook.active,
      },
    })

    res.json({
      success: true,
      data: updated,
    })
  } catch (error: any) {
    next(error)
  }
})

// Deletar webhook
router.delete('/:id', async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params

    await prisma.webhook.delete({
      where: { id },
    })

    res.json({
      success: true,
      message: 'Webhook deletado com sucesso',
    })
  } catch (error: any) {
    next(error)
  }
})

// Ver deliveries de um webhook
router.get('/:id/deliveries', async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params
    const limit = parseInt(req.query.limit as string) || 50

    const deliveries = await webhookService.getWebhookDeliveries(id, limit)

    res.json({
      success: true,
      data: deliveries,
    })
  } catch (error: any) {
    next(error)
  }
})

export default router

