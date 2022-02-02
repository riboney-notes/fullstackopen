import React, {useState} from 'react'

const BlogForm = ({addBlog}) => {

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setURL] = useState('')
 
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
        addBlog({title, author, url})
        setTitle('')
        setAuthor('')
        setURL('')
    }

    return (
        <form onSubmit={handleOnSubmit}>
            <div>
                <label htmlFor="title">Title: </label>
                <input type="text" onChange={handleTitleOnChange} value={title}/>
                <br/>
                <label htmlFor="author">Author: </label>
                <input type="text" onChange={handleAuthorOnChange} value={author}/>
                <br/>
                <label htmlFor="url">URL: </label>
                <input type="text" onChange={handleURLOnChange} value={url}/>
                <br/>
            </div>
            <button type="submit">Add Blog</button>
        </form>
    )
}

export default BlogForm