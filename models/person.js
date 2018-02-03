const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const url = 'mongodb://fullstack:salainensana@ds217138.mlab.com:17138/puhelinluettelo'

mongoose.connect(url)
mongoose.Promise = global.Promise;

const personSchema = new Schema({
    id: Number,
    name: {
        type: String,
        unique: true
    },
    number: String
})

personSchema.statics.format = function (person) {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person
