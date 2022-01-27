const jwt = require('jsonwebtoken')
const logger = require('./logger')
const {JWT_SECRET} = require('./config')

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method)
    logger.info('Path:', req.path)
    logger.info('Body:', req.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (req, res) => res.status(404).send({error:'unknown endpoint'})

const errorHandler = (err, req, res, next) => {
    logger.error('ERROR!\n', err.message)

    if(err.name === 'CastError') return res.status(400).send({error: err.message})
    else if(err.name === 'ValidationError') return res.status(400).json({error: err.message})
    else if (err.name === 'JsonWebTokenError') return res.status(401).json({error: 'Token is invalid'})
    else next(err)
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')

    req.token = (authorization && authorization.toLowerCase().startsWith('bearer '))
     ? authorization.substring('bearer '.length)
     : null 

    next()
}

const userExtractor = (req, res, next) => {
    const credentials = jwt.verify(req.token, JWT_SECRET)

    req.credentials = (credentials.id && credentials.username) ? credentials: null

    next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}