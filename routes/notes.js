const notes = require('express').Router()
const { readFromFile, readAndAppend } = require('../helpers/fsUtils')
const uuid = require('../helpers/uuid')

notes.get('/', (req, res) => {
    readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)))
})

notes.post('/', (req, res) => {
    const { title, text } = req.body

    if (title && text) {
        const newNote = {
            title,
            text,
            noteId: uuid(),
        }

        readAndAppend(newNote, '.db/notes.json')

        const response = {
            status: 'success',
            body: newNote
        }

        res.json(response)
    } else {
        res.json('Error in posting note')
    }
})

module.exports = notes