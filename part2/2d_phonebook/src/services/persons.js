import axios from 'axios'

const baseURL = 'http://localhost:3001/persons'

const getAll = () => {
    const request =  axios.get(baseURL)
    return request.then(res => res.data)
}

const create = (person) => {
    const request = axios.post(baseURL, person)
    return request.then(res => res.data)
}

const update = (person) => {
    const request = axios.put(baseURL+'/'+person.id, person)
    return request.then(res => res.data)
}

const remove = (id) => {
    return axios.delete(baseURL+'/'+id)
}

export default {
    getAll,
    create,
    update,
    remove
}