const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})

    res.status(200).json(blogs)
})

blogsRouter.get('/:id', async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);
    if(blog) res.status(200).json(blog)
    else res.status(404).end()  
})

blogsRouter.post('/', async (req, res, next) => {
    const blog = new Blog({
        title: req.body.title,
        author: req.body.author,
        url: req.body.url,
        likes: req.body.likes,
    })

    const savedBlog = await blog.save()
    res.status(200).json(savedBlog)
})

blogsRouter.delete('/:id', async  (req, res, next) => {
    await Blog.findByIdAndRemove(request.params.id)
    res.status(204).end();
})

blogsRouter.put('/:id', async (req, res, next) => {
    const blog = new Blog({
        title: req.body.title,
        author: req.body.author,
        url: req.body.url,
        likes: req.body.likes,
    })
    
    res.status(200).json(newBlog)
})

module.exports = blogsRouter