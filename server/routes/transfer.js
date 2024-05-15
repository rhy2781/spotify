const express = require('express')
const router = express.Router()

const credentials = require('../credentials')

/**
 * POST 
 * /transfer
 * body: {"device": device}
 * submit request to spotify api to transfer playback to current browser
 */
router.post('', (req, res) => {
    if (req.body.device != null) {
        fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${credentials.get_spotify_token()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'device_ids': [req.body.device] })
        })
    }

})

module.exports = router