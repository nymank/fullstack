

const CountryTitle = (props) => {
    return (
        <div>
            <p>{props.name}</p> <button onClick={() => props.handleShowCountry(props.cca3)}>show</button>
        </div>
    )
}

export default CountryTitle