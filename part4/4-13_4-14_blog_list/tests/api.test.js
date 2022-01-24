const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app');
const  Blog = require('../models/blog')
const {initialBlogs, produceInvalidId, retrieveAllBlogs } = require('./test_helper')

const api = supertest(app)

const mainRoute = '/api/blogs'

beforeAll( async () => {
  await Blog.deleteMany({});
  const blogs = initialBlogs.map(blog => new Blog(blog))
  const promises = blogs.map(blog => blog.save())
  await Promise.all(promises)
})

test('blogs are returned as json', async () => {
  await api
    .get(mainRoute)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct amount of blogs are returned as json', async () => {
  const response = await api.get(mainRoute)

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('Verifies id is named "id" instead of the default "_id"', async () => {
  const blogs = await api.get(mainRoute)
  console.log('id of first blog post', blogs.body[0].id)
  expect(blogs.body[0].id).toBeDefined()
})

describe('tests POST route handling', () => {
  const newPost = {
    title: "Harry Potter",
    author: "JK Rowlngs",
    url: "http://wikipedia.org",
    likes: 5,
  }

  const newPostWNoLikes = {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    url: "http://wikipedia.org",
  }

  const newPostWNoURL = {
    title: "Pride and Prejudice",
    author: "Jane Austen",
  }

  const newPostWNoTitle = {
    author: "Jane Austen",
    url: "http://wikipedia.org",
  }

  test('Verifies POST request was successfully handled', async () => {
    await api.post(mainRoute)
    .send(newPost)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  })

  test('Verifies total number of blogs is increased by one after POST', async () => {      
    const currentBlogs = await retrieveAllBlogs()
  
    expect(currentBlogs).toHaveLength(initialBlogs.length + 1)
  })
  
  test('Verifies title of new post is valid', async () => {
    const currentBlogs = await retrieveAllBlogs()
    const newBlog = currentBlogs[currentBlogs.length-1]
  
    expect(newBlog.title).toBe(newPost.title)
  })

  test('Verifies missing likes of new blog results in it having likes default to 0', async () => {
    await api.post(mainRoute)
    .send(newPostWNoLikes)
    
    const currentBlogs = await retrieveAllBlogs()
    const newBlog = currentBlogs[currentBlogs.length-1]

    expect(newBlog.likes).toBe(0)
  })
  
  test('Verifies missing title results in 400 Bad Request response', async () => {
    await api.post(mainRoute)
    .send(newPostWNoTitle)
    .expect(400)
  })

  test('Verifies missing URL results in 400 Bad Request response', async () => {
    await api.post(mainRoute)
    .send(newPostWNoURL)
    .expect(400)
  })
})

describe('tests DELETE route handling', () => {
  let blogToDelete

  beforeAll(async () => {
    const currentBlogs = await retrieveAllBlogs()
    blogToDelete = currentBlogs[0]
  })

  test('Verifies DELETE request is successfully handled', async () => {
    await api
    .delete(`${mainRoute}/${blogToDelete.id}`)
    .expect(204)
  })

  test('Verifies total number of blogs is reduced by 1 after DELETE', async () => {
    const currentBlogs = await retrieveAllBlogs()

    expect(currentBlogs).toHaveLength(initialBlogs.length - 1)
  })

  test('Verifies correct blog was deleted', async () => {
    const currentBlogs = await retrieveAllBlogs()

    expect(currentBlogs[0].title).not.toContain(blogToDelete.title)
  })
})

describe('tests PUT route handling', () => {
  let blogBeforeUpdate
  let blogAfterUpdate

  beforeAll(async () => {
    const currentBlogs = await retrieveAllBlogs()
    blogBeforeUpdate = currentBlogs[0]
    blogAfterUpdate = {...blogBeforeUpdate}
    blogAfterUpdate.likes++

    console.log('Before update', blogBeforeUpdate)
    console.log("Updated blog", blogAfterUpdate) 
  })

  test('Verifies PUT request is successfully handled', async () => {
    await api
    .put(`${mainRoute}/${blogBeforeUpdate.id}`)
    .send(blogAfterUpdate)
    .expect(200)
  })

  test('Verifies blog likes count is updated', async () => {
    const currentBlogs = await retrieveAllBlogs()
    expect(currentBlogs[0].likes).toBe(blogBeforeUpdate.likes + 1)
  })


})

afterAll(() => {
  mongoose.connection.close()
})