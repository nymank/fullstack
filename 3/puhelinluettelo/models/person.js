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

//     } else if (process.argv.length === 5) {
//         const person = new Person({
//             name: process.argv[3],
//             number: process.argv[4]
//         })

//         person.save().then(result => {
//             console.log("person saved!")
//             mongoose.connection.close()
//         })
//     } else if (process.argv.length > 5) {
//         console.log('too many arguments! (remember to use hyphens "" around the name)')
//         mongoose.connection.close()
//     }



// } catch (err) {
//     console.error("Error querying database", err)
// }