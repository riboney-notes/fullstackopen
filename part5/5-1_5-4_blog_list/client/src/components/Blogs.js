import React from 'react'
import Blog from './Blog'

const Blogs = ({blogs}) => {
    if(!blogs || blogs.length === 0)
        return (
        <div>
            No blogs present
        </div>)
    else return (
        <div>
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
            )}
        </div>
    )
}

export default Blogs