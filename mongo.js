const mongoose = require('mongoose')

const url = 'mongodb://fullstack:salainensana@ds217138.mlab.com:17138/puhelinluettelo'

mongoose.connect(url)
mongoose.Promise = global.Promise;

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
})

console.log(`Listätään henkilön ${person.name} numero ${person.number} luetteloon.`)
person
    .save()
    .then(result => {
        console.log(result);
        mongoose.connection.close()
    })
    .catch(error => {
        console.log(error)
        mongoose.connection.close()
    })