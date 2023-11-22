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
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        minlength: 8,
        validate: function (value) {
            const parts = value.split("-")
            if (parts.length !== 2) {
                return false
            }

            const firstPart = parts[0]
            const secondPart = parts[1]

            if (firstPart.length !== 2 && firstPart.length !== 3) {
                return false
            }
            const min = 8
            if(secondPart.length < min-firstPart.length) {
                console.log(secondPart.length < min-firstPart.length)
                console.log(secondPart.length, min-firstPart.length)
                return false
            }
            return true
        },
        required: true
    }
})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person", personSchema)