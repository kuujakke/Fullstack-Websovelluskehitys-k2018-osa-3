const express = require('express')
const app = express()

app.use(express.static('build'))

const cors = require('cors')
app.use(cors())

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const morgan = require('morgan')
morgan.token('data', (req) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))

const Person = require('./models/person')

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            if (persons) {
                res.status(200).json(persons.map(Person.format))
            } else {
                console.log(persons)
                res.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            res.status(404).end()
        })
})

app.get('/info', (req, res) => {
    Person
        .find({})
        .then(persons => {
            if (persons) {
                res.send(
                    `<p>Puhelinluettelossa on ${persons.length} henkilöä.</p><p>${Date()}</p>`
                )
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            res.status(404).end()
        })
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            person ? res.status(200).json(Person.format(person)) : res.status(404).end()
        })
        .catch(error => {
            console.log(error)
            res.status(404).end()
        })
})

app.put('/api/persons/:id', (req, res) => {
    let body = req.body
    const person = new Person({
        _id: body.id,
        name: body.name,
        number: body.number
    })
    let validation = validate(person)
    if (validation) {
        Person
            .findByIdAndUpdate(person._id, { number: person.number })
            .exec()
            .then(() => {
                console.log(Person.format(person))
                res.status(200).json(Person.format(person))
            })
            .catch(error => {
                res.status(400).json(error)
            })
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .findOneAndRemove({ _id: req.params.id })
        .then(() => {
            res.status(200).end()
        })
        .catch((error) => {
            console.log(error)
            res.status(400).end()
        })
})

app.post('/api/persons', (req, res) => {
    let body = req.body
    const person = new Person({
        name: body.name,
        number: body.number
    })
    let validation = validate(person)
    if (validation.error === undefined) {
        person
            .save()
            .then(person => {
                if (person) {
                    res.status(validation.status).json(Person.format(person))
                } else {
                    res.status(404).end()
                }
            })
            .catch(error => {
                console.log(error)
                res.status(400).end()
            })
    } else {
        res.status(validation.status).json(validation)
    }
})

const validate = (person) => {
    if (isEmpty(person.name)) {
        return { error: 'Name can´t be empty!', status: 400 }
    } else if (isEmpty(person.number)) {
        return { error: 'Number can´t be empty!', status: 400 }
    } else {
        return { error: undefined, status: 201 }
    }
}

const isEmpty = (string) => {
    return (string === undefined || string === '')
}

const error = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})