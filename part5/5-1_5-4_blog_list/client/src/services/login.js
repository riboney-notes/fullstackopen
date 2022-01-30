import axios from 'axios'
const baseURL = '/api/login'

const login = async credentials => {
    try {
        const res = await axios.post(baseURL, credentials)
        return res.data
    } catch(err){
        console.log('error message:', err.msg)
        console.log('The error object\n', err)
    }
}

export { login }