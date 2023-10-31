import axios from 'axios'

const BASE_SERVER_URL = "/api"

const getAllPersons = () => {
    const URL = `${BASE_SERVER_URL}/persons`
    return axios.get(URL)
        .then(res => res.data)
        .catch(err => err.response)
}

const addPerson = (person) => {
    const URL = `${BASE_SERVER_URL}/persons`
    return axios.post(URL, person)
        .then(res => res.data)
        .catch(err => err.response)
}

const deletePerson = (id) => {
    const URL = `${BASE_SERVER_URL}/persons/${id}`
    return axios.delete(URL)
        .then(res => res)
        .catch(err => err.response)
}

const updatePerson = (newPerson) => {
    const URL = `${BASE_SERVER_URL}/persons/${newPerson.id}`
    return axios.put(URL, newPerson)
        .then(res => res.data)
        .catch(err => err.response)
}

export default { addPerson, getAllPersons, deletePerson, updatePerson }