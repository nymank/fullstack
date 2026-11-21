
import { useState } from "react"

const Blog = ({ blog, updateBlog, deleteBlog }) => {
    const [minimized, setMinimized] = useState(true)

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: "solid",
        borderWidth: 1,
        marginBottom: 5,
    }

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
        <div style={blogStyle}>
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
                    {blog.user && blog.user.username === currentUser.username &&
                        <>
                            <div>{blog.user.name}</div>
                            <div><button onClick={onClickRemove}>remove</button></div>
                        </>
                    }
                </div>
            )}
        </div>
    )
}

export default Blog
