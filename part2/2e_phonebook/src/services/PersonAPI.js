import axios from 'axios'

const baseURL = 'http://localhost:3001/persons'
const baseURLID = (id) => baseURL + '/' + id

const getByID = (id) => {
    const request = axios.get(baseURLID(id))
    return request.then(res => res.data)
}

const getAll = () => {
    const request =  axios.get(baseURL)
    return request.then(res => res.data)
}

const create = (person) => {
    const request = axios.post(baseURL, person)
    return request.then(res => res.data)
}

const update = (person) => {
    const request = axios.put(baseURLID(person.id), person)
    return request.then(res => res.data)
}

const remove = (id) => {
    return axios.delete(baseURLID(id))
}

export default {
    getByID,
    getAll,
    create,
    update,
    remove
}