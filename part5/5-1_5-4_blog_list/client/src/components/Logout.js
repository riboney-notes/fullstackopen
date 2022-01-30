import React from 'react'
import * as blogService from '../services/blogs'

const Logout = ({
    setUser,
    user,
}) => {

    const handleOnClick = (event) => {
        setUser(null)
        blogService.setToken(null)
        window.localStorage.removeItem('loggedBlogAppUser')
    }

    return (
        <div>
            <p>{user.name} logged-in</p>
            <button onClick={handleOnClick}>Logout</button>
        </div>
    )
}

export default Logout