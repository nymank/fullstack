const express = require("express")
const app = express()
const cors = require("cors")
const middleware = require("./utils/middleware")
const blogRouter = require("./controllers/blogController")
const usersRouter = require('./controllers/userController')
const loginRouter = require("./controllers/loginController")
const db = require("./db/db")
db.connectToMongo()

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)

// routes
app.use('/api/login', loginRouter)
app.use("/api/blogs", blogRouter)
app.use('/api/users', usersRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app