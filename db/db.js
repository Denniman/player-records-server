const { Client } = require('pg')
const dotenv = require('dotenv')

dotenv.config()

const client = new Client( {
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: "localhost",
    port: 5432,
    database: process.env.DATABASE_NAME
})

client.connect()

module.exports = client