import "../index.css"

const Notification = (props) => {
    const message = props.message

    if(!message) return null

    return(
        <div className="successNotification">
            {message}
        </div>
    )
}

export default Notification