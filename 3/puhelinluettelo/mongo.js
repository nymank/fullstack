const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log("give password as argument")
    process.exit(1)
}
const password = process.argv[2]

const url = `mongodb+srv://nymank:${password}@fullstack-nymank-cluste.wxt7ifl.mongodb.net/?retryWrites=true&w=majority`
try {
    mongoose.set("strictQuery", false)
    mongoose.connect(url)
} catch (err) {
    console.error("Could not connect to database!", err)
    process.exit(1)
}

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

try {
    const Person = mongoose.model("Person", personSchema)

    if (process.argv.length === 3) {
        Person.find({})
            .then((allPersons) => {
                console.log("phonebook:")
                allPersons.forEach(p => console.log(`${p.name} ${p.number}`))
                mongoose.connection.close()
            }).catch((err) => console.error(err))
    } else if (process.argv.length === 5) {
        const person = new Person({
            name: process.argv[3],
            number: process.argv[4]
        })

        person.save().then(result => {
            console.log("person saved!")
            mongoose.connection.close()
        })
    } else if( process.argv.length > 5 ) {
        console.log('too many arguments! (remember to use hyphens "" around the name)')
        mongoose.connection.close()
    }



} catch (err) {
    console.error("Error querying database", err)
}