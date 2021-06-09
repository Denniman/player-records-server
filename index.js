const express = require('express')
const bodyParser = require('body-parser')
const router = require('./routes/app')
require('dotenv')


const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())



app.use('/player', router)


app.get('/', (req, res) => {
    res.send('Hey You there! welcome to create a player')
})



app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})