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

    await fetch(`https://api.spotify.com/v1/artists/${artist_spotify_id}/top-tracks`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${credentials.getSpotifyToken()}`
            }
        })
        .then((response) => response.json())
        .then((response) =>{
            const temp = response.tracks.map((element) =>{
                const min = Math.floor((element.duration_ms / 1000) / 60)
                const sec = Math.floor((element.duration_ms / 1000) % 60).toString().padStart(2, '0')

                return{
                    "uri": element.uri,
                    "album_uri": element.album_uri,
                    "track_number":element.track_number,
                    "image": element.album.images[0].url,
                    "name": element.name,
                    "time": `${min}:${sec}`
                }                
            })
            res.json({"tracks": temp})
        })
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
        .then((response) => {
            const temp = response.items.map((element) => {
                return{
                    "uri": element.uri,
                    "image":element.images[0].url,
                    "mainText":element.name,
                    "subText":`${element.release_date.slice(0,4)} • ${element.type}`
                }
            })
            res.json({"album": temp})
        })
        .catch(err => {
            console.log(err)
        })
})


module.exports = router;