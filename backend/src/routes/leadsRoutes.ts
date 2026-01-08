import { Router, Request, Response } from 'express'
import { db } from '../services/databaseService'
import { eventEmitter } from '../services/eventEmitter'
import { Lead } from '../models/Lead'
import { AppError } from '../middleware/errorHandler'
import { authenticate } from '../middleware/auth'
import { validateRequest } from '../middleware/validateRequest'
import { leadSchema } from '../utils/validation'

const router = Router()

// Todas as rotas requerem autenticação
router.use(authenticate)

// Usar banco de dados ou fallback para JSON
const useDatabase = process.env.DATABASE_URL ? true : false
let leadsStorage: any

if (!useDatabase) {
  // Fallback para JSON se não houver DATABASE_URL
  const { DataStorage } = require('../utils/dataStorage')
  leadsStorage = new DataStorage('leads')
}

// Salvar lead
router.post('/', validateRequest(leadSchema), async (req: Request, res: Response, next) => {
  try {
    const leadData: any = req.body
    
    if (!leadData.firstName || !leadData.lastName || !leadData.company) {
      throw new AppError('firstName, lastName e company são obrigatórios', 400)
    }

    let lead: Lead

    if (useDatabase) {
      lead = await db.createLead(leadData)
      // Emitir evento
      eventEmitter.emit('lead.created', lead)
    } else {
      // Fallback para JSON
      if (!leadData.id) {
        leadData.id = `lead-${Date.now()}-${Math.random()}`
      }
      leadData.updatedAt = new Date()
      if (!leadData.createdAt) {
        leadData.createdAt = new Date()
      }
      await leadsStorage.save(leadData.id, leadData)
      lead = leadData
    }
    
    res.json({
      success: true,
      data: lead,
    })
  } catch (error: any) {
    next(error)
  }
})

// Buscar lead por ID
router.get('/:leadId', async (req: Request, res: Response, next) => {
  try {
    const { leadId } = req.params
    
    let lead: Lead | null

    if (useDatabase) {
      lead = await db.getLeadById(leadId)
    } else {
      lead = await leadsStorage.get(leadId)
    }
    
    if (!lead) {
      throw new AppError('Lead não encontrado', 404)
    }

    res.json({
      success: true,
      data: lead,
    })
  } catch (error: any) {
    next(error)
  }
})

// Listar todos os leads
router.get('/', async (req: Request, res: Response, next) => {
  try {
    let leads: Lead[]

    if (useDatabase) {
      leads = await db.getAllLeads()
    } else {
      const leadIds = await leadsStorage.list()
      leads = []

      for (const id of leadIds) {
        const lead = await leadsStorage.get(id)
        if (lead) {
          leads.push(lead)
        }
      }
    }

    res.json({
      success: true,
      data: leads,
    })
  } catch (error: any) {
    next(error)
  }
})

// Atualizar lead
router.put('/:leadId', async (req: Request, res: Response, next) => {
  try {
    const { leadId } = req.params
    const updates: Partial<Lead> = req.body

    let updatedLead: Lead

    if (useDatabase) {
      updatedLead = await db.updateLead(leadId, updates)
      // Emitir evento
      eventEmitter.emit('lead.updated', updatedLead)
    } else {
      const lead = await leadsStorage.get(leadId)
      
      if (!lead) {
        throw new AppError('Lead não encontrado', 404)
      }

      updatedLead = {
        ...lead,
        ...updates,
        id: leadId,
        updatedAt: new Date(),
      }

      await leadsStorage.save(leadId, updatedLead)
    }
    
    res.json({
      success: true,
      data: updatedLead,
    })
  } catch (error: any) {
    next(error)
  }
})

// Deletar lead
router.delete('/:leadId', async (req: Request, res: Response, next) => {
  try {
    const { leadId } = req.params
    
    if (useDatabase) {
      await db.deleteLead(leadId)
    } else {
      await leadsStorage.delete(leadId)
    }
    
    res.json({
      success: true,
      message: 'Lead deletado com sucesso',
    })
  } catch (error: any) {
    next(error)
  }
})

export default router

