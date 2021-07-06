const express = require('express')

const PORT = 5050

const app = express()

app.use(express.json())

app.post('/', (req, res) => {
    // eslint-disable-next-line no-console
    console.log(new Date(), 'Data:', req.body)
    res.send('')
})

app.listen(PORT, '0.0.0.0', () => {
    // eslint-disable-next-line no-console
    console.log(`Logger is listening on port ${PORT}`)
})
