const mongoose = require("mongoose")

const connectToMongo = () => {
    const url = process.env.MONGO_URI
	mongoose.connect(url)
		.then(() => {
			console.log("Connected to MongoDB")
		}).catch(err => {
			console.error(err)
			process.exit(1)
		})
}

module.exports = { connectToMongo }