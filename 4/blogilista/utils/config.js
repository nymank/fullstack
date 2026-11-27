require("dotenv").config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.JWT_SECRET
const TEST_USER = {
    username: process.env.TEST_USER_USERNAME,
    password: process.env.TEST_USER_PASSWORD
}

module.exports = { MONGODB_URI, PORT, JWT_SECRET, TEST_USER }