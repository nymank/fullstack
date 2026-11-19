import { useEffect, useState } from "react"

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
        <div className={`notification ${type}`}>
            {message}
        </div>
    )
}

export default Notification