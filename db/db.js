const { Client } = require('pg')


const client = new Client( {
    user: "postgres",
    password: "ternafanen18",
    host: "localhost",
    port: 5432,
    database: "playersdb"
})

client.connect()

module.exports = client