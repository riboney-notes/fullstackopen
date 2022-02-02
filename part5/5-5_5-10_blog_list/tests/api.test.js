const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app');
const  Blog = require('../models/blog')
const User = require('../models/user')
const {initialBlogs, createInitialUsers, produceInvalidId, retrieveAllBlogs, retrieveAllUsers } = require('./test_helper')

const api = supertest(app)

const blogRoute = '/api/blogs'
const userRoute = '/api/users'


beforeAll( async () => {
  await Blog.deleteMany({});
  const blogs = initialBlogs.map(blog => new Blog(blog))
  const blogPromises = blogs.map(blog => blog.save())

  await User.deleteMany({})
  const users = (await createInitialUsers()).map(user => new User(user))
  const userPromises = users.map(user => user.save())
  await Promise.all(blogPromises)
  await Promise.all(userPromises)
})

describe('blogs GET route handling', () => {
  test('blogs are returned as json', async () => {
    await api
      .get(blogRoute)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('correct amount of blogs are returned as json', async () => {
    const response = await api.get(blogRoute)
  
    expect(response.body).toHaveLength(initialBlogs.length)
  })
  
  test('blog id is named "id" instead of the default "_id"', async () => {
    const blogs = await api.get(blogRoute)
    console.log('id of first blog post', blogs.body[0].id)
    expect(blogs.body[0].id).toBeDefined()
  })
})

describe('blogs POST route handling', () => {
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

  test('blog POST request was successfully handled', async () => {
    await api.post(blogRoute)
    .send(newPost)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  })

  test('total number of blogs is increased by one after POST', async () => {      
    const currentBlogs = await retrieveAllBlogs()
  
    expect(currentBlogs).toHaveLength(initialBlogs.length + 1)
  })
  
  test('blog title of new post is valid', async () => {
    const currentBlogs = await retrieveAllBlogs()
    const newBlog = currentBlogs[currentBlogs.length-1]
  
    expect(newBlog.title).toBe(newPost.title)
  })

  test('missing likes of new blog results in it having likes default to 0', async () => {
    await api.post(blogRoute)
    .send(newPostWNoLikes)
    
    const currentBlogs = await retrieveAllBlogs()
    const newBlog = currentBlogs[currentBlogs.length-1]

    expect(newBlog.likes).toBe(0)
  })
  
  test('missing title of new blog results in 400 Bad Request response', async () => {
    await api.post(blogRoute)
    .send(newPostWNoTitle)
    .expect(400)
  })

  test('missing URL of new blog results in 400 Bad Request response', async () => {
    await api.post(blogRoute)
    .send(newPostWNoURL)
    .expect(400)
  })
})

describe('blogs DELETE route handling', () => {
  let blogToDelete

  beforeAll(async () => {
    const currentBlogs = await retrieveAllBlogs()
    blogToDelete = currentBlogs[0]
  })

  test('DELETE request is successfully handled', async () => {
    await api
    .delete(`${blogRoute}/${blogToDelete.id}`)
    .expect(204)
  })

  test('total number of blogs is reduced by 1 after DELETE', async () => {
    const currentBlogs = await retrieveAllBlogs()

    expect(currentBlogs).toHaveLength(initialBlogs.length - 1)
  })

  test('correct blog was deleted', async () => {
    const currentBlogs = await retrieveAllBlogs()

    expect(currentBlogs[0].title).not.toContain(blogToDelete.title)
  })
})

describe('blogs PUT route handling', () => {
  let blogBeforeUpdate
  let blogAfterUpdate

  beforeAll(async () => {
    const currentBlogs = await retrieveAllBlogs()
    blogBeforeUpdate = currentBlogs[0]
    blogAfterUpdate = {...blogBeforeUpdate}
    blogAfterUpdate.likes++
  })

  test('PUT request is successfully handled', async () => {
    await api
    .put(`${blogRoute}/${blogBeforeUpdate.id}`)
    .send(blogAfterUpdate)
    .expect(200)
  })

  test('blog likes count is updated', async () => {
    const currentBlogs = await retrieveAllBlogs()
    expect(currentBlogs[0].likes).toBe(blogBeforeUpdate.likes + 1)
  })
})

describe('User API tests', () => {
  const newUser = {
    username: 'testUser2',
    password: 'test'
  }

  let usersAtStart
  let usersAfterStart

  beforeAll(async () => {
    usersAtStart = await retrieveAllUsers()
  })

  test('users are returned as json', async () => {
    await api
      .get(userRoute)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('correct amount of users are returned as json', async () => {
    const response = await api.get(userRoute)
  
    expect(response.body).toHaveLength(usersAtStart.length)
  })
  
  test('user id is named "id" instead of the default "_id"', async () => {
    const users = await api.get(userRoute)
    expect(users.body[0].id).toBeDefined()
  })

  test('POST request was successfully handled', async () => {
    await api
    .post(userRoute)
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  })

  test('total number of users is correct', async () => {
    usersAfterStart = await retrieveAllUsers()
    expect(usersAfterStart).toHaveLength(usersAtStart.length + 1)
  })

  test('correct user is found after POST', async () => {
    const usernames = usersAfterStart.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('Invalid status code when username is missing in POST request', async () => {
    const invalidUser = {
      password: 'test'
    }

    await api
    .post(userRoute)
    .send(invalidUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
  })

  test('Invalid status code when password is missing in POST request', async () => {
    const invalidUser = {
      username: 'test'
    }

    await api
    .post(userRoute)
    .send(invalidUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
  })

  test('Creating user with an existing username results in error', async() => {
    const invalidUser = {...newUser}
    await api
    .post(userRoute)
    .send(invalidUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
  })
})

afterAll(() => {
  mongoose.connection.close()
})