const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Users = require('../model/Users')
const secret = 'S3cr3t'

exports.register = async (req, res) => {
  const { username, password } = req.body
  const hashedPass = bcrypt.hash(password, 10)
  const user = new Users({ username, password: hashedPass })
  const token = jwt.sign(username, secret)
  await user.save()

  res
    .status(200)
    .send({ message: 'User registered successfully', token: token })
}

exports.login = async (req, res) => {
  const { username, password } = req.body
  const userExist = await Users.findOne({ username, password })
  if (userExist) {
    const token = jwt.sign(username, secret)
    res.status(200).send({ message: 'User loggen in successfully!' })
  } else {
    res.status(401).send({ message: 'Invalid credentials' })
  }
}
