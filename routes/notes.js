const notes = require('express').Router()
const { readFromFile, readAndAppend } = require('../helpers/fsUtils')
const uuid = require('../helpers/uuid')

notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
})

notes.get('/:noteId', (req, res) => {
    const noteId = req.params.noteId
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((note) => note.noteId === noteId)
            return result.length > 0 ? res.json(result) : res.json('No note with that ID')
        })
})

notes.post('/', (req, res) => {
    const { title, text } = req.body

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        }

        readAndAppend(newNote, 'db/db.json')

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