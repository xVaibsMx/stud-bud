// server.js
'use strict'

/**
 * Stud-Bud backend (clean, robust) — AI part left exactly as original per your request.
 * - Improved: env checks, middleware, CORS, rate limit, logging, centralized responses, graceful shutdown
 * - AI helper & AI routes kept unchanged (copy/paste from your original)
 */

require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const compression = require('compression')
const morgan = require('morgan')
const { body, validationResult } = require('express-validator')

const app = express()
const PORT = process.env.PORT || 5000

/* ------------------ env checks ------------------ */
const requiredEnvs = ['MONGO_URL', 'SECRET', 'API_KEY']
for (const v of requiredEnvs) {
  if (!process.env[v]) {
    console.error(`Missing required env: ${v}. Exiting.`)
    process.exit(1)
  }
}

/* ------------------ middleware ------------------ */
app.use(helmet())
app.use(compression())
app.use(express.json({ limit: '20kb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

/* ------------------ CORS ------------------ */
/* Set allowed origins via env: CORS_ORIGINS="https://your-app.com,http://localhost:5173" */
const corsWhitelist = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true) // allow non-browser requests
    if (corsWhitelist.length === 0) return callback(null, true) // dev: allow all
    if (corsWhitelist.includes(origin)) return callback(null, true)
    callback(new Error('Not allowed by CORS'))
  },
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

/* ------------------ rate limiter ------------------ */
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests - try again later.' },
})
app.use(limiter)

/* ------------------ mongo connection ------------------ */
mongoose.set('strictQuery', true)
const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('MongoDB connected ✅')
  } catch (err) {
    console.error('MongoDB connection error ❌', err)
    setTimeout(connectWithRetry, 5000)
  }
}
connectWithRetry()

/* ------------------ models ------------------ */
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
)
const Users = mongoose.model('Users', userSchema)

/* ------------------ helpers ------------------ */
const respond = (
  res,
  status = 200,
  success = true,
  data = null,
  message = ''
) => res.status(status).json({ success, data, message })

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization || ''
  const parts = authHeader.split(' ')
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) return parts[1]
  return null
}

/* ------------------ auth middleware ------------------ */
const isUserLogged = asyncHandler(async (req, res, next) => {
  const token = getTokenFromHeader(req)
  if (!token)
    return respond(res, 401, false, null, 'Authorization token missing')

  try {
    const payload = jwt.verify(token, process.env.SECRET)
    req.user = { username: payload.username, id: payload.id }
    return next()
  } catch (err) {
    return respond(res, 401, false, null, 'Invalid or expired token')
  }
})

/* ------------------ auth routes ------------------ */

/**
 * POST /register
 * body: { username, password }
 */
app.post(
  '/register',
  [
    body('username').isString().trim().isLength({ min: 3, max: 40 }),
    body('password').isString().isLength({ min: 6, max: 128 }),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return respond(res, 400, false, null, 'Invalid input')

    const { username, password } = req.body
    const existing = await Users.findOne({ username }).lean()
    if (existing)
      return respond(res, 409, false, null, 'Username already taken')

    const saltRounds = Number(process.env.SALT_ROUNDS || 10)
    const hashed = await bcrypt.hash(password, saltRounds)
    const user = new Users({ username, password: hashed })
    await user.save()

    const tokenPayload = { username: user.username, id: user._id.toString() }
    const token = jwt.sign(tokenPayload, process.env.SECRET, {
      expiresIn: '7d',
    })

    return respond(
      res,
      201,
      true,
      { token, user: { username: user.username, id: user._id } },
      'User registered'
    )
  })
)

/**
 * POST /login
 * body: { username, password }
 */
app.post(
  '/login',
  [
    body('username').isString().trim().isLength({ min: 3, max: 40 }),
    body('password').isString().isLength({ min: 6, max: 128 }),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return respond(res, 400, false, null, 'Invalid input')

    const { username, password } = req.body
    const user = await Users.findOne({ username })
    if (!user) return respond(res, 401, false, null, 'Invalid credentials')

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return respond(res, 401, false, null, 'Invalid credentials')

    const tokenPayload = { username: user.username, id: user._id.toString() }
    const token = jwt.sign(tokenPayload, process.env.SECRET, {
      expiresIn: '7d',
    })

    return respond(
      res,
      200,
      true,
      { token, user: { username: user.username, id: user._id } },
      'Logged in'
    )
  })
)

/* ------------------ === AI part: PRESERVED EXACTLY AS PROVIDED BY YOU === ------------------ */
/* The following `getAIResponse` function and aiRoutes block are kept unchanged per your request. */

const { GoogleGenAI } = require('@google/genai')

// Gemini AI helper (UNCHANGED)
const getAIResponse = async (promptText) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY })
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
    })
    return response.text
  } catch (err) {
    console.error('Error in getAIResponse:', err)
    throw err
  }
}

// AI routes (UNCHANGED)
const aiRoutes = [
  { path: '/elia5', prefix: 'Explain like I am 5: ' },
  { path: '/revision', prefix: 'Give a quick revision: ' },
  {
    path: '/quiz',
    prefix: 'Make a short quiz of 3 questions with answers for: ',
  },
  // Fun fact removed
]

aiRoutes.forEach(({ path, prefix }) => {
  app.post(path, isUserLogged, async (req, res) => {
    const { content } = req.body
    if (!content)
      return res.status(400).send({ message: 'Content is required for AI.' })

    const prompt = prefix + content
    try {
      const text = await getAIResponse(prompt)
      res.send({ message: text })
    } catch (err) {
      res.status(500).send({ message: 'Error from AI service.' })
    }
  })
})

/* ------------------ utility routes ------------------ */
app.get('/', (req, res) => res.send('Stud-Bud backend is running ✅'))
app.get('/test', (req, res) => res.send({ message: 'API is alive 🚀' }))

app.get(
  '/me',
  isUserLogged,
  asyncHandler(async (req, res) => {
    // Optionally fetch more user data from DB
    const user = await Users.findById(req.user.id).select('username _id').lean()
    if (!user) return respond(res, 404, false, null, 'User not found')
    return respond(res, 200, true, { user }, 'User info')
  })
)

/* ------------------ error handler ------------------ */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  if (res.headersSent) return next(err)
  return respond(
    res,
    err.status || 500,
    false,
    null,
    err.message || 'Internal server error'
  )
})

/* ------------------ graceful shutdown ------------------ */
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} 🚀`)
)

const graceful = () => {
  console.log('Shutting down gracefully...')
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Mongo connection closed. Exiting.')
      process.exit(0)
    })
  })
  setTimeout(() => process.exit(1), 10000)
}

process.on('SIGTERM', graceful)
process.on('SIGINT', graceful)
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception', err)
  graceful()
})
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection', reason)
})

module.exports = app
