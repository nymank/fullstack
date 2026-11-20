
import { useState } from "react"

const Blog = ({ blog }) => {
  const [minimized, setMinimized] = useState(true)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}
        <button onClick={() => setMinimized(!minimized)}>
          {minimized ? "view" : "hide"}
        </button>
      </div>

      {!minimized && (
        <div>
          <div>{blog.author}</div>
          <div>{blog.url}</div>
          <div>Likes: {blog.likes} <button>like</button></div>
          {blog.user && blog.user.name && <div>{blog.user.name}</div>}
        </div>
      )}
    </div>
  )
}

export default Blog
