const express = require('express')
const bodyParser = require('body-parser')
const router = require('./routes/app')

const app = express()
const port = 3000

app.use(bodyParser.json())



app.use('/player', router)


app.get('/', (req, res) => {
    res.send('Hey You there! welcome to create a player')
})



app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})