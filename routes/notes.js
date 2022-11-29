const notes = require('express').Router()
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils')
const { v4: uuidv4 } = require('uuid')

// grab data from db.json
notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
})

// get a specific note to display on the page
notes.get('/:noteId', (req, res) => {
    const noteId = req.params.noteId
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((note) => note.id === noteId)
            return result.length > 0 ? res.json(result) : res.json('No note with that ID')
        })
})

// delete a specific note by removing a note with the same note id
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

// destructures the req into title and text, then create a newNote object with those properties as well as a randomized id with uuid, then post that new note in the db.json
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