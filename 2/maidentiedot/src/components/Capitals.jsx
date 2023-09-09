
const Capitals = (props) => {

    const capitals = props.capitals

    if(!capitals) return null

    return (
        <div>
            {
                capitals.length !== 1 ?
                    <div>Capitals: {capitals.map((cap, i) => i < capitals.length-1 ? cap + ", " : cap)}</div>
                    :
                    <div>Capital: {capitals[0]}</div>
            }
        </div>
    )
}

export default Capitals