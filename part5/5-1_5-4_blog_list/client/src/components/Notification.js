import React from 'react'

const Notification = ({msg}) => {
    if(!msg) {
        console.log('login fail!')
        return null
    }
    else {
        console.log('login success!')
        return (<div>{msg}</div>)
    }
}

export default Notification