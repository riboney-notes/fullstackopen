import React from 'react'
import Blog from './Blog'

const Blogs = ({
    blogs,
    user, 
    updateBlog,
    deleteBlog
}) => {    

    return (
        <div>
            {blogs
            .sort((curBlog, nextBlog) => nextBlog.likes - curBlog.likes)
            .map(blog =>
                <Blog 
                    key={blog.id} 
                    currentBlog={blog} 
                    user={user}
                    updateBlog = {updateBlog}
                    deleteBlog = {deleteBlog}
                />
            )}
        </div>
    )
}

export default Blogs