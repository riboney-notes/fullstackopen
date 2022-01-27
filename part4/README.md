# Part 4: Testing Express servers, user administration

## A: Structure of backend application, introduction to testing

* Popular file structure for nodejs backend

```bash
├── index.js
├── app.js
├── build
│   └── ...
├── controllers
│   └── notes.js
├── models
│   └── note.js
├── package-lock.json
├── package.json
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js  
```

* Custom logger

```js
const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}
```

* `index.js` being used for starting application

```js
const app = require('./app') // the actual Express application
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

* Handling environment variables in `utils/config.js`

```js
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}

// using config.js
const config = require('./utils/config')

logger.info(`Server running on port ${config.PORT}`)
```

* Controllers: event handlers of routes
  * Router objects:

  ```bash  
  A router object is an isolated instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions. Every Express application has a built-in app router.

  ------

  Router is middleware that can be used for defining related routes in a single place
  ```

```js
const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter

// using router
const notesRouter = require('./controllers/notes')
app.use('/api/notes', notesRouter)
```

* app.js sets up express and connects to db (although I would probably put the db code in a different file)

```js
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

* `middleware.js` for handling custom middleware creation

```js
const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
```

* Example of a mongoose schema/model

```js
const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  date: {
    type: Date,
    required: true,
  },
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)
```

* Adding test runner to app: `npm install --save-dev jest`
  * package-json
    * script: `"test": "jest --verbose"`
    * configuration. add to the end of `package.json`: `"jest": {"testEnvironment":"node"}` OR use `jest.config.js`
    * configure ESLint for jest: add to `.eslintrc.js`: `'env':{...'jest':true,}`

* Name test files with this patter: `<name>.test.js`

```js
const palindrome = require('../utils/for_testing').palindrome

test('palindrome of a', () => {
  const result = palindrome('a')

  expect(result).toBe('a')
})

test('palindrome of react', () => {
  const result = palindrome('react')

  expect(result).toBe('tcaer')
})

test('palindrome of releveler', () => {
  const result = palindrome('releveler')

  expect(result).toBe('releveler')
})
```

* Use `describe` block to group together related tests

```js
describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
})
```

* Can run a single test (or describe block) by specifying the name of the test to be run with the -t flag: `npm test -- -t 'when list has only one blog, equals the likes of that'`

## B: Testing the backend

* Integration testing: Where multiple components of the system are tested together as a group
* It is common practice to define separate modes for development and 
* You can set the `env` when running scripts to change to the appropriate one for the script
  * For prod: Change `NODE_ENV` to `prod`, ex: `"start": "NODE_ENV=prod node index.js"`
  * For dev: Change `NODE_ENV` to `dev`, ex: `"dev": "NODE_ENV=dev nodemon index.js"`
  * For testing: Change `NODE_ENV` to test, ex: `"test": "NODE_ENV=test jest --verbose --runInBand"`
    * In action:  `const MONGODB_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI: process.env.MONGODB_URI`
    * Modifying logger so that it does not print to console in test mode:

    ```js
    const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') { 
        console.log(...params)
      }
    }

    const error = (...params) => {
      if (process.env.NODE_ENV !== 'test') { 
        console.error(...params)
      }
    }

    module.exports = {
      info, error
    }
    ```

* Better to use different database (in-memory or docker) for tests
* Testing HTTP: [SuperTest](https://github.com/visionmedia/supertest)
  * `npm install supertest --save-dev`
  * Note, its ok if `port` is not defined since `supertest` will define its own

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Note = require('../models/note')
const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true,
  },
]
beforeEach(async () => {
  await Note.deleteMany({})
  let noteObject = new Note(initialNotes[0])
  await noteObject.save()
  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

// test('there are two notes', async () => {
//   const response = await api.get('/api/notes')

//   expect(response.body).toHaveLength(2)
// })

// test('the first note is about HTTP methods', async () => {
//   const response = await api.get('/api/notes')

//   expect(response.body[0].content).toBe('HTML is easy')
// })

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)
  expect(contents).toContain(
    'Browser can execute only Javascript'
  )
})

test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)

  expect(response.body).toHaveLength(initialNotes.length + 1)
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )

  test('note without content is not added', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
```

* Solving timeout or async-running-in-background type warning messages:

```js
// create jest.config.js at root with the following:
module.exports = {testEnvironment:  'node'}

// if test takes longer than the default Jest timeout of 5000ms, then add third parameter to test function with the expected time:

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)
```

* Running tests one by one (todo: look up whether Jest runs afterAll() to close db connection)

```bash
# running specific test suite
npm test -- tests/note_api.test.js

# running specific test with name
npm test -- -t "a specific note is within the returned notes"

npm test -- -t 'notes'

```

* Regression: software bug where a feature that has worked before stops working after future changes

* Dealing with exceptions with async/await in routers:

```js
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })
  try { 
    const savedNote = await note.save()
    response.json(savedNote)
  } catch(exception) {
    next(exception)
  }
})
```

* `beforeEach` will not wait for async operations to finish that are defined not directly in scope (ex: async operations inside `forEach` loop will not be `await`ed)
  * use `Promise.all` to address this

  ```js

  // before
  beforeEach(async () => {
    await Note.deleteMany({})
    console.log('cleared')

    helper.initialNotes.forEach(async (note) => {
      let noteObject = new Note(note)
      await noteObject.save()
      console.log('saved')
    })
    console.log('done')
  })

  // after Promise.all
  beforeEach(async () => {
    await Note.deleteMany({})

    const noteObjects = helper.initialNotes
      .map(note => new Note(note))
    const promiseArray = noteObjects.map(note => note.save())
    await Promise.all(promiseArray)
  })
  ```

  ```bash
  # explanation:
  The Promise.all method can be used for Transforming an array of Promises into a single promise that will be fulfilled once every promise in the array passed to it as a parameter is resolved. The last line of code await Promise.all (promiseArray) Waits that every promise for saving a note is finished, meaning that the database has been initialized.

  The returned values ​​of each promise in the array can still be accessed when using the Promise.all method. If we wait for the Promises to be resolved with the await syntax const results = await Promise.all (promiseArray) , the operation will return an array that contains the resolved values ​​for each promise in the promiseArray , and they appear in the same order as the Promises in the array.

  Promise.all executes the Promises it receives in parallel. If the Promises need to be executed in a particular order, this will be problematic. In situations like this, the operations can be executed inside of a for ... of block, that guarantees a specific execution order.

  Ex:
  beforeEach(async () => {
    await Note.deleteMany({})

    for (let note of helper.initialNotes) {
      let noteObject = new Note(note)
      await noteObject.save()
    }
  })

 
  ```

## Part C: User Administration

* Creating mongoose schema for user and having it reference another collection by its id:

```js
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
```

* Defining router for users:

```js
const usersRouter = require('./controllers/users')

// ...

app.use('/api/users', usersRouter)
```

* POST method for user router:

```js
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter
```

* Some API tests for User

```js
const bcrypt = require('bcrypt')
const User = require('../models/user')

//...

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

// helper function
const User = require('../models/user')

// ...

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
}
```

* Refactoring notes to include reference to user when making new note

```js
const User = require('../models/user')

//...

notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const user = await User.findById(body.userId)

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  
  response.json(savedNote)
})
```

* Using mongoose `populate` to include not just the IDs of the referenced collection items, but the items themselves

```js
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes', { content: 1, date: 1 })

  response.json(users)
});
```

## Part D: Token Authentication

* Creating router for logins

```js
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // process.env.SECRET must be set (most likely in .env file)
  //    it can be any string
  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
```

* Adding login router to express app

```js
const loginRouter = require('./controllers/login')

//...

app.use('/api/login', loginRouter)
```

* Refactoring POST router to allow creation of notes only if valid token is attached (ie user is logged in)

```js
const jwt = require('jsonwebtoken')

// ...
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

notesRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.json(savedNote)
})
```

* refactoring error handling middleware to account for invalid JWT tokens

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id'
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message 
    })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }

  logger.error(error.message)

  next(error)
}
```