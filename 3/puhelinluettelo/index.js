const express = require("express")


const app = express()

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

let persons = [
    {
        name: "Arto Hellas",
        number: "0501234515",
        id: 0
    },
    {
        name: "Cale Makar",
        number: "54138754738",
        id: 1
    },
    {
        name: "Joe Mama",
        number: "123",
        id: 2
    },

]

app.get("/api/persons", (req, res) => {
    res.json(persons)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end("Not Found")
    }
})

app.get("/info", (req, res) => {
    res.end(`Phonebook has info for ${persons.length} people.\n${Date(Date.now())}`)
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if( person ) {
        persons = persons.filter(p => p.id !== id)
        res.status(200).end("Deleted")
    } else {
        res.status(404).end("Not Found")
    }
})

