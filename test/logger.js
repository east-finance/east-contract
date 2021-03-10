const express = require('express')

const app = express()

app.use(express.json())

app.post('/', (req, res) => {
    // eslint-disable-next-line no-console
    console.log(new Date(), 'Data:', req.body)
    res.send('')
})

app.listen(5050, '0.0.0.0', () => {
    // eslint-disable-next-line no-console
    console.log('Logger is listening')
})
