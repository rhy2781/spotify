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

/**
 * Generate statics for display on the home page
 * Pie Chart
 * > show the number of times tag was selected
 * > tags are stored on artist objects for each artist, we want to aggregate the tag count
 * 
 * 
 */
const getMore = async (more) => {

}

router.get('/statistics', (req, res) => {
    const tag_data = new Map()

    fetch('https://api.spotify.com/v1/me/player/recently-played', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.getSpotifyToken()}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const artistPromises = data.items.map(element => {
            return Promise.all(element.track.artists.map(artist => {
                return fetch(artist.href, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${credentials.getSpotifyToken()}`
                    }
                })
                .then(response => response.json())
                .then(artistData => {
                    artistData.genres.forEach(genre => {
                        if(tag_data.has(genre)){
                            tag_data.set(genre, tag_data.get(genre) + 1)
                        }
                        else{
                            tag_data.set(genre, 1)
                        }
                    });
                });
            }));
        });

        return Promise.all(artistPromises);
    })
    .then(() => {


        console.log(tag_data)
        var data = []
        var i = 0
        tag_data.forEach((value, key) => {
            data.push(
                {
                    "id": i,
                    "value": value,
                    "label": key
                }
            )
            i += 1
        })


        res.json({"data": data});
    })
    .catch(error => {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    });
});



module.exports = router;