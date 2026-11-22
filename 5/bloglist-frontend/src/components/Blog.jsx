
import { useState } from "react"
import "../styles/Blog.css"

const Blog = ({ blog, updateBlog, deleteBlog }) => {
    const [minimized, setMinimized] = useState(true)

    const onClickLikeButton = () => {
        updateBlog({ ...blog, likes: blog.likes + 1 })
    }

    const onClickRemove = () => {
        deleteBlog(blog)
    }
    console.log(blog.user)
    console.log(localStorage.getItem("loggedUser"))
    const currentUser = JSON.parse(localStorage.getItem("loggedUser"))
    return (
        <div className="blog">
            <div>
                {`${blog.title} ${blog.author}`}
                <button onClick={() => setMinimized(!minimized)}>
                    {minimized ? "view" : "hide"}
                </button>
            </div>

            {!minimized && (
                <div>
                    <div>{blog.author}</div>
                    <div>{blog.url}</div>
                    <div>Likes: {blog.likes} <button onClick={onClickLikeButton}>like</button></div>
                    {blog.user && <div>{blog.user.name}</div>}
                    {blog.user && blog.user.username === currentUser.username &&
                        <div>
                            <button name="remove" onClick={onClickRemove}>remove</button>
                        </div>
                    }
                </div>
            )}
        </div>
    )
}

export default Blog
