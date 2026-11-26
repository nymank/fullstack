import { Button, Input, Label } from "../styles/StyledComponents"

const LoginForm = ({
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
    username,
    password
}) => {
    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <Label htmlFor="username">username</Label>
                    <Input
                        id="username"
                        name="username"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div>
                    <Label htmlFor="password">password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <Button type="submit">login</Button>
            </form>
        </div>
    )
}

export default LoginForm