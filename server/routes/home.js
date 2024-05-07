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









// map to record features and data associated with an id
// id -> liveness, name, played_at, etc.
const trackData = new Map()

// list containing only 
var queryList = []

var recent_result = {}

// get the last 50 played tracks
const getRecentPlayedTracks = async() => {
    const recent =  []
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.getSpotifyToken()}`
        }
    })
    .then((response) => response.json())
    .then((data) => {
        const items = data.items.sort((a, b) => b.played_at - a.played_at)
        items.forEach((element) => {
            trackData.set(element.track.id, {
                "name": element.track.name,
                "id": element.track.id,
                "played_at": element.played_at
            })

            queryList.push({"id": element.track.id, "played_at": element.played_at})
        })
    })
    .catch(err => console.log(err))

    return recent
}


const getAnalysisOnRecentTracks = async() => {
    var query = ''
    queryList.forEach((element) => {
        query += element.id + ','
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

            var temp = trackData.get(track.id)
            temp["energy"] = track.energy
            temp["liveness"] = track.liveness

            temp["instrumentalness"] = track.instrumentalness
            temp["speechiness"] = track.speechiness
            temp["acousticness"] = track.acousticness

            temp["tempo"] = track.tempo
        })
    })
}


// numbers should be sorted by a date time object
// numbers appended in a sorted order

/**
{
    energy: []
    liveness: [] 
    names: []
    ...
}
*/

router.get('/recent', async (req, res) => {
    if(recent_result> 0){
        res.send({"tracks": recent_result})
    }
    else{
        // var counter = 1
        // await getRecent('https://api.spotify.com/v1/me/player/recently-played?limit=50')
        // await getRecentAnalysis()

        await getRecentPlayedTracks()
        await getAnalysisOnRecentTracks()
        
        queryList = queryList.sort((a, b) => a.played_at.localeCompare(b.played_at))


        categories = ["energy", "liveness", "instrumentalness", "speechiness", "acousticness", "played_at", "tempo"]
        categories.forEach((c) => recent_result[c] = [])

        queryList.forEach((element) => {
            var elementData = trackData.get(element.id)
            recent_result["energy"].push(elementData["energy"])
            recent_result["liveness"].push(elementData["liveness"])
            recent_result["instrumentalness"].push(elementData["instrumentalness"])
            recent_result["speechiness"].push(elementData["speechiness"])
            recent_result["acousticness"].push(elementData["acousticness"])
            recent_result["played_at"].push(elementData["played_at"])
            recent_result["tempo"].push(elementData["tempo"])
        })


        res.send({"tracks": recent_result})
    }
})


module.exports = router;
