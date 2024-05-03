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


// stores distinct artists in top tracks
const distinct_artists = []
// stores artist occurrences in top tracks
const artist_occurrences = new Map();

// want to return 
const tag_occurrences = new Map();
// tags for artists
const artist_genres = new Map()

const getMore = async (more) => {
    const response = await fetch(more, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.getSpotifyToken()}`
        }
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data.items.length)

        data.items.forEach(item => {
            item.artists.forEach((artist) =>{
                if(!distinct_artists.includes(artist.id)){
                    distinct_artists.push(artist.id)
                }

                if(artist_occurrences.has(artist.id)){
                    artist_occurrences.set(artist.id, artist_occurrences.get(artist.id) + 1)
                }
                else{
                    artist_occurrences.set(artist.id, 1)
                }
            })
        })
        return data.next
    })
    return response
};

const getArtistGenres = async(start, end) =>{
    var request = distinct_artists.slice(start, end)
    console.log("request length -" + request.length)
    var query = ''
    request.forEach(element => {
        query += element + ","
    })

    query = query.substring(0, query.length - 1)

    
    await fetch(`https://api.spotify.com/v1/artists?ids=${query}`,{
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.getSpotifyToken()}`
        }
    })
    .then((response) => response.json())
    .then((data) => {
        data.artists.forEach((a) =>{
            a.genres.forEach((g) =>{
                if(tag_occurrences.has(g)){
                    tag_occurrences.set(g, tag_occurrences.get(g) + artist_occurrences.get(a.id))
                }
                else{
                    tag_occurrences.set(g, artist_occurrences.get(a.id))
                }
            })

        })
    })
}

const formatted = []
router.get('/statistics', async (req, res) => {
    if(formatted.length > 0) res.json({"data": formatted})
    var counter = 1

    // var next = await getMore('https://api.spotify.com/v1/me/player/recently-played')
    var next = await getMore('https://api.spotify.com/v1/me/top/tracks?limit=50')

    console.log("====")

    console.log(next)
    console.log("^^^^")
    while(counter != 20){
        var temp = await getMore(next) 
        if(temp == null) break
        next = temp
        counter += 1
    }

    console.log(distinct_artists.length)
    await getArtistGenres(0, 50) // todo iterate through all artists


    console.log(tag_occurrences)

    tag_occurrences.forEach((value, key) => {
        formatted.push({"label": key, "value": value})
    })

    var sum = 0
    tag_occurrences.forEach(value => {
        sum += value;
    })
    console.log("tags" + sum)

    sum = 0
    artist_occurrences.forEach(value => {
        sum += value;
    })
    console.log("artists" + sum)
    res.json({"data": formatted})
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