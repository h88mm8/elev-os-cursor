import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { config } from '../config'
import { DataStorage } from '../utils/dataStorage'

const usersStorage = new DataStorage('users')

interface User {
  id: string
  email: string
  password: string
  name: string
  role: string
  active: boolean
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
}

interface TokenPayload {
  userId: string
  email: string
  role: string
}

export class AuthServiceFallback {
  async register(email: string, password: string, name: string) {
    // Buscar todos os usuários usando list() e get()
    const userIds = await usersStorage.list()
    const allUsers = await Promise.all(
      userIds.map(id => usersStorage.get(id))
    )
    
    // Verificar se usuário já existe
    const existing = allUsers.find((u: User | null) => u && u.email === email)

    if (existing) {
      throw new Error('Email já cadastrado')
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar usuário
    const user: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email,
      password: hashedPassword,
      name,
      role: 'user',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Salvar usuário
    await usersStorage.save(user.id, user)

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
        createdAt: user.createdAt,
      },
      token,
    }
  }

  async login(email: string, password: string) {
    // Buscar todos os usuários usando list() e get()
    const userIds = await usersStorage.list()
    const allUsers = await Promise.all(
      userIds.map(id => usersStorage.get(id))
    )
    
    // Buscar usuário
    const user = allUsers.find((u: User | null) => u && u.email === email) as User | undefined

    if (!user || !user.active) {
      throw new Error('Credenciais inválidas')
    }

    // Verificar senha
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      throw new Error('Credenciais inválidas')
    }

    // Atualizar último login
    user.lastLogin = new Date()
    user.updatedAt = new Date()
    await usersStorage.save(user.id, user)

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
    const user = await usersStorage.get(userId) as User | null
    
    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      active: user.active,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    }
  }
}

