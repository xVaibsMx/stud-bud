const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const { GoogleGenAI } = require('@google/genai')

dotenv.config()

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:5173', // or your frontend origin
    credentials: true,
  })
)

const userSchema = mongoose.Schema({
  username: String,
  password: String,
})

const Users = mongoose.model('Users', userSchema)

mongoose.connect(process.env.MONGO_URL)

const isUserLogged = (req, res, next) => {
  const authHeaders = req.headers.authorization
  if (authHeaders) {
    const token = authHeaders.split(' ')[1]
    if (token) {
      jwt.verify(token, process.env.SECRET, (error, user) => {
        if (error) {
          res.send({ message: 'error while verifying the token!!' })
        }
        req.user = user
        next()
      })
    } else {
      res.send({ message: 'token not found!!' })
    }
  } else {
    res.send({ message: 'error in authorization!!' })
  }
}

app.post('/register', async (req, res) => {
  const { username, password } = req.body
  const userExist = await Users.findOne({ username })
  if (userExist) {
    res.status(401).send({ message: 'Username already taken!!' })
  } else {
    const hashedPass = await bcrypt.hash(password, 10)
    const token = jwt.sign({ username }, process.env.SECRET)
    const user = new Users({ username, password: hashedPass })
    await user.save()
    res
      .status(200)
      .send({ message: 'User registered successfully!!', token: token })
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const userCheck = await Users.findOne({ username })
  if (userCheck) {
    const passCheck = await bcrypt.compare(password, userCheck.password)
    if (passCheck) {
      const token = jwt.sign(username, process.env.SECRET)
      res
        .status(201)
        .send({ message: 'User logged in successfully!!', token: token })
    } else {
      const token = jwt.sign(username, process.env.SECRET)
      res.status(404).send({ message: 'Incorrect password!!' })
    }
  } else {
    res.status(401).send({ message: 'Invalid username!' })
  }
})

app.get('/me', isUserLogged, (req, res) => {
  const user = req.user
  res.send(user)
})

app.post('/elia5', isUserLogged, async (req, res) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY })
  const { content } = req.body.content
  const prompt = 'Explain like I am 5:' + content
  console.log(prompt)

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  })
  if (response) {
    res.send({ message: response.text })
  } else {
    res.send({ message: 'Ask something !!' })
  }
})

app.get('/revision', isUserLogged, async (req, res) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY })
  const content = req.body
  const prompt = 'Give a quick revison:' + content
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  })
  if (response) {
    res.send({ message: response.text })
  } else {
    res.send({ message: 'Ask something !!' })
  }
})

app.listen(port, (req, res) => {
  console.log(`Server running on port ${port}`)
})
