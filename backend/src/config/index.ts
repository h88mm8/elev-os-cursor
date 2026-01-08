import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // API Keys
  apollo: {
    apiKey: process.env.APOLLO_API_KEY || '',
    baseUrl: 'https://api.apollo.io/v1',
  },
  
  unipile: {
    apiKey: process.env.UNIPILE_API_KEY || '',
    baseUrl: 'https://api.unipile.com/v1',
    // Nota: URL pode variar conforme documentação oficial da Unipile
    // Verificar: https://docs.unipile.com/
  },
  
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  
  googleTagManager: {
    id: process.env.GOOGLE_TAG_MANAGER_ID || '',
  },
  
  // Security
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  apiSecret: process.env.API_SECRET || 'your-api-secret',
  
  // CORS
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'http://localhost:5174',
  ],
}

