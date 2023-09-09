import axios from 'axios'

const BASE_API_URL = "https://studies.cs.helsinki.fi/restcountries/api"

const getAllCountries = () => {
    const URL = `${BASE_API_URL}/all`
    return axios.get(URL)
        .then(res => res.data)
        .catch(err => err)
}




export default { getAllCountries }