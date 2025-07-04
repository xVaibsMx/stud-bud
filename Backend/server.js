const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const { GoogleGenAI } = require('@google/genai')

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:5173', // Your frontend
    credentials: true,
  })
)

// Mongoose connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected ✅'))
  .catch((err) => console.log('MongoDB connection error ❌', err))

// User schema
const userSchema = mongoose.Schema({
  username: String,
  password: String,
})

const Users = mongoose.model('Users', userSchema)

// Middleware for protected routes
const isUserLogged = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    if (token) {
      jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) return res.status(403).send({ message: 'Invalid token!' })
        req.user = user
        next()
      })
    } else {
      return res.status(401).send({ message: 'Token not found!' })
    }
  } else {
    return res.status(401).send({ message: 'Authorization header missing!' })
  }
}

// =================== AUTH ROUTES ===================

app.post('/register', async (req, res) => {
  const { username, password } = req.body
  const userExist = await Users.findOne({ username })

  if (userExist) {
    return res.status(409).send({ message: 'Username already taken!' })
  }

  const hashedPass = await bcrypt.hash(password, 10)
  const user = new Users({ username, password: hashedPass })
  await user.save()

  const token = jwt.sign({ username }, process.env.SECRET, { expiresIn: '7d' })

  res.status(201).send({ message: 'User registered successfully!', token })
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const userCheck = await Users.findOne({ username })

  if (!userCheck) {
    return res.status(401).send({ message: 'Invalid username!' })
  }

  const passCheck = await bcrypt.compare(password, userCheck.password)

  if (!passCheck) {
    return res.status(401).send({ message: 'Incorrect password!' })
  }

  const token = jwt.sign({ username }, process.env.SECRET, { expiresIn: '7d' })

  res.status(200).send({ message: 'User logged in successfully!', token })
})

// =================== GEMINI AI ROUTES ===================

const getAIResponse = async (promptText) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY })
  const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const result = await model.generateContent([
    {
      role: 'user',
      parts: [{ text: promptText }],
    },
  ])

  const response = await result.response
  return await response.text()
}

app.post('/elia5', isUserLogged, async (req, res) => {
  const { content } = req.body
  const prompt = 'Explain like I am 5: ' + content

  try {
    const text = await getAIResponse(prompt)
    res.send({ message: text })
  } catch (err) {
    res.status(500).send({ message: 'Error from AI service.' })
  }
})

app.post('/revision', isUserLogged, async (req, res) => {
  const { content } = req.body
  const prompt = 'Give a quick revision: ' + content

  try {
    const text = await getAIResponse(prompt)
    res.send({ message: text })
  } catch (err) {
    res.status(500).send({ message: 'Error from AI service.' })
  }
})

// =================== UTIL ROUTES ===================

app.get('/', (req, res) => {
  res.send('Stud-Bud backend is running ✅')
})

app.get('/me', isUserLogged, (req, res) => {
  res.send({ user: req.user })
})

// =================== START SERVER ===================

app.listen(port, () => {
  console.log(`Server running on port ${port} 🚀`)
})
