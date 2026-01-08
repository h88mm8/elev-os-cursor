import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/authService'
import { AppError } from './errorHandler'

export interface AuthRequest extends Request {
  user?: {
    userId: string
    email: string
    role: string
  }
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token não fornecido', 401)
    }

    const token = authHeader.substring(7)

    const payload = authService.verifyToken(token)

    req.user = payload

    next()
  } catch (error: any) {
    if (error instanceof AppError) {
      next(error)
    } else {
      next(new AppError('Token inválido', 401))
    }
  }
}

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Não autenticado', 401))
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Acesso negado', 403))
    }

    next()
  }
}

