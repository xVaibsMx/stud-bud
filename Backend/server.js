'use strict'

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

/* ------------------ ENV CHECKS ------------------ */
const requiredEnvs = ['MONGO_URL', 'SECRET', 'API_KEY']
for (const v of requiredEnvs) {
  if (!process.env[v]) {
    console.error(`Missing required env: ${v}. Exiting.`)
    process.exit(1)
  }
}

/* ------------------ MIDDLEWARE ------------------ */
app.use(helmet())
app.use(compression())
app.use(express.json({ limit: '20kb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

/* ------------------ CORS ------------------ */
const corsWhitelist = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (corsWhitelist.length === 0) return callback(null, true)
    if (corsWhitelist.includes(origin)) return callback(null, true)
    callback(new Error('Not allowed by CORS'))
  },
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

/* ------------------ RATE LIMITER ------------------ */
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests - try again later.' },
})
app.use(limiter)

/* ------------------ MONGO CONNECTION ------------------ */
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

/* ------------------ MODELS ------------------ */
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
)
const Users = mongoose.model('Users', userSchema)

/* ------------------ HELPERS ------------------ */
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

/* ------------------ AUTH MIDDLEWARE ------------------ */
const isUserLogged = asyncHandler(async (req, res, next) => {
  const token = getTokenFromHeader(req)
  if (!token)
    return respond(res, 401, false, null, 'Authorization token missing')

  try {
    const payload = jwt.verify(token, process.env.SECRET)
    req.user = { username: payload.username, id: payload.id }
    next()
  } catch {
    return respond(res, 401, false, null, 'Invalid or expired token')
  }
})

/* ------------------ AUTH ROUTES ------------------ */
app.post(
  '/register',
  [
    body('username').isString().trim().isLength({ min: 3, max: 40 }),
    body('password').isString().isLength({ min: 3, max: 128 }),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return respond(res, 400, false, null, 'Invalid input')

    const { username, password } = req.body
    const existing = await Users.findOne({ username }).lean()
    if (existing)
      return respond(res, 409, false, null, 'Username already taken')

    const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10)
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
      { token, user: { username: user.username, id: user._id.toString() } },
      'User registered'
    )
  })
)

app.post(
  '/login',
  [
    body('username').isString().trim().isLength({ min: 3, max: 40 }),
    body('password').isString().isLength({ min: 3, max: 128 }),
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
      { token, user: { username: user.username, id: user._id.toString() } },
      'Logged in'
    )
  })
)

/* ------------------ /me ROUTE ------------------ */
app.get(
  '/me',
  isUserLogged,
  asyncHandler(async (req, res) => {
    const user = await Users.findById(req.user.id).select('username _id').lean()
    if (!user) {
      return respond(res, 401, false, null, 'Invalid or expired token')
    }

    const formattedUser = { username: user.username, id: user._id.toString() }
    return respond(res, 200, true, { user: formattedUser }, 'User info')
  })
)

/* ------------------ AI PART ------------------ */
const { GoogleGenAI } = require('@google/genai')
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

const aiRoutes = [
  { path: '/elia5', prefix: 'Explain like I am 5: ' },
  { path: '/revision', prefix: 'Give a quick revision: ' },
  {
    path: '/quiz',
    prefix: 'Make a short quiz of 3 questions with answers for: ',
  },
]

aiRoutes.forEach(({ path, prefix }) => {
  app.post(
    path,
    isUserLogged,
    asyncHandler(async (req, res) => {
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
  )
})

/* ------------------ UTILITY ROUTES ------------------ */
app.get('/', (req, res) => res.send('Stud-Bud backend is running ✅'))
app.get('/test', (req, res) => res.send({ message: 'API is alive 🚀' }))
app.get('/health', (req, res) =>
  res.status(200).json({ success: true, message: 'Backend is healthy ✅' })
)

/* ------------------ ERROR HANDLER ------------------ */
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

/* ------------------ GRACEFUL SHUTDOWN ------------------ */
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
