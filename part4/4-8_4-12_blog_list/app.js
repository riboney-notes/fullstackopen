const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleWare = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

const app = express()

logger.info('connecting to', config.MONGODB_URI)

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI)
    console.log('Connected to MongoDB')
  } catch(err){
    console.log('error connecting to MongoDB:', err.message);
  }
}

connectDB();

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleWare.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleWare.unknownEndpoint)
app.use(middleWare.errorHandler)

module.exports = app