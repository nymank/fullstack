import { useState } from "react"

const BlogForm = ({ createBlog }) => {
    const newBlogDefault = {
        title: "",
        author: "",
        url: ""
    }
    const [newBlog, setNewBlog] = useState(newBlogDefault)

    const handleChange = (event) => {
        const { name, value } = event.target

        setNewBlog(prevBlog => ({
            ...prevBlog,
            [name]: value
        }))
    }

    const addBlog = async (event) => {
        event.preventDefault()
        await createBlog(newBlog)

        setNewBlog(newBlogDefault)
    }


    return (
        <div>
            <h2>Create new</h2>
            <form onSubmit={addBlog}>
                <div>
                    <label>
                        Title:
                        <input
                            required
                            name="title"
                            value={newBlog.title}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Author:
                        <input
                            required
                            name="author"
                            value={newBlog.author}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        URL:
                        <input
                            required
                            name="url"
                            value={newBlog.url}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    )
}

export default BlogForm
