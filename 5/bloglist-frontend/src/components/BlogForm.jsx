import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Input, Label } from "../styles/StyledComponents"

const BlogForm = ({ createBlog }) => {
    const navigate = useNavigate()

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
        navigate("/")
    }

    return (
        <div>
            <h2>Create new</h2>
            <form onSubmit={addBlog}>
                <div>
                    <Label htmlFor="title">Title:</Label>
                    <Input
                        id="title"
                        required
                        name="title"
                        value={newBlog.title}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Label htmlFor="author">Author:</Label>
                    <Input
                        id="author"
                        required
                        name="author"
                        value={newBlog.author}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Label htmlFor="url">URL:</Label>
                    <Input
                        id="url"
                        required
                        name="url"
                        value={newBlog.url}
                        onChange={handleChange}
                    />
                </div>
                <Button type="submit">Save</Button>
            </form>
        </div>
    )
}

export default BlogForm