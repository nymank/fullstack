require("dotenv").config()
const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")

app.use(cors())
app.use(express.json())
app.use(express.static("frontend/build"))
morgan.token("req-body", function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(":method :url :status :total-time[0] - :response-time ms :req-body"))

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`)
})

app.get("/api/persons", (req, res) => {
    Person.find({})
        .then((allPersons) => {
            res.json(allPersons)
        }).catch((err) => {
            console.error(err)
            res.status(404).end(err)
        })
})

app.get("/api/persons/:id", (req, res) => {
    const searchId = req.params.id
    Person.findById(searchId)
        .then(foundPerson => {
            if (!foundPerson) {
                res.status(404).end("Not found")
            } else {
                res.json(foundPerson)
            }
        }).catch(err => {
            res.status(500).end(err)
            console.log(err)
        })
})

app.get("/info", (req, res) => {
    Person.find({})
        .then((allPersons) => {
            res.end(`Phonebook has info for ${allPersons.length} people.\n${Date(Date.now())}`)
        }).catch((err) => console.error(err))
})

app.delete("/api/persons/:id", (req, res) => {
    const searchId = req.params.id
    if (!searchId) {
        res.status(400).end("Person ID must be specified")
    }

    Person.findByIdAndRemove(searchId)
        .then(foundPerson => {
            if (foundPerson) {
                res.status(200).end("Deleted")
            } else {
                res.status(404).end("Not Found")
            }

        }).catch(err => {
            if (err.name == "CastError") {
                res.status(400).end("Wrong ID format")
            } else {
                res.status(500).end()
            }
        })
})



app.post("/api/persons", (req, res) => {
    const newPerson = req.body
    if (!newPerson) {
        res.status(400).end("Empty request body")
    } else if (!newPerson.number || !newPerson.name) {
        res.status(400).end("Name and number are required")
    } else if (newPerson.id) {
        res.status(400).end("id field cannot be specified in request body")
    }

    Person.find({ name: newPerson.name })
        .then(foundPerson => {
            const nameNotInPhonebook = (typeof foundPerson === 'object' && foundPerson.length === 0)
            if (nameNotInPhonebook) {
                const person = new Person(newPerson)
                person.save().then(result => {
                    res.status(201).json(result)
                })
            } else {
                res.status(400).end(`Person with name '${newPerson.name}' already exists`)
            }
        }).catch(err => res.status(500).end(err))
})

// not required yet, still adding it because why not
app.put("/api/persons/:id", (req, res) => {
    const searchId = req.params.id
    const payload = req.body
    if (!searchId) {
        res.status(400).end("Person ID must be specified")
    }
    Person.findByIdAndUpdate(searchId, { number: payload.number })
        .then((updatedPerson) => {
            if( updatedPerson) {
                updatedPerson.number = payload.number // updated person has old number for some reason, so we have to do this
                res.status(200).json(updatedPerson)
            } else {
                res.status(404).end("Not Found")
            }
        }).catch(err => {
            console.error(err)
            if (err.name == "CastError") {
                res.status(400).end("Wrong ID format")
            } else {
                res.status(500).end(JSON.stringify(err))
            }
        })
})

