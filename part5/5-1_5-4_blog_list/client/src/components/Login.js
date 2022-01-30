import React from 'react'
import {login} from '../services/login'
import * as blogService from '../services/blogs'

const Login = (
    {
        username,
        password,
        setUsername,
        setPassword,
        setUser,
        setMsg
    }) => {
        
    const handleOnSubmit = async (event) => {
        event.preventDefault()
        console.log("Logging In!")
        console.log('Username:', username)
        console.log('Password:', password)

        try{
            const user = await login({
                username,
                password
            })
            console.log('logged in user: ', user)
            window.localStorage.setItem(
                'loggedBlogAppUser', JSON.stringify(user)
            )
            blogService.setToken(user.token)
            setMsg('Login success!')
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (err){
            setMsg(err.message) 
        }
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

export default Login