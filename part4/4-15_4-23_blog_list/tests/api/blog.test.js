const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../../app');
const  Blog = require('../../models/blog')
const User = require('../../models/user')
const {
    initBlogUser, 
    sampleBlogs,
    retrieveAllBlogs, 
} = require('../test_helper');

const api = supertest(app)

const blogRoute = '/api/blogs'
const userRoute = '/api/users'
const loginRoute = '/api/login'

let credentials

beforeAll( async () => {
    await Blog.deleteMany({})

    await User.deleteMany({})

    const blogUser = await api
    .post(userRoute)
    .send(initBlogUser)

    const userLogin = {
        username: blogUser.body.username,
        password: initBlogUser.password
    }

    credentials = (await api
    .post(loginRoute)
    .send(userLogin)).body

})

describe('User login tests', () => {
    test('Credentials is defined', () => {
        expect(credentials).not.toBeUndefined()
    })

    test('Token is defined', () => {
        expect(credentials.token).not.toBeUndefined()
    })

    test('Username is defined', () => {
        expect(credentials.username).not.toBeUndefined()
    })

    test('Name is defined', () => {
        expect(credentials.name).not.toBeUndefined()
    })
})

describe('blogs POST API tests', () => {
    
  
    test('blog POST request was successfully handled', async () => {
      await api.post(blogRoute)
      .send(sampleBlogs.singleNewPost)
      .set({'Authorization': `bearer ${credentials.token}`})
      .expect(200)
      .expect('Content-Type', /application\/json/)
    })

    test('blog POST request was successfully handles invalid token', async () => {
        await api.post(blogRoute)
        .send(sampleBlogs.singleNewPost)
        .set({'Authorization': `bearer poop`})
        .expect(401)
        .expect('Content-Type', /application\/json/)
      })
  
    test('total number of blogs is valid after POST', async () => {      
      const currentBlogs = await retrieveAllBlogs()
    
      expect(currentBlogs).toHaveLength(1)
    })
    
    test('blog title of new post is valid', async () => {
      const currentBlogs = await retrieveAllBlogs()
      const newBlog = currentBlogs[currentBlogs.length-1]
    
      expect(newBlog.title).toBe(sampleBlogs.singleNewPost.title)
    })
  
    test('missing likes of new blog results in it having likes default to 0', async () => {
      await api.post(blogRoute)
      .send(sampleBlogs.invalidPostMissingLikes)
      .set({'Authorization': `bearer ${credentials.token}`})

      
      const currentBlogs = await retrieveAllBlogs()
      const newBlog = currentBlogs[currentBlogs.length-1]
  
      expect(newBlog.likes).toBe(0)
    })
    
    test('missing title of new blog results in 400 Bad Request response', async () => {
      await api.post(blogRoute)
      .send(sampleBlogs.invalidPostMissingTitle)
      .set({'Authorization': `bearer ${credentials.token}`})
      .expect(400)
    })
  
    test('missing URL of new blog results in 400 Bad Request response', async () => {
      await api.post(blogRoute)
      .send(sampleBlogs.invalidPostMissingURL)
      .set({'Authorization': `bearer ${credentials.token}`})
      .expect(400)
    })
  })

describe('blogs GET route handling', () => {
    test('blogs are returned as json', async () => {
      await api
        .get(blogRoute)
        .set({'Authorization': `bearer ${credentials.token}`})
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    
    test('correct amount of blogs are returned as json', async () => {
      const response = await api
      .get(blogRoute)
      .set({'Authorization': `bearer ${credentials.token}`})
    
      expect(response.body).toHaveLength(2)
    })
    
    test('blog id is named "id" instead of the default "_id"', async () => {
      const blogs = await api
      .get(blogRoute)
      .set({'Authorization': `bearer ${credentials.token}`})

      expect(blogs.body[0].id).toBeDefined()
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
      .set({'Authorization': `bearer ${credentials.token}`})
      .expect(204)
    })
  
    test('total number of blogs is reduced by 1 after DELETE', async () => {
      const currentBlogs = await retrieveAllBlogs()
  
      expect(currentBlogs).toHaveLength(1)
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
      .set({'Authorization': `bearer ${credentials.token}`})
      .expect(200)
    })
  
    test('blog likes count is updated', async () => {
      const currentBlogs = await retrieveAllBlogs()
      expect(currentBlogs[0].likes).toBe(blogBeforeUpdate.likes + 1)
    })
})

afterAll(() => {
    mongoose.connection.close()
})