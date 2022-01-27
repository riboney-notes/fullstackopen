const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const {verifyToken, verifyUser} = require('../utils/auth')
const {JWT_SECRET} = require('../utils/config')

// const getTokenFrom = request => {
//     const authorization = request.get('authorization')

//     return (authorization && authorization.toLowerCase().startsWith('bearer '))
//      ? authorization.substring('bearer '.length)
//      : null
// }

// const verifyBlog = async (req, res, next) => {
//     const user = await User.findById(req.credentials.id)
//     if(!user.blogs.some(blogID => blogID.toString() === req.params.id))
//     res.status(404).end()
// }

blogsRouter.get('/', verifyToken, async (req, res) => {
    // const blogs = await Blog
    // .find({})    
    // .populate('user', {username:1, name:1})

    // res.status(200).json(blogs)

    const user = await User.findById(req.credentials.id)
    const blogs = await Blog.find({user: user.id}).exec()

    if(blogs){
        res.status(200).json(blogs)
    } else {
        res.status(404).end()
    }
})

blogsRouter.get('/:id', verifyToken, async (req, res, next) => {
    const user = await User.findById(req.credentials.id)
    if(user.blogs.some(blogID => blogID.toString() === req.params.id)){
        const blog = await Blog
        .findById(req.params.id)
        .populate('user', {username:1, name:1})

        if(blog) return res.status(200).json(blog)
    } 

    return res.status(404).end()
})

blogsRouter.post('/', verifyToken, async (req, res, next) => {
    // if(!req.token) return res.status(401).json({error: 'token missing or invalid'})

    // const credentials = jwt.verify(req.token, JWT_SECRET)

    // if(!credentials.id) return res.status(401).json({error: 'Token not decoded! Token missing or invalid'})

    //const users = (await User.find({})).map(user => user.toJSON())
    //if(users.length === 0) return res.status(401).json({error: "users don't exist!"})
    //const userId = users[(Math.floor(Math.random() * users.length))].id
    //const user = await User.findById(userId)

    const user = await User.findById(req.credentials.id)

    const blog = new Blog({
        title: req.body.title,
        author: req.body.author,
        url: req.body.url,
        likes: req.body.likes,
        user: req.credentials.id
    })

    try{
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        return res.status(200).json(savedBlog.toJSON())
    }
    catch (err){
        return next(err)
    }  
})

blogsRouter.delete('/:id', verifyToken, async  (req, res, next) => {
    const user = await User.findById(req.credentials.id)
    
    if(user.blogs.some(blogID => blogID.toString() === req.params.id)){
        const deletedBlog = await Blog.findByIdAndRemove(req.params.id)
        if(deletedBlog) return res.status(204).end();
    } 
    
    return res.status(404).end()
})

blogsRouter.put('/:id', verifyToken, async (req, res, next) => {
    const user = await User.findById(req.credentials.id)

    if(user.blogs.some(blogID => blogID.toString() === req.params.id)){
        const blog = {
            title: req.body.title,
            author: req.body.author,
            url: req.body.url,
            likes: req.body.likes,
            user: req.credentials.id
        }
        try{
            // new set to true means the function will return the updated blog
            const newBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {new: true})
            if(newBlog) return res.status(200).json(newBlog)
        } catch(err){
            return next(err)
        }
    }

    return res.status(404).end()
})

module.exports = blogsRouter