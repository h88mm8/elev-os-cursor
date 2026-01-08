import { Router, Request, Response } from 'express'
import { apolloService } from '../services/apolloService'
import { AppError } from '../middleware/errorHandler'
import { authenticate } from '../middleware/auth'
import { validateRequest } from '../middleware/validateRequest'
import { searchFiltersSchema } from '../utils/validation'
import { SearchFilters } from '../types'

const router = Router()

// Proteger todas as rotas
router.use(authenticate)

router.post('/search', validateRequest(searchFiltersSchema), async (req: Request, res: Response, next) => {
  try {
    const filters: SearchFilters = req.body

    const leads = await apolloService.searchLeads(filters)
    
    res.json({
      success: true,
      data: leads,
    })
  } catch (error: any) {
    next(error)
  }
})

router.post('/enrich/:leadId', async (req: Request, res: Response, next) => {
  try {
    const { leadId } = req.params
    
    if (!leadId) {
      throw new AppError('ID do lead é obrigatório', 400)
    }

    const enrichedLead = await apolloService.enrichLead(leadId)
    
    res.json({
      success: true,
      data: enrichedLead,
    })
  } catch (error: any) {
    next(error)
  }
})

export default router

