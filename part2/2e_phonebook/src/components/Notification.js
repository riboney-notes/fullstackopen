import React from 'react'
import '../styles/notification.css'

const Notification = ({msg, style}) => {
    if(!msg) return null
    else return <div className={style}>{msg}</div>
}

export default Notification