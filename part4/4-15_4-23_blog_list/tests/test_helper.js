const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')

const sampleBlogs = {
  singleNewPost : {
    title: "Harry Potter",
    author: "JK Rowlngs",
    url: "http://wikipedia.org",
    likes: 5,
  },

  invalidPostMissingLikes : {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    url: "http://wikipedia.org",
  },

  invalidPostMissingURL : {
    title: "Pride and Prejudice",
    author: "Jane Austen",
  },

  invalidPostMissingTitle : {
    author: "Jane Austen",
    url: "http://wikipedia.org",
  }
}

const initBlogUser = {
  username: 'test-username',
  name: 'test-name',
  password: 'test'
}

const createInitialUsers = async () => {
  const hash1 = await bcrypt.hash('test', 10)
  const hash2 = await bcrypt.hash('testtest', 10)
  const hash3 = await bcrypt.hash('testtesttest', 10)

  return [
    {
      username: 'test1',
      name: 'test-1',
      password: hash1
    },
    {
      username: 'test2',
      name: 'test-2',
      password: hash2
    },
    {
      username: 'test3',
      name: 'test-3',
      password: hash3
    }
  ]
  
}

const retrieveAllBlogs = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const retrieveAllUsers = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initBlogUser,
  sampleBlogs,
  createInitialUsers,
  retrieveAllBlogs, 
  retrieveAllUsers
}


// const initialBlogs = [
//   {
//     title: "React patterns",
//     author: "Michael Chan",
//     url: "https://reactpatterns.com/",
//     likes: 7,
//   },
//   {
//     title: "Go To Statement Considered Harmful",
//     author: "Edsger W. Dijkstra",
//     url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
//     likes: 5,
//   },
//   {
//     title: "Canonical string reduction",
//     author: "Edsger W. Dijkstra",
//     url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
//     likes: 12,
//   },
//   {
//     title: "First class tests",
//     author: "Robert C. Martin",
//     url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
//     likes: 10,
//   },
//   {
//     title: "TDD harms architecture",
//     author: "Robert C. Martin",
//     url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
//     likes: 0,
//   },
//   {
//     title: "Type wars",
//     author: "Robert C. Martin",
//     url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
//     likes: 2,
//   }  
// ]

// const initBlogUser = async () => {
//   const hash = await bcrypt.hash('test_blog', 10)

//   const user = new User({
//     username: 'test-username',
//     name: 'test-name',
//     password: hash
//   })
  
//   return (await user.save()).toJSON()
// }

// const produceInvalidId = async () => {
//   const blog = new Blog({title: 'test', author:'test-author', url: 'test-url', likes:'5'})
//   await blog.save()
//   await blog.remove()

//   return blog._id.toString();
// }