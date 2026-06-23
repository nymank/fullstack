const mongoose = require("mongoose")
const config = require("../utils/config")

const connectToMongo = () => {
	const url = config.MONGODB_URI
	mongoose.connect(url)
		.then(() => {
			console.log("Connected to MongoDB")
		}).catch(err => {
			console.error(err)
			process.exit(1)
		})
}

module.exports = { connectToMongo }