const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app');
const  Blog = require('../models/blog')
const {initialBlogs, produceInvalidId, retrieveAllBlogs } = require('./test_helper')

const api = supertest(app)



beforeAll( async () => {
  await Blog.deleteMany({});
  const blogs = initialBlogs.map(blog => new Blog(blog))
  const promises = blogs.map(blog => blog.save())
  await Promise.all(promises)
})

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('')



afterAll((done) => {
  mongoose.connection.close()
  done()
})