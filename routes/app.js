const express = require('express')
const router = express.Router()
const client = require('../db/db')
const upload = require('../storage/create-avatar')
const uuid = require('uuid')
const fs = require('fs')

router
.route('')
.post(async (req, res) => {
    
    const {name, position, clubname, avatar} = req.body
    try {

        if(!name && !position && !clubname) {
            return res.status(400).json({
                status: 'Failed', 
                message: 'Input fields cannot be empty'
            })
        }

        const playerDetails = await client.query(
            `INSERT INTO players (name, position, clubname, avatar) VALUES($1, $2, $3, $4) RETURNING *`, 
                [name, position, clubname, avatar]
            )

            if(playerDetails) {
                return res.status(200).json({
                    status: 'Success',
                    data: playerDetails.rows[0]
                })
            }

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            status: 'Failed',
            message: 'Opps! something went wrong'
        })
    }

})
// just for practice* get all players from db*
.get(async (req, res) => {
    try {
        const allPlayers = await client.query(`SELECT * FROM players ORDER BY id ASC`)

        if(allPlayers) {
            return res.status(200).json({
                status: 'Success',
                data: allPlayers.rows
            })
        }
    } catch(err) {
        console.log(err.message)
        return res.status(500).json({
            status: 'Failed',
            message: 'Opps! something went wrong'
        })
    }
})

router
.route('/:id')
.get( async (req, res) => {
    
    try {
        const { id } = req.params
        const player = await client.query(`SELECT * FROM players WHERE id = $1`, [id])

        if(player) {
            return res.status(200).json({
                status: 'Success',
                data: player.rows[0]
            })
        }
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            status: 'Failed',
            message: 'Opps! something went wrong'
        })
    }
})
.patch( async (req, res) => {
    const { id } = req.params
    const { name, position, clubname } = req.body
    try {
        
        if(!name && !position && !clubname) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Input fields cannot be empty'
            })
        }

       const updatedPlayer = await client.query(`UPDATE players SET name = $1, position = $2, clubname = $3 WHERE id = $4`, 
        [name, position, clubname, id])

        if(updatedPlayer) {
            return res.status(200).json({
                status: 'success',
                message: 'Player details updated!'
            })
        }


    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            status: 'Failed',
            message: 'Opps! something went wrong'
        })
    }
})
// UPDATE AVATAR
router
.route('/avatar/:id')
.put( upload.single('avatar'), async (req, res) => {
    try {

        const { id } = req.params
    
        let fileName = req.file.originalname
        fileName = uuid.v4()

        fs.rename(req.file.path, `avatars\\${fileName}.jpg`, (err) => {
            if(err) throw err
        })
                
       const avatarUpate =  await client.query(`UPDATE players SET avatar = $1 WHERE id = $2`, 
       [fileName, id])

       if(avatarUpate) {
           return res.status(200).json({
               status: 'Success',
               message: 'player avatar updated!'
           })
       }
        
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            status: 'Failed',
            message: 'Opps! something went wrong'
        })
    }
    
})


module.exports = router