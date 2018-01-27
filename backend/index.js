const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())
app.use(morgan('tiny'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(
        `<p>Puhelinluettelossa on ${persons.length} henkilöä.</p><p>${Date()}</p>`
    )
})

app.get('/api/persons/:id', (req, res) => {
    let person = persons.find(p => p.id === Number(req.params.id))
    person ? res.json(person) : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    let person = persons.find(p => p.id === Number(req.params.id))
    if (person) {
        persons = persons.map(p => p.id !== person.id)
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    let person = req.body
    person.id = nextId()
    let validation = validate(person)
    if (validation.error === undefined) {
        persons = persons.concat(person)
        res.status(validation.status).json(persons)
    } else {
        res.status(validation.status).json(validation)
    }
})

const nextId = () => {
    let nextId = randomId()
    while (persons.find(p => p.id === nextId) !== undefined) {
        nextId = randomId()
    }
    return nextId
}

const randomId = () => {
    let min = 1000000000
    let max = 9999999999
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const validate = (person) => {
    if (isEmpty(person.name)) {
        return {error: "Name can't be empty!", status: 400}
    } else if (isEmpty(person.number)) {
        return {error: "Number can't be empty!", status: 400}
    } else if (persons.find(p => p.name === person.name) !== undefined) {
        return {error: "Person already exists", status: 403}
    } else {
        return {error: undefined, status: 201}
    }
}

const isEmpty = (string) => {
    return (string === undefined || string === '')
}

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})