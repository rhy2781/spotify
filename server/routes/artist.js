const express = require('express')
const router = express.Router()


const credentials = require('../credentials')

router.get('/', async (req, res) => {
    const artist_id = req.query.id

    await fetch(`https://api.spotify.com/v1/artists/${artist_id}`,
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
                image: response.images[0].url,
                name: response.name,
                type: response.type
            })
        )
        .catch(err => {
            console.log(err)
        })
})


router.get('/tracks', async (req, res) => {
    const artist_id = req.query.id

    await fetch(`https://api.spotify.com/v1/artists/${artist_id}/top-tracks`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${credentials.getSpotifyToken()}`
            }
        })
        .then((response) => response.json())
        .then((response) => {
            const temp = response.tracks.map((element) => {
                const min = Math.floor((element.duration_ms / 1000) / 60)
                const sec = Math.floor((element.duration_ms / 1000) % 60).toString().padStart(2, '0')

                return {
                    "uri": element.uri,
                    "album_uri": element.album.uri,
                    "track_number": element.track_number,
                    "image": element.album.images[0].url, // image 
                    "name": element.name,
                    "time": `${min}:${sec}`
                }
            })
            res.json({ "items": temp })
        })
        .catch(err => {
            console.log(err)
        })
})


router.get('/popular', async (req, res) => {
    const artist_id = req.query.id
    await fetch(`https://api.spotify.com/v1/artists/${artist_id}/albums`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.getSpotifyToken()}`
        }
    })
        .then((response) => response.json())
        .then((response) => {
            var ids = 'ids='
            response.items.forEach((element, index) => {
                if (index == 3) {
                    return ids;
                }
                ids = ids + element.uri.split(":")[2]
                ids = ids + ','
            });
            return ids
        })
        .then(async (ids) => {
            await fetch(`https://api.spotify.com/v1/albums?${ids}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${credentials.getSpotifyToken()}`
                }
            })
                .then((response) => response.json())
                .then((response) => {
                    const temp = response.albums.filter(element => element)
                    const temp1 = temp.sort((a, b) => b.popularity - a.popularity)
                    const temp2 = temp1.map((element) => {
                        return {
                            "uri": element.uri,
                            "image": element.images[0].url,
                            "mainText": element.name,
                            "subText": `${element.release_date.slice(0, 4)} • ${element.album_type.charAt(0).toUpperCase() + element.album_type.slice(1)}`
                        }
                    })
                    res.json({ "items": temp2 })
                })
        })
        .catch(err => console.log(err))
})

router.get('/albums', async (req, res) => {
    const artist_id = req.query.id
    await fetch(`https://api.spotify.com/v1/artists/${artist_id}/albums?include_groups=album`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.getSpotifyToken()}`
        }
    })
        .then((response) => response.json())
        .then((response) => {
            const temp = response.items.sort((a, b) => b.release_date.localeCompare(a.release_date))
            const temp1 = temp.map((element) => {
                return {
                    "uri": element.uri,
                    "image": element.images[0].url,
                    "mainText": element.name,
                    "subText": `${element.release_date.slice(0, 4)} • ${element.album_type.charAt(0).toUpperCase() + element.album_type.slice(1)}`
                }
            })
            res.json({ "items": temp1 })
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/singles', async (req, res) => {
    const artist_id = req.query.id
    await fetch(`https://api.spotify.com/v1/artists/${artist_id}/albums?include_groups=single`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.getSpotifyToken()}`
        }
    })
        .then((response) => response.json())
        .then((response) => {
            const temp = response.items.sort((a, b) => b.release_date.localeCompare(a.release_date))
            const temp1 = temp.map((element) => {
                return {
                    "uri": element.uri,
                    "image": element.images[0].url,
                    "mainText": element.name,
                    "subText": `${element.release_date.slice(0, 4)} • ${element.album_type.charAt(0).toUpperCase() + element.album_type.slice(1)}`
                }
            })
            res.json({ "items": temp1 })
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/appear', async (req, res) => {
    const artist_id = req.query.id
    await fetch(`https://api.spotify.com/v1/artists/${artist_id}/albums?include_groups=appears_on`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.getSpotifyToken()}`
        }
    })
        .then((response) => response.json())
        .then((response) => {
            const temp = response.items.sort((a, b) => b.release_date.localeCompare(a.release_date))
            const temp1 = temp.map((element) => {
                return {
                    "uri": element.uri,
                    "image": element.images[0].url,
                    "mainText": element.name,
                    "subText": `${element.release_date.slice(0, 4)} • ${element.album_type.charAt(0).toUpperCase() + element.album_type.slice(1)}`
                }
            })
            res.json({ "items": temp1 })
        })
        .catch(err => {
            console.log(err)
        })
})


module.exports = router;