const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
    const users = await User
    .find({})
    .populate('blogs', {user: 0})

    res.status(200).json(users)
})

usersRouter.post('/', async (req, res) => {
    const body = req.body

    if(!body.password) return res.status(400).json({error: 'password is missing!'})
    if(!body.username) return res.status(400).json({error: 'username is missing!'})

    if(body.password.length < 3 || body.username.length < 3) 
    return res.status(400).json({error: 'Username or password is invalid! Must be atleast 3 characters long!'})
    
    const saltRounds = 10
    const password = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        password
    })

    try{
        const savedUser = await user.save()
        return res.json(savedUser)
    } catch(err){
        if(err.name === 'ValidationError')
        return res.status(400).json({error: 'Username already exists!'})
    }

})

usersRouter.delete('/:id', async (req, res, next) => {
    await User.findByIdAndRemove(req.params.id)
    res.status(204).end()
})

module.exports = usersRouter