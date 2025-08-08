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

// Middleware
app.use(express.json())

// CORS setup - allow your deployed frontend domain(s) here
app.use(cors())

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected ✅'))
  .catch((err) => {
    console.error('MongoDB connection error ❌', err)
    process.exit(1) // exit if DB connection fails
  })

// User schema and model
const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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

// Register route
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password)
      return res
        .status(400)
        .send({ message: 'Username and password required!' })

    const userExist = await Users.findOne({ username })
    if (userExist)
      return res.status(409).send({ message: 'Username already taken!' })

    const hashedPass = await bcrypt.hash(password, 10)
    const user = new Users({ username, password: hashedPass })
    await user.save()

    const token = jwt.sign({ username }, process.env.SECRET, {
      expiresIn: '7d',
    })
    res.status(201).send({ message: 'User registered successfully!', token })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).send({ message: 'Server error during registration.' })
  }
})

// Login route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password)
      return res
        .status(400)
        .send({ message: 'Username and password required!' })

    const userCheck = await Users.findOne({ username })
    if (!userCheck)
      return res.status(401).send({ message: 'Invalid username!' })

    const passCheck = await bcrypt.compare(password, userCheck.password)
    if (!passCheck)
      return res.status(401).send({ message: 'Incorrect password!' })

    const token = jwt.sign({ username }, process.env.SECRET, {
      expiresIn: '7d',
    })
    res.status(200).send({ message: 'User logged in successfully!', token })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).send({ message: 'Server error during login.' })
  }
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
    console.error('Error in getAIResponse:', err)
    throw err
  }
}

// AI routes
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

// Utility routes
app.get('/', (req, res) => {
  res.send('Stud-Bud backend is running ✅')
})

app.get('/test', (req, res) => {
  res.send({ message: 'API is alive 🚀' })
})

app.get('/me', isUserLogged, (req, res) => {
  res.send({ user: req.user })
})

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port} 🚀`)
})
