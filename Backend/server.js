const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const Port = process.env.PORT

app.use(express.json())
app.use(cors())

const isUserLoggedIn = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Authorization token missing' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    req.user = decoded.username
    next()
  } catch (err) {
    res.status(401).send({ message: 'Invalid token' })
  }
}

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
})

const Users = mongoose.model('Users', userSchema)

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err))

app.post('/register', async (req, res) => {
  const { username, password } = req.body
  const userExist = await Users.findOne({ username })
  if (userExist) {
    res.status(403).send({ message: 'Username already taken!!' })
  } else {
    const hashedPass = await bcrypt.hash(password, 10)
    const token = jwt.sign({ username }, process.env.SECRET)
    const user = new Users({ username, password: hashedPass })
    await user.save()

    res
      .status(201)
      .send({ message: 'User registered successfully!', token: token })
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  const user = await Users.findOne({ username })
  if (!user) {
    return res.status(401).send({ message: 'Invalid credentials' })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return res.status(401).send({ message: 'Invalid credentials' })
  }

  const token = jwt.sign({ username }, process.env.SECRET)
  res.status(200).send({ message: 'User logged in successfully!', token })
})

app.get('/me', isUserLoggedIn, (req, res) => {
  res.status(200).send({ username: req.user })
})
app.listen(Port, () => {
  console.log(`Server running on port ${Port}`)
})
