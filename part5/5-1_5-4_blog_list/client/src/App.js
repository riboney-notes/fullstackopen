import React, { useState, useEffect } from 'react'
import Blogs from './components/Blogs'
import Login from './components/Login'
import BlogForm from './components/BlogForm'
import Logout from './components/Logout'
import Notification from './components/Notification'
import * as blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [ msg, setMsg ] = useState('')

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  const resetNotification = () => {
    console.log('Notification is resetted!')
    setTimeout(() => {
      setMsg('')
    }, 3000);
  }

  useEffect(() => {
    async function getBlogs(){
     const blogs = await blogService.getAll()
     setBlogs( blogs ) 
    }

    getBlogs()
  })


useEffect(resetNotification, [msg])

useEffect(() => console.log('Msg: ', msg), [msg])

useEffect( () => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')

  if(loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    setUser(user)
    blogService.setToken(user.token)
  }
}, [])

  const loginForm = () => {
    return (
    <Login 
      username={username}
      password={password}
      setUsername={setUsername}
      setPassword={setPassword}
      setUser={setUser}
      setMsg={setMsg}
    />
    )
  }

  const blogForm = () => {
    return (
      <div>
        {/* <p>{user.name} logged-in</p> */}
        <Logout setUser={setUser} user={user} />
        <BlogForm 
          setTitle={setTitle}
          title={title}
          setAuthor={setAuthor}
          author={author}
          setURL={setURL}
          url={url}
          setMsg={setMsg}
        />
        {!blogs || blogs.length === 0 
          ? <div>No blogs present</div>
          : <Blogs blogs={blogs}/>
        }
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <br/>
      {msg === '' ? null: <Notification msg={msg}/>}
      {user === null ? loginForm(): blogForm()}
    </div>
  )
}

export default App