const express = require('express')
const router = express.Router()

const credentials = require('../credentials');
const { GiConsoleController } = require('react-icons/gi');
const { GrSystem } = require('react-icons/gr');

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
const genre_to_artist = new Map()

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

const getArtistGenres = async(start, end) => {
    var request = distinct_artists.slice(start, end)
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
                    genre_to_artist.get(g).push(a.name)
                    tag_occurrences.set(g, tag_occurrences.get(g) + artist_occurrences.get(a.id))
                }
                else{
                    tag_occurrences.set(g, artist_occurrences.get(a.id))
                    genre_to_artist.set(g, [a.name])
                }
            })

        })
    })
}

let formattedData  = null
router.get('/statistics', async (req, res) => {
    if(formattedData){
        res.json({"data": formattedData.slice(0, 12)})
    }
    else{
        const formatted = []
        var counter = 1
        var next = await getMore('https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term')
        while(counter != 20){
            var temp = await getMore(next) 
            if(temp == null) break
            next = temp
            counter += 1
        }


        // get genres for distinct artists
        let start = -50
        let end = -1
        while(end < distinct_artists.length){
            start += 50
            end = Math.min(distinct_artists.length, end + 50)
            await getArtistGenres(start, end)
        }

        tag_occurrences.forEach((value, key) => {
            formatted.push({"label": key, "value": value, artists: genre_to_artist.get(key).slice(0, 6)})
        })
        formatted.sort((a, b) => b["value"] - a["value"])

       formattedData = formatted
        res.json({"data": formatted.slice(0, 12)})
    }
})





// get recently played tracks 50
// get the id/time/name
const recent_ids = [] // for query
const recent_mappings = {}

const getRecent = async(more) => {
    const recent =  []
    const response = await fetch(more, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.getSpotifyToken()}`
        }
    })
    .then((response) => response.json())
    .then((data) => {
        data.items.forEach((element) => {
            recent_mappings[element.track.id] = {
                "name": element.track.name,
                "id": element.track.id,
                "played_at": element.played_at
            }
            recent_ids.push(element.track.id)
        })
    })
    .catch(err => console.log(err))

    return recent
}


const getRecentAnalysis = async() => {
    var query = ''
    recent_ids.forEach((id) => {
        query += id + ','
    })
    query = query.substring(0, query.length - 1)

    const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${query}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${credentials.getSpotifyToken()}`
            }
        }
    )
    .then((response) => response.json())
    .then((data) => {   
        data.audio_features.forEach((track) => {
            recent_mappings[track.id]["features"] = {}
            recent_mappings[track.id]["features"]["energy"] = track.energy
            recent_mappings[track.id]["features"]["liveliness"] = track.liveliness
            recent_mappings[track.id]["features"]["instrumentalness"] = track.instrumentalness
            recent_mappings[track.id]["features"]["speechiness"] = track.speechiness
            recent_mappings[track.id]["features"]["acousticness"] = track.acousticness

            recent_mappings[track.id]["tempo"] = track.tempo
        })
    })
}



router.get('/recent', async (req, res) => {
    if(Object.keys(recent_mappings).length > 0){
        res.send({"tracks": recent_mappings})
    }
    else{
        var counter = 1
        await getRecent('https://api.spotify.com/v1/me/player/recently-played?limit=50')
        await getRecentAnalysis()
        res.send({"tracks": recent_mappings})
    }
})


module.exports = router;
