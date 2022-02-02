import React from 'react'

const LoggedUser = ({user}) => {
    return (<p>{user.name} currently logged in</p>)
}

export default LoggedUser