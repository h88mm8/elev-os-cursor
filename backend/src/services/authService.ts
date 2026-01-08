import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { config } from '../config'
import { AuthServiceFallback } from './authServiceFallback'

// Tentar usar Prisma, se falhar usar fallback
let prisma: PrismaClient | null = null
let useDatabase = false

try {
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('user:password')) {
    prisma = new PrismaClient()
    useDatabase = true
    // Testar conexão
    prisma.$connect().catch(() => {
      console.warn('⚠️  Não foi possível conectar ao banco de dados. Usando armazenamento local.')
      useDatabase = false
      prisma = null
    })
  }
} catch (error) {
  console.warn('⚠️  Prisma não disponível. Usando armazenamento local.')
  useDatabase = false
}

const fallbackService = new AuthServiceFallback()

interface TokenPayload {
  userId: string
  email: string
  role: string
}

export class AuthService {
  async register(email: string, password: string, name: string) {
    // Se não tiver banco de dados, usar fallback
    if (!useDatabase || !prisma) {
      return await fallbackService.register(email, password, name)
    }

    try {
      // Verificar se usuário já existe
      const existing = await prisma.user.findUnique({
        where: { email },
      })

      if (existing) {
        throw new Error('Email já cadastrado')
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10)

      // Criar usuário
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      })

      // Gerar token
      const token = this.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      return {
        user,
        token,
      }
    } catch (error: any) {
      // Se falhar com banco, tentar fallback
      if (error.code === 'P1001' || error.code === 'P2002') {
        console.warn('⚠️  Erro ao conectar com banco. Usando armazenamento local.')
        return await fallbackService.register(email, password, name)
      }
      throw error
    }
  }

  async login(email: string, password: string) {
    // Se não tiver banco de dados, usar fallback
    if (!useDatabase || !prisma) {
      return await fallbackService.login(email, password)
    }

    try {
      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user || !user.active) {
        throw new Error('Credenciais inválidas')
      }

      // Verificar senha
      const isValid = await bcrypt.compare(password, user.password)

      if (!isValid) {
        throw new Error('Credenciais inválidas')
      }

      // Atualizar último login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      })

      // Gerar token
      const token = this.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      }
    } catch (error: any) {
      // Se falhar com banco, tentar fallback
      if (error.code === 'P1001' || error.code === 'P2002') {
        console.warn('⚠️  Erro ao conectar com banco. Usando armazenamento local.')
        return await fallbackService.login(email, password)
      }
      throw error
    }
  }

  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: '7d',
    })
  }

  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, config.jwtSecret) as TokenPayload
    } catch (error) {
      throw new Error('Token inválido')
    }
  }

  async getUserById(userId: string) {
    // Se não tiver banco de dados, usar fallback
    if (!useDatabase || !prisma) {
      return await fallbackService.getUserById(userId)
    }

    try {
      return await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          active: true,
          createdAt: true,
          lastLogin: true,
        },
      })
    } catch (error: any) {
      // Se falhar com banco, tentar fallback
      if (error.code === 'P1001') {
        return await fallbackService.getUserById(userId)
      }
      throw error
    }
  }
}

export const authService = new AuthService()

