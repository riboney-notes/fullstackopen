# Part 3: Programming a server with NodeJS and Express

## A: Node.js and Express

- Javascript code is transpiled for browsers since they don't yet support the newest features of JS

- Create new node app command: `npm init`

- Simple web server

```js
const http = require('http')

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```

- Converting js object or value to JSON string: `JSON.stringify({...})`
  - JSON is a string, not a JS object
  - not required if using express and sending response with `.json`: `response.json(notes)`

- Simple web server with express

```js
const express = require('express')
const app = express()

let notes = [
  ...
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

- interactive node-repl: `node`

- nodemon develepment install: `npm install --save-dev nodemon`
  - watches file for changes and restarts node app if any files change
  - how to use: `nodemon index.js`

- Defining parameter for routes

```js

app.get('/api/notes/:id', (request, response) => {
  // const id = request.params.id -> id is string, convert to number for notes.find()
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  
  if (note) {
    response.json(note)
  } else {
    // send 404 if note not found
    // Needs .end() to respond to request without sending data
    response.status(404).end()
  }
})

```

- deleting resource

```js
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})
```

- json parser: `app.use(express.json())`
  - this allows express app to take the JSON data of a request, transform it from string into a js object, and then attach it to the `body` property of the request object; otherwise the `request.body` would be undefined and you would not be able to see what JSON data was POSTED to the backend

- POST resource and generating ID and providing default values when not exists for newly created resource

```js
// required for readng request.body
app.use(express.json())

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  // json middleware required
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})
```

- Properties of request types: Safety and idempotence
  - Safety:a request is "Safe" if it does not cause any side effects in the server
    - GET and HEAD requests are *safe*
  - Side-effects: anything that changes the state of the database as a result of the request and the response only returning the data that already exists on the server
  - Idempotence: where requests having side-effects heve the same result regardless of how many times the request is sent
    - all requests except POST are idempotent
    - PUTS ends up with same result regardless of how many times its sent
    - POST is not idempotent since executing multiple POSTs means potentially adding multiple new changes (additions), unlike PUTs where the result is always the same

- middleware: functions that can be used for handling request and response objects
  - `app.use(express.json())` is a middleware that takes the raw data from the requests stored in the request object and parses it into a javascript object and assigns it to the request object as a new property body
  - recieves three parameters: `request, response, next`
    - `next` function yields control to the next middleware
  - multiple middleware may be used and are called in the order they are listed
    - order is important to ensure other middleware and routes operates properly and as intended

```js

// requests json parser for it to work, so that should be used first
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  // must be called at the end to pass control to the next middleware
  next()
}

app.use(express.json())
app.use(requestLogger)

// routes....

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// place at end to catch requests made to non-existent routes and handle error
app.use(unknownEndpoint)
```