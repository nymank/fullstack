import { render, screen } from "@testing-library/react"
import Blog from "./Blog"
import BlogForm from "./BlogForm"
import userEvent from "@testing-library/user-event"

const blog = {
    "title": "How I wrote every Metallica song",
    "url": "https://megadeth.com",
    "author": "Dave Mustaine",
    "likes": 19,
    "user": {
        "username": "Calemakar8",
        "name": "Cale Makar",
        "id": "6afb48fd97ca67921915c9bf"
    },
    "id": "6b00c627bbf58850cdeab097"
}

test("Renders minimized version", async () => {
    const mockDelete = vi.fn()
    const mockUpdate = vi.fn()
    render(<Blog blog={blog} deleteBlog={mockDelete} updateBlog={mockUpdate} />)

    const titleAndAuthor = screen.getByText(`${blog.title} ${blog.author}`)
    expect(titleAndAuthor).toBeDefined()
    const url = screen.queryByText(blog.url)
    expect(url).toBeNull()
    const likes = screen.queryByText("likes:")
    expect(likes).toBeNull()
})

test("Renders maximized version", async () => {
    const mockDelete = vi.fn()
    const mockUpdate = vi.fn()
    render(<Blog blog={blog} deleteBlog={mockDelete} updateBlog={mockUpdate} />)

    const user = userEvent.setup()
    const button = screen.getByText("view")
    await user.click(button)

    const titleAndAuthor = screen.getByText(`${blog.title} ${blog.author}`)
    expect(titleAndAuthor).toBeDefined()
    const url = screen.getByText(blog.url)
    expect(url).toBeDefined()
    const likes = screen.getByText(`Likes: ${blog.likes}`)
    expect(likes).toBeDefined()
    const usersName = screen.getByText(blog.user.name)
    expect(usersName).toBeDefined()
})

test("Like button", async () => {
    const mockDelete = vi.fn()
    const mockUpdate = vi.fn()
    render(<Blog blog={blog} deleteBlog={mockDelete} updateBlog={mockUpdate} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText("view")
    await user.click(viewButton)

    const likeButton = screen.getByText("like")
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockUpdate.mock.calls).toHaveLength(2)
})

test("Creating blog", async () => {
    const mockCreate = vi.fn()
    render(<BlogForm createBlog={mockCreate} />)
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