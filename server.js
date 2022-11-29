const express = require('express')
const path = require('path')
const api = require('./routes/index')

// if process.env.PORT is available, use that. else use PORT 3001
const PORT = process.env.PORT || 3001

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', api)

app.use(express.static('public'))

// hmtl routes
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
)

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
)

// wildcard route leads back to index.html
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
)

// start listen
app.listen(PORT, () =>
console.log(`App listening at http://localhost:${PORT}`)
)