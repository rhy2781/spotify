const express = require('express')
const router = express.Router()

const credentials = require('../credentials')

router.get('/', async (req, res) => {
    const album_id = req.query.id
    await fetch(`https://api.spotify.com/v1/albums/${album_id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.getSpotifyToken()}`
        }
    })
        .then((response) => response.json())
        .then((response) => {
            const tracks = response.tracks.items.map((element) => {

                const min = Math.floor((element.duration_ms / 1000) / 60)
                const sec = Math.floor((element.duration_ms / 1000) % 60).toString().padStart(2, '0')

                return {
                    "artists": element.artists.map((artist) => {
                        return {
                            "name": artist.name,
                            "uri": artist.uri
                        }
                    }),
                    "uri": element.uri,
                    "track_number": element.track_number,
                    "explicit": element.explicit,
                    "name": element.name,
                    "time": `${min}:${sec}`
                }
            })

            res.json({
                "name": response.name,
                "uri": response.uri,
                "image": response.images[0].url,
                "date": response.release_date,
                "tracks": tracks,
                "copyrights": response.copyrights,
                "label": response.label
            })
        })
})



module.exports = router
