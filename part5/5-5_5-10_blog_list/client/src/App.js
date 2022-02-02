import React, { useState, useEffect, useRef } from 'react'
import Blogs from './components/Blogs'
import Login from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Logout from './components/Logout'
import LoggedUser from './components/LoggedUser'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import * as blogService from './services/blogs'
import * as loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [ msg, setMsg ] = useState('')
  const blogFormRef = useRef()

  
  const loggedUser = () => window.localStorage.getItem('loggedBlogAppUser')

  useEffect(() => {
    const initBlogs = async (token)  => {
      blogService.setToken(token)
      const initialBlogs = await blogService.getAll()
      setBlogs(initialBlogs)
    }
    
    if(loggedUser()){
      const currentUser = JSON.parse(loggedUser())
      setUser(currentUser)
      initBlogs(currentUser.token)
    }
  }, [])


  const resetNotification = () => {
    console.log('Notification is resetted!')
    setTimeout(() => {
      setMsg('')
    }, 3000);
  }

  useEffect(resetNotification, [msg])

  const addUser = async ({username, password}) => {
    try{
      const user = await loginService.login({username, password})

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      
      setMsg('Login success!')
      setUser(user)
    } catch(err){
      setMsg('Error logging in: ', err.message)
      console.log('Error in login: \n', err) 
    }
  }

  const loginFormComponent = () => {
    return <Login addUser={addUser}/>
  }

  const addBlog = async ({title, author, url}) => {
    try{
      const blog = await blogService.create({title, author, url})
      setMsg(`A new blog: '${blog.title}', by ${blog.author} added!`)
      setBlogs(blogs.concat(blog))
      blogFormRef.current.toggleVisibility()
    } catch(err){
      setMsg(`Error: ${err.message}`)
      console.log('Error in blog form: ', err)
    }
  }

  const updateBlog = async (changedBlog) => {
    try{
      const updatedBlog = await blogService.update(changedBlog)
      // const currentBlogs = {...blogs}
      // currentBlogs.map(b => (b.id === updatedBlog.id) ? updatedBlog: b)

      // setBlogs(currentBlogs)
      console.log('Like added!')
    } catch (err){
      setMsg(`Error: ${err.message}`)
      
      console.log('Error in liking blog\n: ', err)
    }
  }

  const deleteBlog = async (id) => {
    try{
      const deletedBlogId = await blogService.remove(id)
      const updatedBlogs = blogs.filter(b => b.id !== deletedBlogId)

      setBlogs(updatedBlogs)
      console.log('Blog removed!')

    } catch(err){
      setMsg(`Error: ${err.message}`)
      console.log('Error in removing blog\n: ', err)
    }
  }

  const blogComponent = () => {

    return (
      <div>
        <LoggedUser user={user} />
        <Logout setUser={setUser} />

        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm addBlog={addBlog}/>
        </Togglable>
                  
        {!blogs || blogs.length === 0 
          ? <div>No blogs present</div>
          : <Blogs 
              blogs={blogs} 
              user={user} 
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}/>
        }
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <br/>
      {msg === '' ? null: <Notification msg={msg}/>}
      {user === null ? loginFormComponent(): blogComponent()}
    </div>
  )
}

export default App