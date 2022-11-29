const notes = require('express').Router()
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils')
const { v4: uuidv4 } = require('uuid')

notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
})

notes.get('/:noteId', (req, res) => {
    const noteId = req.params.noteId
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((note) => note.id === noteId)
            return result.length > 0 ? res.json(result) : res.json('No note with that ID')
        })
})

notes.delete('/:noteId', (req, res) => {
    const noteId = req.params.noteId
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((note) => note.id !== noteId)

            writeToFile('./db/db.json', result)

            res.json(`Note with id ${noteId} has been deleted`)
        })
})

notes.post('/', (req, res) => {
    const { title, text } = req.body

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
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