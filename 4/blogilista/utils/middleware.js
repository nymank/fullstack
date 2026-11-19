const { JWT_SECRET } = require("./config")
const logger = require("./logger")
const jwt = require("jsonwebtoken")
const requestLogger = (request, response, next) => {
    const start = Date.now()

    logger.info("---")
    logger.info(`Request:`)
    logger.info(`  Method: ${request.method}`)
    logger.info(`  Path: ${request.path}`)
    logger.info(`  Body: ${JSON.stringify(request.body ?? "")}`)

    response.on("finish", () => {
        logger.info(`Response:`)
        logger.info(`  Status: ${response.statusCode}`)
        logger.info(`  Duration: ${Date.now() - start}ms`)
        logger.info("---")
    })

    next()
}
const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" })
}

const errorHandler = (error, request, response, next) => {
	logger.error("Error handler:", error.name)

	if (error.name === "CastError") {
		return response.status(400).json({ error: "Malformatted id" })
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message })
	} else if (error.name === "SyntaxError") {
		return response.status(400).json({ error: error.message })
	} else if (error.name === "MongoServerError" && error.code === 11000 && error.keyPattern.username && error.message.includes("E11000 duplicate key error")) {
		return response.status(400).json({ error: "Username already exists" })
	} else if (error.name === "JsonWebTokenError") {
		return response.status(401).json({ error: "Token missing or invalid" })
	} else if (error.name === "TokenExpiredError") {
		return response.status(401).json({
			error: "Token expired"
		})
	}
	return response.status(500).json({ error: "Internal server error" })
}

const getTokenFrom = request => {
	const authorization = request.get("authorization")
	if (authorization && authorization.startsWith("Bearer ")) {
		return authorization.replace("Bearer ", "")
	}
	return null
}

const authenticateUser = async (request, response, next) => {
	try {
		const decodedToken = jwt.verify(getTokenFrom(request), JWT_SECRET)
		if (!(decodedToken.id)) {
			return response.status(401).json({ error: "Invalid token" })
		}
		request.user = decodedToken
		next()
	} catch (err) {
		next(err)
	}
}

module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler,
	authenticateUser,
}