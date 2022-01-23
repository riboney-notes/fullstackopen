const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (req, res) => {
    Blog.find({})
        .then(blogs => res.status(200).json(blogs))
})

blogsRouter.get('/:id', (req, res, next) => {
    Blog.findById(req.params.id)
        .then(blog => {
            if(blog) res.status(200).json(blog)
            else res.status(404).end()
        })
        .catch(err => next(err))
})

blogsRouter.post('/', (req, res, next) => {
    const blog = new Blog({
        title: req.body.title,
        author: req.body.author,
        url: req.body.url,
        likes: req.body.likes,
    })

    blog.save()
        .then(rs => res.status(200).json(rs))
        .catch(err => next(err))
})

blogsRouter.delete('/:id', (req, res, next) => {
    Blog.findByIdAndRemove(request.params.id)
        .then(() => res.status(204).end())
        .catch(err => next(err))
})

blogsRouter.put('/:id', (req, res, next) => {
    const blog = new Blog({
        title: req.body.title,
        author: req.body.author,
        url: req.body.url,
        likes: req.body.likes,
    })

    Blog.findByIdAndUpdate(req.params.id, blog, {new:true})
        .then(rs => res.status(200).json(rs))
        .catch(err => next(err))
})

module.exports = blogsRouter