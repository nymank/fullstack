
const { test, after, beforeEach } = require("node:test")
const mongoose = require("mongoose")
const supertest = require("supertest")
const assert = require("node:assert")
const app = require("../app")
const Blog = require("../db/models/blog")

const api = supertest(app)

const initialBlogs = [
    {
        title: "Test blog 1",
        author: "John Smith",
        url: "https://notarealblog.com/johnsmith",
        likes: 12345,
    },
    {
        title: "Test blog 2",
        author: "Jane Doe",
        url: "https://notarealblog.com/janedoe",
        likes: 123456,
    },
    {
        title: "Test blog 3",
        author: "John Doe",
        url: "https://notarealblog.com/johndoe",
        likes: 1234567,
    },
]

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

test("blogs are returned as json", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/)
})

test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs")

    assert.strictEqual(response.body.length, initialBlogs.length)
})

test("a specific blog is within the returned blogs", async () => {
    const response = await api.get("/api/blogs")

    const titles = response.body.map(blog => blog.title)
    assert.strictEqual(titles.includes(initialBlogs[0].title), true)
})

test("blog identifying field is called 'id'", async () => {
    const response = await api.get("/api/blogs")

    const blogs = response.body

    assert.ok(blogs.every(blog => blog.id !== undefined))
    assert.ok(blogs.every(blog => blog._id === undefined))
})

after(async () => {
    await mongoose.connection.close()
})
