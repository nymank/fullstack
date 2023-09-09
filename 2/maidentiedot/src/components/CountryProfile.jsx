import Capitals from "./Capitals"
import Flag from "./Flag"
import { useEffect } from "react"
import Weather from "./Weather"

const CountryProfile = (props) => {

    const country = props.country



    return (
        <div>
            <h3>{country.name.common}</h3>
            <Capitals capitals={country.capital} />
            <div>Area: {country.area}</div>
            <div>Languages:
                <ul>
                    {Object.entries(country.languages).map((langObjArr) => <li key={langObjArr[0]}>{langObjArr[1]}</li>)
                }
                </ul>
            </div>
            <Flag country={country} />
            <Weather country={country} />
        </div>
    )
}


export default CountryProfile