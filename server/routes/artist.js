const express = require('express')
const router = express.Router()


const credentials = require('../credentials')

router.get('/', async (req, res) => {
    const artist_spotify_id = req.query.id
    console.log(artist_spotify_id)

    await fetch(`https://api.spotify.com/v1/artists/${artist_spotify_id}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${credentials.getSpotifyToken()}`
            }
        })
        .then((response) => response.json())
        .then((response) =>
            res.json({
                followers: response.followers.total,
                genre: response.genres,
                images: response.images,
                name: response.name,
                type: response.type
            })
        )
        .catch(err => {
            console.log(err)
        })
})


router.get('/tracks', async (req, res) => {
    const artist_spotify_id = req.query.id
    console.log(artist_spotify_id)

    await fetch(`https://api.spotify.com/v1/artists/${artist_spotify_id}/top-tracks`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${credentials.getSpotifyToken()}`
            }
        })
        .then((response) => response.json())
        .then((response) =>
            res.json({
                tracks: response.tracks
            })
        )
        .catch(err => {
            console.log(err)
        })
})

router.get('/albums', async (req, res) => {
    const artist_spotify_id = req.query.id
    await fetch(`https://api.spotify.com/v1/artists/${artist_spotify_id}/albums?include_groups=album`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.getSpotifyToken()}`
        }
    })
        .then((response) => response.json())
        .then((response) => res.json({"album":response.items}))
})


module.exports = router;

