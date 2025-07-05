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
    origin: 'http://localhost:5173',
    credentials: true,
  })
)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected ✅'))
  .catch((err) => console.log('MongoDB connection error ❌', err))

// User schema and model
const userSchema = mongoose.Schema({
  username: String,
  password: String,
})
const Users = mongoose.model('Users', userSchema)

// Auth middleware
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

// Auth routes
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

// Gemini AI helper
const getAIResponse = async (promptText) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY })
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
    })
    return response.text
  } catch (err) {
    console.error('❌ Error in getAIResponse:', err)
    throw err
  }
}

// AI routes
app.post('/elia5', isUserLogged, async (req, res) => {
  const { content } = req.body
  const prompt = 'Explain like I am 5: ' + content

  try {
    console.log('🧠 Prompt:', prompt)
    const text = await getAIResponse(prompt)
    res.send({ message: text })
  } catch (err) {
    console.error('❌ AI Error:', err)
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
    console.error('❌ AI Error:', err)
    res.status(500).send({ message: 'Error from AI service.' })
  }
})

// Util routes
app.get('/', (req, res) => {
  res.send('Stud-Bud backend is running ✅')
})

app.get('/me', isUserLogged, (req, res) => {
  res.send({ user: req.user })
})

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port} 🚀`)
})
