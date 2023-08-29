// 2.3

const Total = (props) => {
    console.log("props", props)
    const initialValue = 0
    const sum = props.parts.reduce( (sum, part) => sum + part.exercises, initialValue)
    return (
        <strong>Total number of exercises {sum}</strong>
    )
}

export default Total