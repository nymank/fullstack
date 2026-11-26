
import { useState, useEffect } from "react"
import blogService from "./services/blogService"
import loginService from "./services/loginService"
import "./App.css"
import Notification from "./components/Notification"
import BlogForm from "./components/BlogForm"
import BlogList from "./components/BlogList"
import {
    Routes, Route, Link,
} from "react-router-dom"
import Login from "./components/Logix"
import Blog from "./components/Blog"

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const userLocalStorageKey = "loggedUser"
    const [notificationType, setNotificationType] = useState("error")
    const [notificationMessage, setNotificationMessage] = useState("")

    const fetchBlogs = async () => {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
    }

    useEffect(() => {
        fetchBlogs()
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
            setNotificationMessage("")
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
            console.error(err)
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
            console.error(err)
            setNotificationType("error")
            setNotificationMessage("Deleting blog failed")
        }
    }

    const handleLogin = async () => {
        try {
            const loggedInUser = await loginService.login({
                username,
                password
            })

            setUser(loggedInUser)
            setUsername("")
            setPassword("")
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

    const padding = {
        padding: 5
    }

    return (
        <div>
            <div>
                <Link style={padding} to="/">Home</Link>
                {!user ? (
                    <Link style={padding} to="/login">Log in</Link>
                ) : (
                    <button onClick={logout}>Logout</button>
                )}
                {user && <Link style={padding} to="/create">New blog</Link>}
            </div>

            {notificationMessage && <div style={padding}><Notification message={notificationMessage} type={notificationType}/> </div>}

            <Routes>
                <Route path="/" element={
                    <BlogList
                        blogs={blogs}
                        updateBlog={updateBlog}
                        deleteBlog={deleteBlog}
                    />
                } />

                <Route path="/login" element={
                    !user ?
                        <Login
                            username={username}
                            setUsername={setUsername}
                            password={password}
                            setPassword={setPassword}
                            handleLogin={handleLogin}
                        />
                        :
                        <span>Already logged in</span>
                } />

                {user &&
                    <Route path="/create" element={
                        <BlogForm createBlog={createBlog} />
                    } />}

                {blogs.map(blog => <Route path={`/blogs/${blog.id}`} element={
                    <Blog
                        key={blog.id}
                        blog={blog}
                        updateBlog={updateBlog}
                        deleteBlog={deleteBlog}
                        user={user}
                    />}
                />)}
            </Routes>
        </div>
    )
}

export default App
