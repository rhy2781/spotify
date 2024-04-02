const express = require('express')
const router = express.Router()

router.get('', (req, res) => {
    res.json({ sample: 'test' })
})

const credentials = require('../credentials')

router.post('', (req, res) => {
    if(req.body.device != null){
        fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${credentials.getSpotifyToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'device_ids': [req.body.device] })
        })
    }

})

module.exports = router