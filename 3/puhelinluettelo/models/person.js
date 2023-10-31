const mongoose = require("mongoose")

const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(() => {
        console.log("Connected to MongoDB")
    }).catch(err => {
        console.error(err)
        process.exit(1)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person", personSchema)