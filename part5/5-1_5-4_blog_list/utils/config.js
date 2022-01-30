require('dotenv').config()

const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGO_ATLAS_URI : process.env.MONGO_ATLAS_URI
const JWT_SECRET = process.env.SECRET

module.exports = {
    MONGODB_URI,
    PORT,
    JWT_SECRET
}