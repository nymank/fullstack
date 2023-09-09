import axios from 'axios'

const COUNTRY_API_BASE_URL = "https://studies.cs.helsinki.fi/restcountries/api"
const WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/3.0/onecall"

const getAllCountries = () => {
    const URL = `${COUNTRY_API_BASE_URL}/all`
    return axios.get(URL)
        .then(res => res.data)
        .catch(err => err)
}

const getWeather = (lat, lon, weatherAPIkey) => {

    const URL = `${WEATHER_API_BASE_URL}?lat=${lat}&lon=${lon}&exclude=hourly,daily,minutely,alerts&appid=${weatherAPIkey}&units=metric`
    return axios.get(URL)
        .then(res => res.data)
        .catch(err => err.response)
}

export default { getAllCountries, getWeather }