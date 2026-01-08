import { Router, Request, Response } from 'express'
import { linkedinScrapingService } from '../services/linkedinScrapingService'
import { db } from '../services/databaseService'
import { AppError } from '../middleware/errorHandler'
import { authenticate } from '../middleware/auth'
import { DataStorage } from '../utils/dataStorage'

const router = Router()

// Proteger todas as rotas
router.use(authenticate)

const useDatabase = process.env.DATABASE_URL ? true : false
const leadsStorage = useDatabase ? null : new DataStorage('leads')

router.post('/scrape-posts/:leadId', async (req: Request, res: Response, next) => {
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

    if (!lead.linkedinUrl) {
      throw new AppError('Lead não possui URL do LinkedIn', 400)
    }

    // Fazer scraping dos posts
    const posts = await linkedinScrapingService.scrapePosts(
      leadId,
      lead.linkedinUrl
    )
    
    res.json({
      success: true,
      data: posts,
    })
  } catch (error: any) {
    next(error)
  }
})

export default router

