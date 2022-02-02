import axios from 'axios'
const baseURL = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAuthHeaders = () => { return {headers: {Authorization: token}}}

const getAll = async () => {
  try{
    const res = await axios.get(baseURL, getAuthHeaders())
    return res.data
  } catch(err){
    console.log('Error in fetching blogs: \n', err)
    return null
  }
}

const create = async request => {
  try{
    const res = await axios.post(baseURL, request, getAuthHeaders())
    return res.data
  } catch(err){
    console.log('Error creating new blog: \n', err)
    return null
  }
}

const update = async request => {
  const route = baseURL + '/' + request.id
  try{
    const res = await axios.put(route, request, getAuthHeaders())
    return res.data
  } catch(err){
    console.log('Error updating blog!\n', err)
    return null
  }
}

const remove = async id => {
  const route = baseURL + '/' + id
  try{
    console.log('route of deleted blog: ', route)
    await axios.delete(route, getAuthHeaders())
    return id
  } catch(err){
    console.log('Error deleting blog\n', err)
    return null
  }
}

export { 
  getAll,
  create,
  setToken,
  update,
  remove
}