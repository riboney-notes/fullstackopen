import React from 'react'
import {createBlog} from '../services/blogs'

const BlogForm = ({
    setTitle,
    title,
    setAuthor,
    author,
    setURL,
    url,
    setMsg
}) => {
 
    const handleTitleOnChange = (event) => {
        setTitle(event.target.value)
    }

    const handleAuthorOnChange = (event) => {
        setAuthor(event.target.value)
    }

    const handleURLOnChange = (event) => {
        setURL(event.target.value)
    }

    const handleOnSubmit = async (event) => {
        event.preventDefault()
        console.log('Title:', title)
        console.log('Author:', author)
        console.log('URL:', url)

        try{
            const blog = await createBlog({title, author, url})
            setMsg('Blog successfully created!')
            setTitle('')
            setAuthor('')
            setURL('')
            console.log('The created blog:', blog)
            setMsg(`a new blog '${blog.title}' by ${blog.author} added`)
        } catch (err){
            console.log('Error creating blog')
            setMsg(err.message)
        }
    }

    return (
        <form onSubmit={handleOnSubmit}>
            <div>
                <label for="title">Title: </label>
                <input type="text" onChange={handleTitleOnChange} value={title}/>
                <br/>
                <label for="author">Author: </label>
                <input type="text" onChange={handleAuthorOnChange} value={author}/>
                <br/>
                <label for="url">URL: </label>
                <input type="text" onChange={handleURLOnChange} value={url}/>
                <br/>
            </div>
            <button type="submit">Add Blog</button>
        </form>
    )
}

export default BlogForm