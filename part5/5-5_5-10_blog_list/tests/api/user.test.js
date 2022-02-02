const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../../app');
const User = require('../../models/user')
const {
    createInitialUsers,
    retrieveAllUsers 
} = require('../test_helper');

const api = supertest(app)

const userRoute = '/api/users'

beforeAll(async () => {
    await User.deleteMany({})
    const users = (await createInitialUsers()).map(user => new User(user))
    const userPromises = users.map(user => user.save())
    await Promise.all(userPromises)
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
      console.log("THE USERS THE USERS THE USERS \n\n\n", users.body)
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