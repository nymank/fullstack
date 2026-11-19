
import { useState, useEffect } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogService"
import loginService from "./services/loginService"
import "./App.css"
import Notification from "./components/Notification"

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [user, setUser] = useState(null)
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const userLocalStorageKey = "loggedUser"
	const [title, setTitle] = useState("")
	const [author, setAuthor] = useState("")
	const [url, setUrl] = useState("")
	const [notificationType, setNotificationType] = useState("error")
	const [notificationMessage, setNotificationMessage] = useState("")

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

		try {
			const loggedInUser = await loginService.login({
				username,
				password
			})
			console.log(loggedInUser)

			setUser(loggedInUser)
			setUsername("")
			setPassword("")
			setNotificationMessage("")
			blogService.setToken(loggedInUser.token)
			localStorage.setItem(
				userLocalStorageKey, JSON.stringify(loggedInUser)
			)
		} catch {
			setNotificationType("error")
			setNotificationMessage("Wrong credentials")
			setTimeout(() => {
				setNotificationMessage("")
			}, 5000)
		}
	}

	const logout = () => {
		localStorage.setItem(userLocalStorageKey, "")
		setUser(null)
		setNotificationMessage("")
	}

	const addBlog = async (event) => {
		event.preventDefault()

		try {
			const newBlog = { title, author, url }
			const createdBlog = await blogService.create(newBlog)

			setBlogs(blogs.concat(createdBlog))

			setTitle("")
			setAuthor("")
			setUrl("")

			setNotificationType("success")
			setNotificationMessage(`A new blog ${title} by ${author} added`)

			setTimeout(() => {
				setNotificationMessage("")
			}, 5000)
		} catch (err) {
			setNotificationType("error")
			setNotificationMessage("Creating blog failed")
		}
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

	const blogForm = () => (
		<div>
			<h2>Create new</h2>
			<form onSubmit={addBlog}>
				<div><label>Title:<input required value={title} onChange={({ target }) => setTitle(target.value)} /></label></div>
				<div><label>Author:<input required value={author} onChange={({ target }) => setAuthor(target.value)} /></label></div>
				<div><label>URL:<input required value={url} onChange={({ target }) => setUrl(target.value)} /></label></div>				<button type="submit">Save</button>
			</form>
		</div>
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

			{notificationMessage && (<Notification message={notificationMessage} type={notificationType} />)}

			{user && (
				<>
					{blogForm()}
					<h2>Blogs</h2>
					{blogs.map(blog => (
						<Blog key={blog.id} blog={blog} />
					))}
				</>
			)}
		</div>
	)
}

export default App
