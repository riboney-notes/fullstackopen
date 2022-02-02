import React from 'react'
import * as blogService from '../services/blogs'

const Logout = ({setUser}) => {

    const handleOnClick = (event) => {
        setUser(null)
        blogService.setToken(null)
        window.localStorage.removeItem('loggedBlogAppUser')
    }

    return (
        <div>
            <button onClick={handleOnClick}>Logout</button>
        </div>
    )
}

export default Logout