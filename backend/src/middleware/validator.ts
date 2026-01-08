import { Request, Response, NextFunction } from 'express'
import { AppError } from './errorHandler'

export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body)
    
    if (error) {
      throw new AppError(error.details[0].message, 400)
    }
    
    next()
  }
}

