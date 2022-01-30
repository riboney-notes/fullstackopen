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
    console.log(err.msg)
    return null
  }
}

const createBlog = async request => {
  const config = {
    headers: {Authorization: token}
  }

  const res = await axios.post(baseURL, request, config)
  return res.data
}

export { getAll, createBlog, setToken }