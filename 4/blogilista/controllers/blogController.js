const Blog = require("../db/models/blog")
const User = require("../db/models/user")

const blogRouter = require("express").Router()

blogRouter.get("/", async (request, response, next) => {
	const blogs = await Blog.find({}).populate("user", { blogs: 0 })
	response.json(blogs)
})

blogRouter.post("/", async (request, response, next) => {
	try {
		const users = await User.find({})
		const user = users[0]

		const blog = new Blog({
			...request.body,
			user: user._id,
		})

		const savedBlog = await blog.save()

		user.blogs.push(savedBlog._id)
		await user.save()

		response.status(201).json(savedBlog)
	} catch (err) {
		next(err)
	}
})

blogRouter.delete("/:id", async (request, response, next) => {
	try {
		await Blog.findByIdAndDelete(request.params.id)
		response.status(204).end()
	} catch (err) {
		next(err)
	}
})

module.exports = blogRouter