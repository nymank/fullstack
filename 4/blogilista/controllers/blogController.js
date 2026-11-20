const Blog = require("../db/models/blog")
const { authenticateUser } = require("../utils/middleware")
const logger = require("../utils/logger")
const User = require("../db/models/user")
const blogRouter = require("express").Router()


blogRouter.get("/", async (request, response, next) => {
	const blogs = await Blog.find({}).populate("user", { blogs: 0 })
	return response.json(blogs)
})

blogRouter.post("/", authenticateUser, async (request, response, next) => {
	try {
		const user = await User.findById(request.user.id)
		const blog = new Blog({
			...request.body,
			user: user.id,
		})

		const savedBlog = await blog.save()

		user.blogs.push(savedBlog.id)
		await user.save()

		return response.status(201).json(savedBlog)
	} catch (err) {
		next(err)
	}
})

blogRouter.delete("/:id", async (request, response, next) => {
	try {
		await Blog.findByIdAndDelete(request.params.id)
		return response.status(204).end()
	} catch (err) {
		next(err)
	}
})

blogRouter.put("/:id", async (request, response, next) => {
	try {
		const blog = request.body
		if (typeof blog.user === "object") {
			blog.user = blog.user.id
		}

		const updatedBlog = await Blog.findOneAndReplace(
			{ _id: request.params.id },
			blog,
			{ new: true, runValidators: true }
		)

		if (!updatedBlog) {
			return response.status(404).end()
		}

		response.json(updatedBlog)
	} catch (err) {
		next(err)
	}
})

module.exports = blogRouter