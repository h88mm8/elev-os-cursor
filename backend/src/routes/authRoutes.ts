import { Router, Request, Response } from 'express'
import { authService } from '../services/authService'
import { AppError } from '../middleware/errorHandler'
import { authenticate } from '../middleware/auth'
import { z } from 'zod'

const router = Router()

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
})

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

// Rotas públicas (sem autenticação)
router.post('/register', async (req: Request, res: Response, next) => {
  try {
    const validated = registerSchema.parse(req.body)

    const result = await authService.register(
      validated.email,
      validated.password,
      validated.name
    )

    res.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400))
    } else {
      next(error)
    }
  }
})

router.post('/login', async (req: Request, res: Response, next) => {
  try {
    const validated = loginSchema.parse(req.body)

    const result = await authService.login(
      validated.email,
      validated.password
    )

    res.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400))
    } else if (error.message === 'Credenciais inválidas') {
      next(new AppError('Credenciais inválidas', 401))
    } else {
      next(error)
    }
  }
})

// Rotas protegidas (requerem autenticação)
router.post('/verify', authenticate, async (req: Request, res: Response, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token não fornecido', 401)
    }

    const token = authHeader.substring(7)
    const payload = authService.verifyToken(token)

    const user = await authService.getUserById(payload.userId)

    if (!user || !user.active) {
      throw new AppError('Usuário não encontrado ou inativo', 401)
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    })
  } catch (error: any) {
    next(error)
  }
})

export default router
