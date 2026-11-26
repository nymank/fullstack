import { render, screen } from "@testing-library/react"
import Blog from "./Blog"
import BlogForm from "./BlogForm"
import { BrowserRouter } from "react-router-dom"
import userEvent from "@testing-library/user-event"


const user1 = {
    name: "Joe Tester",
    username: "joetester",
}

const user2 = {
    name: "Janine Tester",
    username: "janinetester",
}

const blog = {
    "title": "Joe's blog",
    "url": "https://joesblog.com",
    "author": "Joe Tester",
    "likes": 19,
    "user": user1,
    "id": "6b00c627bbf58850cdeab097"
}

const wrappedBlog = (blog, mockDelete, mockUpdate, user) => (
    <BrowserRouter>
        <Blog blog={blog} deleteBlog={mockDelete} updateBlog={mockUpdate} user={user} />
    </BrowserRouter>
)

const wrappedBlogForm = (mockCreate) => (
    <BrowserRouter>
        <BlogForm createBlog={mockCreate} />
    </BrowserRouter>
)

test("Unauthenticated user blog view", async () => {
    const mockDelete = vi.fn()
    const mockUpdate = vi.fn()

    render(wrappedBlog(blog, mockDelete, mockUpdate, null))

    const titleAndAuthor = screen.getByText(`${blog.author}: ${blog.title}`)
    expect(titleAndAuthor).toBeDefined()
    const url = screen.getByText(blog.url)
    expect(url).toBeDefined()
    const likes = screen.getByText(`Likes: ${blog.likes}`)
    expect(likes).toBeDefined()
    const usersName = screen.getByText(`Added by ${blog.user.name}`)
    expect(usersName).toBeDefined()

    const likeButton = screen.queryByRole("button", { name: "like" })
    expect(likeButton).not.toBeInTheDocument()

    const removeButton = screen.queryByRole("button", { name: "remove" })
    expect(removeButton).not.toBeInTheDocument()
})

test("Authenticated user's own blog view", async () => {
    const mockDelete = vi.fn()
    const mockUpdate = vi.fn()

    render(wrappedBlog(blog, mockDelete, mockUpdate, user1))

    const titleAndAuthor = screen.getByText(`${blog.author}: ${blog.title}`)
    expect(titleAndAuthor).toBeDefined()
    const url = screen.getByText(blog.url)
    expect(url).toBeDefined()
    const likes = screen.getByText(`Likes: ${blog.likes}`)
    expect(likes).toBeDefined()
    const usersName = screen.getByText(`Added by ${blog.user.name}`)
    expect(usersName).toBeDefined()

    const likeButton = screen.queryByRole("button", { name: "like" })
    expect(likeButton).toBeInTheDocument()

    const removeButton = screen.queryByRole("button", { name: "remove" })
    expect(removeButton).toBeInTheDocument()
})

test("Other user's blog view", async () => {
    const mockDelete = vi.fn()
    const mockUpdate = vi.fn()
    render(wrappedBlog(blog, mockDelete, mockUpdate, user2))

    const likeButton = screen.queryByRole("button", { name: "like" })
    expect(likeButton).toBeInTheDocument()

    const removeButton = screen.queryByRole("button", { name: "remove" })
    expect(removeButton).not.toBeInTheDocument()
})

test("User can like their own blog", async () => {
    const mockDelete = vi.fn()
    const mockUpdate = vi.fn()
    render(wrappedBlog(blog, mockDelete, mockUpdate, user1))

    const user = userEvent.setup()
    const likeButton = screen.getByText("like")
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockUpdate.mock.calls).toHaveLength(2)
})

test("User can like other user's blog", async () => {
    const mockDelete = vi.fn()
    const mockUpdate = vi.fn()
    render(wrappedBlog(blog, mockDelete, mockUpdate, user2))

    const user = userEvent.setup()
    const likeButton = screen.getByText("like")
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockUpdate.mock.calls).toHaveLength(2)
})

test("Creating blog", async () => {
    const mockCreate = vi.fn()
    render(wrappedBlogForm(mockCreate))
    const user = userEvent.setup()

    const titleInput = screen.getAllByRole("textbox")[0]
    const authorInput = screen.getAllByRole("textbox")[1]
    const urlInput = screen.getAllByRole("textbox")[2]
    await user.type(titleInput, "Blog title")
    await user.type(authorInput, "Author Author")
    await user.type(urlInput, "randomurl.com")

    const saveButton = screen.getByText("Save")
    await user.click(saveButton)
    expect(mockCreate.mock.calls).toHaveLength(1)
})