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


const distinct_ids = []
const occurrences = new Map();


const getMore = async (more) => {
    const response = await fetch(more, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.getSpotifyToken()}`
        }
    })
    .then((response) => response.json())
    .then((data) => {

        data.items.forEach(item => {
            item.track.artists.forEach((artist) =>{
                if(!distinct_ids.includes(artist.id)){
                    distinct_ids.push(artist.id)
                }
            })
        })
        return data.next
    })

    return response


};

function flattenArray(arr) {
    return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val), []);
}

router.get('/statistics', async (req, res) => {
    const temp = await getMore('https://api.spotify.com/v1/me/player/recently-played?limit=50')
    console.log(temp)
    console.log(distinct_ids)
    // res.json(flattenArray(temp))

})

module.exports = router;



/// previous version
/**const getMore = async () => {
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/recently-played', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${credentials.getSpotifyToken()}`
            }
        });

        const data = await response.json();

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
                    return artistData.genres;
                });
            }));
        });

        const tags = await Promise.all(artistPromises);

        // Flatten array of arrays into a single array
        return {"tags": flattenArray(tags), "next": data.next}
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
 */