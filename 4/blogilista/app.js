const express = require("express")
const app = express()
const cors = require("cors")
const middleware = require("./utils/middleware")
const blogRouter = require("./controllers/blogController")
const usersRouter = require('./controllers/userController')
const db = require("./db/db")
db.connectToMongo()

app.use(cors())
app.use(express.json())


// routes
app.use("/api/blogs", blogRouter)
app.use('/api/users', usersRouter)

app.use(middleware.requestLogger)
app.use(middleware.errorHandler)

app.use(middleware.unknownEndpoint)

module.exports = app