const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

//GET ALL USERS
usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

//CREATE USER
usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
    if(password.length>3){
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)
        const user = new User({username,name,passwordHash,})
        const savedUser = await user.save()
        response.status(201).json(savedUser)
    }else{response.status(400).json({ error: 'password should have at least 3 characters!' })}
})

module.exports = usersRouter