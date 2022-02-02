import axios from 'axios'
const baseURL = '/api/login'

const login = async credentials => {
    try {
        const res = await axios.post(baseURL, credentials)
        return res.data
    } catch(err){
        console.log('Error logging in:\n', err)
    }
}

export { login }