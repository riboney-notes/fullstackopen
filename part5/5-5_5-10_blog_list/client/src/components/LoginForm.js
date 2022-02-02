import React, {useState} from 'react'

const LoginForm = ({addUser}) => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
        
    const handleOnSubmit = async (event) => {
        event.preventDefault()
        addUser({username, password})
        setUsername('')
        setPassword('')
    }

    const onChangeUsername = (event) => {
        setUsername(event.target.value)
    }

    const onChangePassword = (event) => {
        setPassword(event.target.value)
    }

    return (
        <form onSubmit={handleOnSubmit}>
            <div>
                Username
                <input 
                    type="text" 
                    value={username} 
                    name="username" 
                    onChange={onChangeUsername}
                />
            </div>
            <div>
                Password
                <input
                    type="password"
                    value={password}
                    name="password"
                    onChange={onChangePassword}
                />
            </div>
            <button type="submit">Login</button>
        </form>
    )
}

export default LoginForm