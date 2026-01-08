// Definir DATABASE_URL fictício ANTES de qualquer import que use Prisma
// Isso garante que o Prisma Client não falhe na validação do schema
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('user:password@localhost')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/db?schema=public'
}

import express, { Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import { config } from './config'
import { errorHandler } from './middleware/errorHandler'
import { swaggerSpec } from './config/swagger'

// Routes
import apolloRoutes from './routes/apolloRoutes'
import unipileRoutes from './routes/unipileRoutes'
import openAIRoutes from './routes/openAIRoutes'
import trackingRoutes from './routes/trackingRoutes'
import linkedinRoutes from './routes/linkedinRoutes'
import leadsRoutes from './routes/leadsRoutes'
import communicationsRoutes from './routes/communicationsRoutes'
import webhookRoutes from './routes/webhookRoutes'
import authRoutes from './routes/authRoutes'

const app: Express = express()

// Security middleware
app.use(helmet())
app.use(cors({
  origin: config.allowedOrigins,
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requisições por IP
  message: 'Muitas requisições deste IP, tente novamente mais tarde.',
})

app.use('/api/', limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  })
})

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Public routes (sem autenticação)
app.use('/api/auth', authRoutes)

// API Routes (protegidas)
app.use('/api/apollo', apolloRoutes)
app.use('/api/unipile', unipileRoutes)
app.use('/api/openai', openAIRoutes)
app.use('/api/tracking', trackingRoutes)
app.use('/api/linkedin', linkedinRoutes)
app.use('/api/leads', leadsRoutes)
app.use('/api/communications', communicationsRoutes)
app.use('/api/webhooks', webhookRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Rota não encontrada',
      statusCode: 404,
    },
  })
})

// Error handler (deve ser o último middleware)
app.use(errorHandler)

// Start server
const PORT = config.port || process.env.PORT || 3001

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Erro não capturado:', error)
  // Não encerrar o processo imediatamente
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejeitada não tratada:', reason)
  // Não encerrar o processo imediatamente
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📡 Ambiente: ${config.nodeEnv}`)
  console.log(`🌐 Health check: http://localhost:${PORT}/health`)
  console.log(`📚 API Base: http://localhost:${PORT}/api`)
  
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL não configurado. Alguns recursos podem não funcionar.')
  }
}).on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${PORT} já está em uso.`)
  } else {
    console.error('❌ Erro ao iniciar servidor:', error)
  }
  process.exit(1)
})

export default app

