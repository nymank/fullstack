
const Flag = (props) => {
    
    const country = props.country

    if (!country) return null

    return (
        <div>
            <h4>Flag</h4>
            <img src={country.flags.png} alt={`could not get flag of ${country.name.common}`}></img>
        </div>
    )
}


export default Flag