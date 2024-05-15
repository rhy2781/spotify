const express = require('express')
const router = express.Router()

const credentials = require('../credentials');

/**
 * GET
 * /home/artists
 * get the top artists for the user by popularity
 */
var artist_results = []
router.get('/artists', async (req, res) => {
    if(artist_results.length > 0){
        res.json({ "artists": artist_results})
    }
    else{
        await fetch('https://api.spotify.com/v1/me/top/artists', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${credentials.get_spotify_token()}`
            }
        })
        .then((response) => response.json())
        .then((response) => {
            response.items.sort((a, b) => b.popularity - a.popularity)
            artist_results = response.items.map((element) => {
                return (
                    {
                        "uri": element.uri,
                        "image": element.images[0].url,
                        "mainText": element.name,
                    }
                )
            })
            res.json({ "artists": artist_results})

        })
        .catch(err => console.log(err))
    }
})

/**
 * GET
 * /home/tracks
 * get the top 50 tracks played by the user
 */
var track_results = []
router.get('/tracks', async (req, res) => {
    if(track_results.length > 1){
        res.json({"tracks": track_results})
    }
    else{
        await fetch('https://api.spotify.com/v1/me/top/tracks?limit=50', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${credentials.get_spotify_token()}`
            }
        })
        .then((response) => response.json())
        .then((response) => {
            response.items.sort((a, b) => b.popularity - a.popularity)
            track_results = response.items.map((element, index) => {
                let min = Math.floor((element.duration_ms / 1000) / 60)
                let sec = Math.floor((element.duration_ms / 1000) % 60).toString().padStart(2, '0')
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
            res.json({ "tracks": track_results })
        })
        .catch(err => console.log(err))
    }
})

/**
 * GET
 * /home/statistics
 * get the tags counts for the most played top 500 tracks played for by the user
 * the top 12 tags are returned to allow the pie chart to display without lagging the browser
 */
const distinct_artists = [] // stores distinct artists in top tracks
const artist_occurrences = new Map(); // stores artist occurrences in top tracks
const tag_occurrences = new Map(); // store the occurrences ot tags in the top tracks
const genre_to_artist = new Map() // stores genre to artist in order to provide sample artists for each category

// recurring method to take in the top track url and distribute artist occurrences to
// 1. a list containing distinct artist ids
// 2. a list of how many time an artist has appeared
const getMore = async (more) => {
    const response = await fetch(more, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.get_spotify_token()}`
        }
    })
        .then((response) => response.json())
        .then((data) => {

            data.items.forEach(item => {
                item.artists.forEach((artist) => {
                    if (!distinct_artists.includes(artist.id)) {
                        distinct_artists.push(artist.id)
                    }

                    if (artist_occurrences.has(artist.id)) {
                        artist_occurrences.set(artist.id, artist_occurrences.get(artist.id) + 1)
                    }
                    else {
                        artist_occurrences.set(artist.id, 1)
                    }
                })
            })
            return data.next
        })
    return response
};

// batch requests the tag data for all distinct artists. Results are aggregated to 
// 1. genre_to_artist to keep a list of artists tied to a genre
// 2. tag_occurrences to aggregate the count of an artist to the genres that the artist has been tagged with
const getArtistGenres = async (start, end) => {
    let request = distinct_artists.slice(start, end)
    let query = ''
    request.forEach(element => {
        query += element + ","
    })
    query = query.substring(0, query.length - 1)

    await fetch(`https://api.spotify.com/v1/artists?ids=${query}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.get_spotify_token()}`
        }
    })
        .then((response) => response.json())
        .then((data) => {
            data.artists.forEach((a) => {
                a.genres.forEach((g) => {
                    if (tag_occurrences.has(g)) {
                        genre_to_artist.get(g).push(a.name)
                        tag_occurrences.set(g, tag_occurrences.get(g) + artist_occurrences.get(a.id))
                    }
                    else {
                        tag_occurrences.set(g, artist_occurrences.get(a.id))
                        genre_to_artist.set(g, [a.name])
                    }
                })

            })
        })
}

// main driver for /home/statistics
var statistics_results = []
router.get('/statistics', async (req, res) => {
    if (statistics_results.length > 0) {
        res.json({ "data": statistics_results.slice(0, 12) })
    }
    else {
        // request the top 500 tracks related to the user
        var counter = 1
        var next = await getMore('https://api.spotify.com/v1/me/top/tracks?limit=50')
        while (counter != 10) {
            var temp = await getMore(next)
            if (temp == null) break
            next = temp
            counter += 1
        }

        // get genre counts for distinct artists
        let start = -50
        let end = -1
        while (end < distinct_artists.length) {
            start += 50
            end = Math.min(distinct_artists.length, end + 50)
            await getArtistGenres(start, end)
        }

        // format the result
        tag_occurrences.forEach((value, key) => {
            statistics_results.push({ "label": key, "value": value, artists: genre_to_artist.get(key).slice(0, 6) })
        })
        statistics_results.sort((a, b) => b["value"] - a["value"])

        res.json({ "data": statistics_results.slice(0, 12) })
    }
})











// TODO: still yet to be fully implemented





// todo
router.get('/queue', async (req, res) => {
    const response = await fetch('https://api.spotify.com/v1/me/player/queue',
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${credentials.get_spotify_token()}`
            }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            return data
        })

    res.send({ "queue": response })
})
module.exports = router;
