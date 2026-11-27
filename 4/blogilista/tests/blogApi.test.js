
const { test, after, beforeEach } = require("node:test")
const mongoose = require("mongoose")
const supertest = require("supertest")
const assert = require("node:assert")
const app = require("../app")
const Blog = require("../db/models/blog")
const User = require("../db/models/user")
const { TEST_USER } = require("../utils/config")

const api = supertest(app)


const initialBlogs = [
    {
        title: "John's blog",
        author: "John Doe",
        url: "https://notarealblog.com/johndoe",
        likes: 1234,
    },
    {
        title: "Jane's blog",
        author: "Jane Doe",
        url: "https://notarealblog.com/janedoe",
        likes: 12345,
    },
]

let token

const resetDbInitialState = async () => {
    const users = await User.find({})

    await Blog.deleteMany({})

    const blogs = initialBlogs.map(blog => ({
        ...blog,
        user: users.find(user => user.name === blog.author).id,
    }))

    await Blog.insertMany(blogs)
}

const login = async (username, password) => {
    const loginResponse = await api
        .post("/api/login")
        .send({
            username: username,
            password: password,
        })
        .expect(200)

    token = loginResponse.body.token
    assert.ok(token)
}


beforeEach(async () => {
    await resetDbInitialState()
    await login(TEST_USER.username, TEST_USER.password)
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

test("a new blog can be added", async () => {
    const postBlog = {
        title: "Test blog 4",
        author: "John Miller",
        url: "https://notarealblog.com/johnmiller",
        likes: 1,
    }

    const postRes = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(postBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)

    const getBlogsRes = await api.get("/api/blogs")
    const blogs = getBlogsRes.body
    assert.strictEqual(blogs.length, initialBlogs.length + 1)

    const addedBlog = blogs.find(blog => blog.id === postRes.body.id)

    assert.ok(addedBlog)
    assert.strictEqual(addedBlog.title, postBlog.title)
    assert.strictEqual(addedBlog.author, postBlog.author)
    assert.strictEqual(addedBlog.url, postBlog.url)
    assert.strictEqual(addedBlog.likes, postBlog.likes)
})

test("if 'likes' is undefined when POSTing, it's set to 0", async () => {
    const postBlog = {
        title: "Test blog 4",
        author: "John Miller",
        url: "https://notarealblog.com/johnmiller",
    }

    const postRes = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(postBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)

    const getBlogsRes = await api.get("/api/blogs")
    const blogs = getBlogsRes.body
    const addedBlog = blogs.find(blog => blog.id === postRes.body.id)

    assert.ok(addedBlog)
    assert.strictEqual(addedBlog.likes, 0)
})

test("POST fails if required fields are not present", async () => {
    const postBlog = {
        author: "John Miller",
        likes: 10,
    }

    await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(postBlog)
        .expect(400)

    const response = await api.get("/api/blogs")

    assert.strictEqual(response.body.length, initialBlogs.length)
})

test("POST fails if authentication token is missing", async () => {
    const postBlog = {
        title: "Test blog 4",
        author: "John Miller",
        url: "https://notarealblog.com/johnmiller",
        likes: 1,
    }

    await api
        .post("/api/blogs")
        .send(postBlog)
        .expect(401)

    const response = await api.get("/api/blogs")

    assert.strictEqual(response.body.length, initialBlogs.length)
})

test("a blog can be deleted", async () => {
    const getBlogsRes = await api.get("/api/blogs")
    const blogs = getBlogsRes.body

    await api
        .delete(`/api/blogs/${blogs[0].id}`)
        .expect(204)

    const getBlogsRes2 = await api.get("/api/blogs")
    const blogs2 = getBlogsRes2.body

    assert.strictEqual(blogs2.length, initialBlogs.length - 1)
    assert.ok(blogs2.every(blog => blog.id !== blogs[0].id))
})

test("delete fails if id is in the wrong format", async () => {
    const getBlogsRes = await api.get("/api/blogs")
    const blogs = getBlogsRes.body

    await api
        .delete(`/api/blogs/${blogs[0].id}X`)
        .expect(400)
})

test("delete returns status 204 on deleting nonexistent resource", async () => {
    const getBlogsRes = await api.get("/api/blogs")
    const blogs = getBlogsRes.body

    await api
        .delete(`/api/blogs/${blogs[0].id}`)
        .expect(204)

    await api
        .delete(`/api/blogs/${blogs[0].id}`)
        .expect(204)
})

after(async () => {
    await resetDbInitialState()
    await mongoose.connection.close()
})
