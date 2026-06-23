const express = require("express")
const app = express()
const cors = require("cors")
const middleware = require("./utils/middleware")
const blogRouter = require("./controllers/blogController")
const db = require("./db/db")
db.connectToMongo()

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)
app.use(middleware.errorHandler)

// routes
app.use("/api/blogs", blogRouter)

app.use(middleware.unknownEndpoint)


module.exports = app