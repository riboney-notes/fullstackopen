const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('./config')

const verifyToken = (req, res, next) => {
    if(!req.token  || !req.credentials.id || !req.credentials.username) return res.status(401).json({error: 'token missing or invalid'})
    else next()
}

// const verifyUser = async (req, res, next) => {
//     const user = await User.findById(req.credentials.id)
//     if(!user) return res.status(401).json({error: 'User not found'})
//     else {
//         req.user = user
//         next()
//     }
// }

module.exports = {
    verifyToken,
}