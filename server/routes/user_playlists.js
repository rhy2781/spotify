const express = require('express')
const router = express.Router()

const credentials = require('../credentials')
var id = ""

router.get('/', async (req, res) => {
    // get the id of the current user
    await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.getSpotifyToken()} `
        }
    })
        .then((response) => response.json())
        .then((response) => {
            id = response.id
        })

    // use the id to request that user's playlists
    await fetch(`https://api.spotify.com/v1/users/${id}/playlists`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.getSpotifyToken()}`
        }
    })
        .then((response) => response.json())
        .then((response) => {
            var temp = response.items
                .filter(x => x.public === true)
                .map((x) => ({
                    href: x.href,
                    name: x.name,
                    uri: x.uri,
                    image: x.images.length > 0 ? x.images[0].url : "none"
                }))
            res.json(temp)
        })
})


module.exports = router