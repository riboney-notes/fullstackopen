const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: {
      type: Number,
      default: 0
    }
  }
)

blogSchema.set('toJSON', {
  transform: (doc, resultSet) => {
    resultSet.id = resultSet._id.toString()
    delete resultSet._id
    delete resultSet.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)