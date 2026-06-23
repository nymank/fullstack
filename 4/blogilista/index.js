const express = require("express")
const app = express()
const cors = require("cors")
const morgan = require("morgan")

require("dotenv").config()
morgan.token("req-body", function (req) { return JSON.stringify(req.body) })
app.use(morgan(":method :url :status :total-time[0] - :response-time ms :req-body"))
// db
const db = require("./db/db")
db.connectToMongo()
const Blog = require("./db/models/blog")


app.use(cors())
app.use(express.json())

app.get("/api/blogs", (request, response) => {
	Blog
		.find({})
		.then((blogs) => {
			response.json(blogs)
		})
})

app.post("/api/blogs", (request, response) => {
	const blog = new Blog(request.body)

	blog
		.save()
		.then((result) => {
			response.status(201).json(result)
		})
})

const PORT = 3003
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
