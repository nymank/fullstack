
import { useState, useEffect } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogService"
import loginService from "./services/loginService"

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [user, setUser] = useState(null)
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const userLocalStorageKey = "loggedUser"

	useEffect(() => {
		blogService.getAll().then(blogs => {
			setBlogs(blogs)
		})
	}, [])

	useEffect(() => {
		const loggedUserJSON = localStorage.getItem(userLocalStorageKey)
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			blogService.setToken(user.token)
		}
	}, [])

	const handleLogin = async (event) => {
		event.preventDefault()
		setErrorMessage("")

		try {
			const loggedInUser = await loginService.login({
				username,
				password
			})
			console.log(loggedInUser)

			setUser(loggedInUser)
			setUsername("")
			setPassword("")
			setErrorMessage("")
			blogService.setToken(loggedInUser.token)
			localStorage.setItem(
				userLocalStorageKey, JSON.stringify(loggedInUser)
			)
		} catch {
			setErrorMessage("Wrong credentials")
			setTimeout(() => {
				setErrorMessage("")
			}, 5000)
		}
	}

	const logout = () => {
		localStorage.setItem(userLocalStorageKey, "")
		setUser(null)
		setErrorMessage("")
	}

	const loginForm = () => (
		<form onSubmit={handleLogin}>
			<div>
				<label>
					Username
					<input
						type="text"
						value={username}
						onChange={({ target }) => setUsername(target.value)}
					/>
				</label>
			</div>
			<div>
				<label>
					Password
					<input
						type="password"
						value={password}
						onChange={({ target }) => setPassword(target.value)}
					/>
				</label>
			</div>
			<button type="submit">Login</button>
		</form>
	)

	return (
		<div>
			{!user && loginForm()}

			{user && (
				<div>
					<p>{user.name} logged in</p>
					<button onClick={logout}>Logout</button>
				</div>
			)}

			{errorMessage && (
				<div style={{ color: "red" }}>
					{errorMessage}
				</div>
			)}

			{user && (
				<>
					<h2>blogs</h2>
					{blogs.map(blog => (
						<Blog key={blog.id} blog={blog} />
					))}
				</>
			)}
		</div>
	)
}

export default App
