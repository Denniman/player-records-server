const express = require('express')
const router = express.Router()
const client = require('../db/db')
const upload = require('../storage/create-avatar')

router
.route('')
.post(async (req, res) => {
    
    try {
        const {name, position, clubname, avatar} = req.body

        const playerDetails = await client.query(
            `INSERT INTO players (name, position, clubname, avatar) VALUES($1, $2, $3, $4) RETURNING *`, 
                [name, position, clubname, avatar]
            )
        res.json(playerDetails.rows[0])

    } catch (err) {
        console.log(err.message)
    }

})
// just for practice* get all players from db*
.get(async (req, res) => {
    try {
        const allPlayers = await client.query(`SELECT * FROM players`)
        res.json(allPlayers.rows)
    } catch(err) {
        console.log(err.message)
    }
})

router
.route('/:id')
.get( async (req, res) => {
    
    try {
        const { id } = req.params
        const player = await client.query(`SELECT * FROM players WHERE id = $1`, [id])
        res.json(player.rows[0]) 
    } catch (err) {
        console.log(err.message)
    }
})
.patch( async (req, res) => {
    try {
        const { id } = req.params
        const { name, position, clubname } = req.body
        await client.query(`UPDATE players SET name = $1, position = $2, clubname = $3 WHERE id = $4`, 
        [name, position, clubname, id])
        res.json('Player details updated!')
    } catch (err) {
        console.log(err.message)
    }
})
// UPDATE AVATAR
router
.route('/avatar/:id')
.put( upload.single('avatar'), async (req, res) => {
    try {
        const { id } = req.params
        const { avatar } = req.body
        await client.query(`UPDATE players SET avatar = $1 WHERE id = $2`, [avatar, id])
        res.json('player avatar updated!')
    } catch (err) {
        console.log(err.message)
    }
    
})


module.exports = router