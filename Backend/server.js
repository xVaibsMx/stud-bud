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
  const { username, password } = req.headers
  const User = Users.find(
    (user) => user.username === username && user.password === password
  )
  if (User) {
    req.user = User
    next()
  } else {
    res.send('Incorrect username or password')
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

app.get('/me', isUserLoggedIn, (req, res) => {})
app.listen(Port, () => {
  console.log(`Server running on port ${Port}`)
})
