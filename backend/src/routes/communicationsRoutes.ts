import { Router, Request, Response } from 'express'
import { db } from '../services/databaseService'
import { AppError } from '../middleware/errorHandler'
import { authenticate } from '../middleware/auth'

const router = Router()

// Proteger todas as rotas
router.use(authenticate)

const useDatabase = process.env.DATABASE_URL ? true : false
let communicationService: any

if (!useDatabase) {
  // Fallback para JSON
  const { communicationService: commService } = require('../services/communicationService')
  communicationService = commService
}

router.get('/lead/:leadId', async (req: Request, res: Response, next) => {
  try {
    const { leadId } = req.params
    
    if (!leadId) {
      throw new AppError('leadId é obrigatório', 400)
    }

    let communications

    if (useDatabase) {
      communications = await db.getCommunicationsByLead(leadId)
    } else {
      communications = await communicationService.getCommunicationsByLead(leadId)
    }
    
    res.json({
      success: true,
      data: communications,
    })
  } catch (error: any) {
    next(error)
  }
})

export default router

