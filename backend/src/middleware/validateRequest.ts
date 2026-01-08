import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AppError } from './errorHandler'

export function validateRequest(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body)
      req.body = validated
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map((e) => e.message).join(', ')
        next(new AppError(message, 400))
      } else {
        next(error)
      }
    }
  }
}

