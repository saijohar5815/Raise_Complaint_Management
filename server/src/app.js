import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import './config/env.js'

import complaintRoutes from './routes/complaintRoutes.js'
import { globalLimiter } from './middlewares/rateLimiter.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { HTTP_STATUS } from './constants/index.js'
import { isSmsConfigured } from './services/smsService.js'
import { isWhatsAppConfigured } from './services/whatsappService.js'

const app = express()

// Trust Render proxy
app.set('trust proxy', 1)

const corsOrigin =
  process.env.CORS_ORIGIN ||
  (process.env.NODE_ENV === 'production' ? false : '*')

// Security & Middleware
app.use(helmet())

app.use(
  cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')
)

// ======================
// Health Check (NO Rate Limit)
// ======================
app.get('/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'ResolveX Backend is healthy and operational',
    data: {
      uptime: process.uptime(),
      timestamp: new Date(),
      notifications: {
        sms: isSmsConfigured(),
        whatsapp: isWhatsAppConfigured(),
      },
    },
    errors: null,
  })
})

// Optional Root Route
app.get('/', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'ResolveX Backend Running',
  })
})

// ======================
// Apply Rate Limiter ONLY to API Routes
// ======================
app.use('/api', globalLimiter)

// API Routes
app.use('/api/v1/complaints', complaintRoutes)

// 404 Handler
app.use((req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
    data: null,
    errors: null,
  })
})

// Global Error Handler
app.use(errorHandler)

export default app
