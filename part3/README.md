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

## B: Deploying app to internet

- CORS (Cross-Origin Resourcec Sharing)
  - mechanism that allows restriced resources on a webpage to be requested from another domain outside the domain from which the first resource was served....so cross-origin things like images, fonts, stylesheets, scripts, etc can be embedded but things like Ajax requests are forbidden by same-origin security policies
    - origin consists of: protocal (http), port (if specified) and host
    - javascript code of an app that runs in a browser (like react app) can only communicate with a server in the same origin
- Allow requests from other origins by using the cors middleware
  - `const cors = require('cors')`, this will allow react to make requests to API
  - not needed if react and backend are at the same address (like in production)

### Getting app ready for deployment
- set port to `process.env.port`: `const PORT = process.env.PORT || 3001`
- Add these deployment scripts to backend package.json:
  ```json
    "build:ui": "rm -rf build && cd ./client && npm run build --prod && cp -r build ../",
    "deploy": "git push heroku main",
    "deploy:full": "npm run build:ui && git add . && git commit -m 'builds and deploys app' && npm run deploy",    
    "logs:prod": "heroku logs --tail"
  ```
  - `npm run build`: this script executed in react app will generate `build` folder for serving react app in production
    - it must be copied to the root of the backend directory, which is done by `build:ui` script
    - app must be build after any changes
    - Make sure `build/` is not `.gitignore`-ed!
- Enable express to serve static build files from react `app.use(express.static('build'))`
  - Express will now check `build` directory for static files matching the request address, thereby serving React app code
- Update urls in react relative urls (since both frontend and backend are at the same address now)
  - remember to rebuild app
- Add proxy to react package.json to allow it to make API calls to backend in development since the URLS are point to relative addresses and not the correct ports: `,"proxy": "http://localhost:3001",` 

### Heroku setup & some heroku commands
- Install Heroku CLI
- Login to heroku: `heroku login`
- In project directory: `heroku create`
- Push app to heroku: `git push heroku main`
- Visit the website app is hosted on: `heroku open`
- see app logs: `heroku logs --tail`
- Define `Procfile`, which is a text file in the root directory of app and declare what command should be executed to start the app: `web: npm start`
- scale app to dyno (which is like a docker container): `heroku ps:scale web=1`
- to run app locally, for testing stuff: `heroku local`
- pushing local changes: first stage and commit, then `git push heroku main`