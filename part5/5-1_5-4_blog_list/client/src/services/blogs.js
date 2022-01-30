import axios from 'axios'
const baseURL = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const config = {
    headers: {Authorization: token}
  }

  try{
    const res = await axios.get(baseURL, config)
    return res.data
  } catch(err){
    console.log('error message: ', err.msg)
    console.log(err)
    return null
  }
}

const create = async request => {
  const config = {
    headers: {Authorization: token}
  }

  const res = await axios.post(baseURL, request, config)
  return res.data
}

export { getAll, create, setToken }