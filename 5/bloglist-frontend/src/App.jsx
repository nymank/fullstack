
import { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogService"
import loginService from "./services/loginService"
import "./App.css"
import Notification from "./components/Notification"
import LoginForm from "./components/LoginForm"
import Togglable from "./components/Togglable"
import BlogForm from "./components/BlogForm"

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [user, setUser] = useState(null)
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const userLocalStorageKey = "loggedUser"
	const blogFormRef = useRef()
	const [notificationType, setNotificationType] = useState("error")
	const [notificationMessage, setNotificationMessage] = useState("")
	const [loginVisible, setLoginVisible] = useState(false)
	const hideStyleLogin = { display: loginVisible ? "none" : "" }
	const visibleStyleLogin = { display: loginVisible ? "" : "none" }

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

	const updateBlog = async (blog) => {
		try {
			setBlogs(prevBlogs =>
				prevBlogs.map(b => b.id === blog.id ? blog : b)
			)
			await blogService.update(blog.id, blog)
		} catch (err) {
			console.error(err)
		}
	}

	const createBlog = async (blog) => {
		try {
			blogFormRef.current.toggleVisibility()
			const createdBlog = await blogService.create(blog)

			setBlogs(blogs.concat(createdBlog))

			setNotificationType("success")
			setNotificationMessage(
				`A new blog ${blog.title} by ${blog.author} added`
			)

			setTimeout(() => {
				setNotificationMessage("")
			}, 5000)
		} catch (err) {
			setNotificationType("error")
			setNotificationMessage("Creating blog failed")
			setTimeout(() => {
				setNotificationMessage("")
			}, 5000)
		}
	}

	const deleteBlog = async (blog) => {
		try {
			setNotificationMessage("")
			const confirmation = window.confirm(`Are you sure you want to delete '${blog.title}' by ${blog.author}`)
			if (confirmation) {
				await blogService.deleteOne(blog.id)
				setBlogs(blogs.filter(b => b.id !== blog.id))
				setNotificationType("success")
				setNotificationMessage("Blog deleted")
			}
		} catch (err) {
			setNotificationType("error")
			setNotificationMessage("Deleting blog failed")
		}
	}

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


	return (
		<div>
			<div>
				<div style={hideStyleLogin}>
					<button onClick={() => setLoginVisible(true)}>Log in</button>
				</div>
				<div style={visibleStyleLogin}>
					<LoginForm
						username={username}
						password={password}
						handleUsernameChange={({ target }) => setUsername(target.value)}
						handlePasswordChange={({ target }) => setPassword(target.value)}
						handleSubmit={handleLogin}
					/>
					<button onClick={() => setLoginVisible(false)}>Cancel</button>
				</div>
			</div>

			{user && (
				<div>
					<p>{user.name} logged in</p>
					<button onClick={logout}>Logout</button>
				</div>
			)}

			{notificationMessage && (
				<Notification
					message={notificationMessage}
					type={notificationType}
				/>
			)}

			{user && (
				<>
					<Togglable buttonLabel="New blog" ref={blogFormRef}>
						<BlogForm createBlog={createBlog} />
					</Togglable>
					<h2>Blogs</h2>
					{blogs.sort((a, b) => b.likes > a.likes).map(blog => (
						<Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} />
					))}
				</>
			)}
		</div>
	)
}

export default App
