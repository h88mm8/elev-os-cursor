import { Router, Request, Response } from 'express'
import { openAIService } from '../services/openAIService'
import { db } from '../services/databaseService'
import { AppError } from '../middleware/errorHandler'
import { authenticate } from '../middleware/auth'
import { DataStorage } from '../utils/dataStorage'

const router = Router()

// Proteger todas as rotas
router.use(authenticate)

const useDatabase = process.env.DATABASE_URL ? true : false
const leadsStorage = useDatabase ? null : new DataStorage('leads')

router.post('/analyze/:leadId', async (req: Request, res: Response, next) => {
  try {
    const { leadId } = req.params
    
    if (!leadId) {
      throw new AppError('leadId é obrigatório', 400)
    }

    // Buscar lead do banco de dados ou storage
    let lead
    if (useDatabase) {
      lead = await db.getLeadById(leadId)
    } else {
      lead = await leadsStorage!.get(leadId)
    }
    
    if (!lead) {
      throw new AppError('Lead não encontrado', 404)
    }

    const analysis = await openAIService.analyzeLead(leadId, lead)
    
    res.json({
      success: true,
      data: analysis,
    })
  } catch (error: any) {
    next(error)
  }
})

router.post('/daily-activities', async (req: Request, res: Response, next) => {
  try {
    const { leadIds } = req.body
    
    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      throw new AppError('leadIds deve ser um array não vazio', 400)
    }

    // Buscar todos os leads
    const leads = []
    for (const leadId of leadIds) {
      let lead
      if (useDatabase) {
        lead = await db.getLeadById(leadId)
      } else {
        lead = await leadsStorage!.get(leadId)
      }
      if (lead) {
        leads.push(lead)
      }
    }

    const activities = await openAIService.generateDailyActivities(leadIds, leads)
    
    res.json({
      success: true,
      data: activities,
    })
  } catch (error: any) {
    next(error)
  }
})

router.post('/generate-message', async (req: Request, res: Response, next) => {
  try {
    const { leadId, channel, context } = req.body
    
    if (!leadId || !channel) {
      throw new AppError('leadId e channel são obrigatórios', 400)
    }

    const message = await openAIService.generateMessage(leadId, channel, context)
    
    res.json({
      success: true,
      data: { message },
    })
  } catch (error: any) {
    next(error)
  }
})

export default router

