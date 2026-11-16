const Blog = require("../db/models/blog")

const blogRouter = require("express").Router()

blogRouter.get("/", (request, response, next) => {
	Blog
		.find({})
		.then((blogs) => {
			response.json(blogs)
		})
})

blogRouter.post("/", async (request, response, next) => {
    try {
        const blog = new Blog(request.body)
        const result = await blog.save()

        response.status(201).json(result)
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