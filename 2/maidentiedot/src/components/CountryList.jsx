import CountryTitle from "./CountryTitle"
import KeepTyping from "./KeepTyping"
import CountryProfile from "./CountryProfile"


const CountryList = (props) => {


    const MAX_RENDERED_COUNTRIES = 10
    
    const shownCountries = props.countries

    return (
        <div>
            {
                shownCountries.length <= MAX_RENDERED_COUNTRIES && shownCountries.lenght !== 0 ?
                    shownCountries.length === 1 ?
                        <CountryProfile country={shownCountries[0]} />
                        :
                        shownCountries.map(c => <CountryTitle name={c.name.common} key={c.cca3} cca3={c.cca3} handleShowCountry={props.handleShowCountry} />)
                    :
                    <KeepTyping message="Keep typing to filter results... " />
            }
        </div>
    )
}


export default CountryList