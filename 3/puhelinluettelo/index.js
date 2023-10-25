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
            if( !foundPerson ) {
                res.status(404).end("Not found")
            } else {
                res.json(foundPerson)
            }
        }).catch(err => {
            res.status(404).end(err)
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
    const id = Number(req.params.id)
    if (!id) {
        res.status(400).end("Person ID must be specified")
    }

    const person = persons.find(p => p.id === id)
    if (person) {
        persons = persons.filter(p => p.id !== id)
        res.status(200).end("Deleted")
    } else {
        res.status(404).end("Not Found")
    }
})

app.post("/api/persons", (req, res) => {
    const newPerson = req.body
    if (!newPerson) {
        const err = { errorMessage: "Empty request body" }
        res.status(400).json(err)
    } else if (!newPerson.number || !newPerson.name) {
        const err = { errorMessage: "Name and number are required" }
        res.status(400).json(err)
    } else if (newPerson.id) {
        const err = { errorMessage: "id field cannot be specified in request body" }
        res.status(400).json(err)
    }

    if (persons.findIndex(p => p.name === newPerson.name) === -1) {
        persons = persons.concat({ ...newPerson, id: Math.floor(10000 * Math.random()) })
        res.status(201).json(newPerson)
    } else {
        const err = { errorMessage: `Person with name ${newPerson.name} already exists` }
        res.status(400).json(err)
    }
})