import "../styles/Blog.css"

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {

    const onClickLikeButton = async () => {
        if (user) {
            await updateBlog({ ...blog, likes: blog.likes + 1 })
        }
    }

    const onClickRemove = () => {
        deleteBlog(blog)
    }

    return (
        <div className="blog">
            <div>
                <h2>{blog.author}: {blog.title}</h2>
                <div>{blog.url}</div>
                <div>Likes: {blog.likes}
                    {user && <button onClick={onClickLikeButton}>like</button>}
                </div>
                {blog.user && <div>Added by {blog.user.name}</div>}
                {blog.user && user && blog.user.username === user.username &&
                        <div>
                            <button name="remove" onClick={onClickRemove}>remove</button>
                        </div>
                }
            </div>
        </div>
    )
}

export default Blog
