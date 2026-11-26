import { useEffect, useState } from "react"
import { NotificationBox } from "../styles/StyledComponents"

const Notification = ({ message, type = "error", durationMs = 5000 }) => {
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        if (!message) return

        setVisible(true)

        const timeout = setTimeout(() => {
            setVisible(false)
        }, durationMs)

        return () => clearTimeout(timeout)
    }, [message, durationMs])

    if (!message || !visible) return null

    return (
        <NotificationBox $type={type} role="alert">
            {message}
        </NotificationBox>
    )
}

export default Notification