import axios from 'axios'

const BASE_SERVER_URL = "http://localhost:3001"

const getAllPersons = () => {
    const URL = `${BASE_SERVER_URL}/persons`
    return axios.get(URL)
        .then(res => res.data)
        .catch(err => console.error(err))
}

const addPerson = (person) => {
    const URL = `${BASE_SERVER_URL}/persons`
    return axios.post(URL, person)
        .then(res => res.data)
        .catch(err => console.error(err))
}

const deletePerson = (id) => {
    const URL = `${BASE_SERVER_URL}/persons/${id}`
    return axios.delete(URL)
        .then(res => res.data)
        .catch(err => console.error(err))
}

const updatePerson = (newPerson) => {
    const URL = `${BASE_SERVER_URL}/persons/${newPerson.id}`
    return axios.put(URL, newPerson)
        .then(res => res.data)
        .catch(err => console.error(err))
}

export default { addPerson, getAllPersons, deletePerson, updatePerson }