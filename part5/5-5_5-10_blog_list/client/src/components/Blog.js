import React, {useState} from 'react'
import Togglable from './Togglable'

const Blog = ({
  currentBlog,
  user,
  updateBlog,
  deleteBlog
}) => {

  const [blog, setBlog] = useState(currentBlog)
  
  const handleOnClickLike = (event) => {
    const updatedBlog = {...blog}
    updatedBlog.likes++
    updateBlog(updatedBlog)
    setBlog(updatedBlog)
  }

  const handleOnClickDelete = event => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
      deleteBlog(blog.id)
  }

  const blogDetails = () => {
      return (
        <Togglable buttonLabel="view" buttonLabelVisible="hide">
          <br/>
          {blog.url}
          <br/>
          likes: {blog.likes}
          <button onClick={handleOnClickLike}>like</button>
          <br/>
          {user.name}
          <br/>
          <button onClick={handleOnClickDelete}>remove</button>
          <br/>
        </Togglable>
      )
  }

  return (
    <div style={{border: "1px solid black", paddingTop:"1em"}}>
      {blog.title} {blog.author} 
      {blogDetails()}
    </div>  
  )
}

export default Blog