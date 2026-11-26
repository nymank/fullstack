import { useNavigate } from "react-router-dom"
import "../styles/Blog.css"
import { Button, DangerButton } from "../styles/StyledComponents"

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
    const navigate = useNavigate()

    const onClickLikeButton = async () => {
        if (user) {
            await updateBlog({ ...blog, likes: blog.likes + 1 })
        }
    }

    const onClickRemove = async (e) => {
        e.preventDefault()
        await deleteBlog(blog)
        navigate("/")
    }

    return (
        <div className="blog">
            <div>
                <h2>{blog.author}: {blog.title}</h2>
                <a href={blog.url} target="blank">{blog.url}</a>
                <div>Likes: {blog.likes}
                    {user && <Button onClick={onClickLikeButton}>like</Button>}
                </div>
                {blog.user && <div>Added by {blog.user.name}</div>}
                {blog.user && user && blog.user.username === user.username &&
                        <div>
                            <DangerButton name="remove" onClick={onClickRemove}>remove</DangerButton>
                        </div>
                }
            </div>
        </div>
    )
}

export default Blog
