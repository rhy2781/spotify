const express = require('express')
const router = express.Router()

const credentials = require('../credentials')

router.get('/', (req, res) => {
    res.send("temp");
})

router.get('/artists', async (req, res) => {
    await fetch('https://api.spotify.com/v1/me/top/artists', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.getSpotifyToken()}`
        }
    })
        .then((response) => response.json())
        .then((response) => {
            const temp = response.items.sort((a, b) => b.popularity - a.popularity)
            const temp1 = temp.map((element) => {
                return (
                    {
                        "uri": element.uri,
                        "image": element.images[0].url,
                        "mainText": element.name,
                        // "subText": `Popularity – ${element.popularity}`
                    }
                )
            })
            res.json({ "items": temp1 })

        })
        .catch(err => console.log(err))
})


router.get('/tracks', async (req, res) => {
    await fetch('https://api.spotify.com/v1/me/top/tracks?limit=50', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.getSpotifyToken()}`
        }
    })
        .then((response) => response.json())
        .then((response) => {
            const temp = response.items.sort((a, b) => b.popularity - a.popularity)
            const temp1 = temp.map((element, index) => {

                const min = Math.floor((element.duration_ms / 1000) / 60)
                const sec = Math.floor((element.duration_ms / 1000) % 60).toString().padStart(2, '0')
                console.log(element.album.images)
                return (
                    {
                        "name": element.name,
                        "uri": element.uri,
                        "artists": element.artists.map((artist) => {
                            return {
                                "name": artist.name,
                                "uri": artist.uri
                            }
                        }),
                        "track_number": element.track_number,
                        "album_uri": element.album.uri,
                        "album_name": element.album.name,
                        "image": element.album.images[0].url,
                        "time": `${min}:${sec}`
                    }
                )
            })
            res.json({ "items": temp1 })

        })
        .catch(err => console.log(err))
})



module.exports = router;