import { Router, Request, Response } from 'express'
import { unipileService } from '../services/unipileService'
import { db } from '../services/databaseService'
import { eventEmitter } from '../services/eventEmitter'
import { AppError } from '../middleware/errorHandler'
import { authenticate } from '../middleware/auth'
import { validateRequest } from '../middleware/validateRequest'
import { communicationSchema } from '../utils/validation'
import { Communication, CommunicationChannel } from '../models/Lead'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

// Proteger todas as rotas
router.use(authenticate)

const useDatabase = process.env.DATABASE_URL ? true : false
let communicationService: any

if (!useDatabase) {
  const { communicationService: commService } = require('../services/communicationService')
  communicationService = commService
}

router.post('/email', async (req: Request, res: Response, next) => {
  try {
    const { leadId, subject, message } = req.body
    
    if (!leadId || !subject || !message) {
      throw new AppError('leadId, subject e message são obrigatórios', 400)
    }

    const result = await unipileService.sendEmail(leadId, subject, message)
    
    // Salvar comunicação
    const commData = {
      leadId,
      channel: CommunicationChannel.EMAIL,
      type: 'sent',
      content: message,
      subject,
      sentAt: new Date(),
      delivered: true,
    }

    let communication: Communication
    if (useDatabase) {
      communication = await db.createCommunication(commData)
    } else {
      communication = {
        id: uuidv4(),
        ...commData,
      }
      await communicationService.saveCommunication(communication)
    }

    // Emitir evento
    eventEmitter.emit('communication.sent', communication)
    
    res.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    next(error)
  }
})

router.post('/whatsapp', async (req: Request, res: Response, next) => {
  try {
    const { leadId, message } = req.body
    
    if (!leadId || !message) {
      throw new AppError('leadId e message são obrigatórios', 400)
    }

    const result = await unipileService.sendWhatsApp(leadId, message)
    
    // Salvar comunicação
    const commData = {
      leadId,
      channel: CommunicationChannel.WHATSAPP,
      type: 'sent',
      content: message,
      sentAt: new Date(),
      delivered: true,
    }

    let communication: Communication
    if (useDatabase) {
      communication = await db.createCommunication(commData)
    } else {
      communication = {
        id: uuidv4(),
        ...commData,
      }
      await communicationService.saveCommunication(communication)
    }

    // Emitir evento
    eventEmitter.emit('communication.sent', communication)
    
    res.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    next(error)
  }
})

router.post('/linkedin/connect', async (req: Request, res: Response, next) => {
  try {
    const { leadId, message } = req.body
    
    if (!leadId) {
      throw new AppError('leadId é obrigatório', 400)
    }

    const result = await unipileService.linkedinConnect(leadId, message)
    
    res.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    next(error)
  }
})

router.post('/linkedin/like', async (req: Request, res: Response, next) => {
  try {
    const { leadId, postId } = req.body
    
    if (!leadId || !postId) {
      throw new AppError('leadId e postId são obrigatórios', 400)
    }

    const result = await unipileService.linkedinLikePost(leadId, postId)
    
    res.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    next(error)
  }
})

router.post('/linkedin/comment', async (req: Request, res: Response, next) => {
  try {
    const { leadId, postId, comment } = req.body
    
    if (!leadId || !postId || !comment) {
      throw new AppError('leadId, postId e comment são obrigatórios', 400)
    }

    const result = await unipileService.linkedinCommentPost(leadId, postId, comment)
    
    res.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    next(error)
  }
})

router.get('/calendar/:leadId', async (req: Request, res: Response, next) => {
  try {
    const { leadId } = req.params
    
    if (!leadId) {
      throw new AppError('leadId é obrigatório', 400)
    }

    const result = await unipileService.getCalendarLink(leadId)
    
    res.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    next(error)
  }
})

export default router

