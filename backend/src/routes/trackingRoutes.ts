import { Router, Request, Response } from 'express'
import { trackingService } from '../services/trackingService'
import { AppError } from '../middleware/errorHandler'
import { authenticate } from '../middleware/auth'

const router = Router()

// Proteger todas as rotas
router.use(authenticate)

router.get('/:companyDomain', async (req: Request, res: Response, next) => {
  try {
    const { companyDomain } = req.params
    
    if (!companyDomain) {
      throw new AppError('companyDomain é obrigatório', 400)
    }

    const data = await trackingService.getTrackingData(companyDomain)
    
    res.json({
      success: true,
      data,
    })
  } catch (error: any) {
    next(error)
  }
})

router.post('/event', async (req: Request, res: Response, next) => {
  try {
    const { companyDomain, type, url, metadata } = req.body
    
    if (!companyDomain || !type || !url) {
      throw new AppError('companyDomain, type e url são obrigatórios', 400)
    }

    const event = await trackingService.recordEvent(companyDomain, {
      type,
      url,
      metadata,
    })
    
    res.json({
      success: true,
      data: event,
    })
  } catch (error: any) {
    next(error)
  }
})

router.get('/:companyDomain/stats', async (req: Request, res: Response, next) => {
  try {
    const { companyDomain } = req.params
    
    const pageViews = await trackingService.getPageViews(companyDomain)
    const ctaClicks = await trackingService.getCTAClicks(companyDomain)
    
    res.json({
      success: true,
      data: {
        pageViews,
        ctaClicks,
      },
    })
  } catch (error: any) {
    next(error)
  }
})

export default router

