const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
dotenv.config()

app.use(express.json())
app.use(cors())

mongoose.connect('mongodb+srv://Vaibhav:0718@cluster0.ojh4zq9.mongodb.net/auth')

app.use('/api/auth', require('./routes/auth'))

const PORT = 3000
app.listen(PORT, () => console.log(`Server running on ${PORT}`))
