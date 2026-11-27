import { Link } from "react-router-dom"
import { Button, Navigation, NavigationSubContainer } from "../styles/StyledComponents"


const NavigationBar = ({ user, logout }) => {
    const padding = { padding: 5 }
    return (
        <Navigation>
            <NavigationSubContainer>
                <Link style={padding} to="/">Home</Link>
                {user && <Link style={padding} to="/create">New blog</Link>}
            </NavigationSubContainer>
            <NavigationSubContainer>
                {!user ? (
                    <Link style={padding} to="/login">Log in</Link>
                ) : (
                    <>Logged in as: {user.username} <Button onClick={logout}>Logout</Button></>
                )}
            </NavigationSubContainer>
        </Navigation>
    )
}

export default NavigationBar