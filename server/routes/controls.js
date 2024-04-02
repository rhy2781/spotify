const express = require('express')
const router = express.Router()


const credentials = require('../credentials')


router.post('/shuffle', (req, res) => {
    var state = req.body.state
    if (state) {
        fetch('http://api.spotify.com/v1/me/player/shuffle?state=false', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${credentials.getSpotifyToken()}`
            }
        })
    }
    else {
        fetch('http://api.spotify.com/v1/me/player/shuffle?state=true', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${credentials.getSpotifyToken()}`
            }
        })
    }
    res.end()
})

router.post('/repeat', (req, res) => {
    var state = req.body.state;
    if (state === 0) {
        console.log("process 0")
        fetch('https://api.spotify.com/v1/me/player/repeat?state=context', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${credentials.getSpotifyToken()}`
            }
        })
    }
    else if (state === 1) {
        fetch('https://api.spotify.com/v1/me/player/repeat?state=track', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${credentials.getSpotifyToken()}`
            }
        })
    }
    else {
        fetch('https://api.spotify.com/v1/me/player/repeat?state=off', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${credentials.getSpotifyToken()}}`
            }
        })
    }
    res.end()
})

router.post('/request', (req, res) => {
    var uri = req.body.uri
    var device = req.body.device
    var offset = req.body.offset
    console.log(uri)
    console.log(offset)

    if (offset == null) {
        offset = 0
    }

    fetch(`https://api.spotify.com/v1/me/player/play?${device}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${credentials.getSpotifyToken()}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "context_uri": uri,
            "offset": {
                "position": offset
            }
        })
    })
        .then((response) => {
            console.log(response.ok)
            console.log(response.statusText)
            console.log(response.status)
        })
        .catch(err => {
            console.log(err)
        })

    res.end();
})


module.exports = router