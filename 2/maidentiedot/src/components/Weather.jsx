import { useState, useEffect } from "react"
import countryService from "../services/countryService"


const Weather = (props) => {

    const country = props.country

    const [temp, setTemp] = useState(null)
    const [windSpeed, setWindSpeed] = useState(null)
    const [isFetching, setIsFetching] = useState(true)
    const [iconCode, setIconCode] = useState(null)



    const getCapitalWeather = () => {
        console.log(country)
        countryService.getWeather(country.capitalInfo["latlng"][0], country.capitalInfo["latlng"][1], process.env.REACT_APP_WEATHER_API_KEY)
            .then(weatherData => updateWeather(weatherData.current))
            .catch(err => console.error(err))
    }

    useEffect(getCapitalWeather, [])

    const updateWeather = (currWeatherData) => {
        setTemp(currWeatherData.temp)
        setWindSpeed(currWeatherData.wind_speed)
        setIsFetching(false)
        console.log(currWeatherData)
        setIconCode(convertIconCode(currWeatherData.weather[0].description, currWeatherData.dt < currWeatherData.sunset))
    }

    const convertIconCode = (description, isDay ) => {
        const nORd = isDay ? "d": "n"
        console.log("nord", nORd)
        console.log("description", description)
        switch(description) {
            case "clear sky": return `01${nORd}`
            case "few clouds": return `02${nORd}`
            case "scattered clouds": return `03${nORd}`
            case "broken clouds": return `04${nORd}`
            case "shower rain": return `09${nORd}`
            case "rain": return `10${nORd}`
            case "thunderstorm": return `11${nORd}`
            case "snow": return `13${nORd}`
            case "mist": return `50${nORd}`
        }
    }

    if (isFetching) return <p>Fetching weather data...</p>

    return (
        <div>
            {country.capital.length > 1 ?
                <h3>Weather in the capital</h3>
                :
                <h3>Weather in {country.capital}</h3>
            }
            <img src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}></img>
            <p>Temperature {temp} degrees</p>
            <p>Windspeed {windSpeed} m/s</p>
        </div>
    )
}

export default Weather