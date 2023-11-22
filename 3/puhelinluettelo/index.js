require("dotenv").config()
const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")
// middlewares
app.use(cors())
app.use(express.json())
app.use(express.static("frontend/build"))
morgan.token("req-body", function (req, res, next) { return JSON.stringify(req.body) })
app.use(morgan(":method :url :status :total-time[0] - :response-time ms :req-body"))

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`)
})

app.get("/api/persons", (req, res, next) => {
    Person.find({})
        .then((allPersons) => {
            if (allPersons) {
                res.json(allPersons)
            } else {
                res.status(404).end("Not Found")
            }
        }).catch(err => next(err))
})

app.get("/api/persons/:id", (req, res, next) => {
    const searchId = req.params.id
    Person.findById(searchId)
        .then(foundPerson => {
            if (!foundPerson) {
                res.status(404).end("Not found")
            } else {
                res.json(foundPerson)
            }
        }).catch(err => next(err))
})

app.get("/info", (req, res, next) => {
    Person.find({})
        .then((allPersons) => {
            res.end(`Phonebook has info for ${allPersons.length} people.\n${Date(Date.now())}`)
        }).catch(err => next(err))
})

app.delete("/api/persons/:id", (req, res, next) => {
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

        }).catch(err => next(err))
})



app.post("/api/persons", (req, res, next) => {
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
                newPerson.name = newPerson.name.trim()
                newPerson.number = newPerson.number.trim()
                const person = new Person(newPerson)
                person.save().then(result => {
                    res.status(201).json(result)
                }).catch(err => next(err))
            } else {
                res.status(400).end(`Person with name '${newPerson.name}' already exists`)
            }
        }).catch(err => next(err))
})

app.put("/api/persons/:id", (req, res, next) => {
    const searchId = req.params.id
    const payload = req.body
    if (!searchId) {
        res.status(400).end("Person ID must be specified")
    }
    Person.findByIdAndUpdate(
        searchId,
        { number: payload.number },
        { new: true, runValidators: true, context: 'query' }
    ).then((updatedPerson) => {
        if (updatedPerson) {
            updatedPerson.number = payload.number
            res.status(200).json(updatedPerson)
        } else {
            res.status(404).end("Not Found")
        }
    }).catch(err => next(err))
})

// error handler express middware function
const errorHandler = (error, request, response, next) => {
    // console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send("Wrong ID format")
    } else if (error.name === 'ValidationError') {
        if (error.errors.number) {
            if (error.errors.number.properties.type === "user defined") {
                console.log(JSON.stringify(error.errors.number))
                return response.status(400).json({ error: "Number must contain two parts separated by a hyphen '-'. First part must be two or three numbers long." })
            } else if (error.errors.number.properties.type === "minlength") {
                return response.status(400).json({ error: error.message })
            }
        } else {
            return response.status(400).json({ error: error.message })
        }
    }

    next(error)
}


app.use(errorHandler) // viimeisenä