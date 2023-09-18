import "../index.css"

const Error = (props) => {
    const message = props.message

    if(!message) return null

    return(
        <div className="error">
            {message}
        </div>
    )
}

export default Error