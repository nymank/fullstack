import { useNavigate } from "react-router-dom"
import LoginForm from "./LoginForm"
import { Button } from "../styles/StyledComponents"

const Login = ({ username, setUsername, password, setPassword, handleLogin }) => {

    const navigate = useNavigate()

    const onSubmitLogin = async (e) => {
        e.preventDefault()
        await handleLogin()
        navigate("/")
    }

    return (
        <div>
            <LoginForm
                username={username}
                password={password}
                handleUsernameChange={({ target }) => setUsername(target.value)}
                handlePasswordChange={({ target }) => setPassword(target.value)}
                handleSubmit={onSubmitLogin}
            />
        </div>
    )
}

export default Login