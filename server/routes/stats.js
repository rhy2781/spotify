const express = require('express')
const router = express.Router()
const credentials = require('../credentials');


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

const track_features = new Map()
var sorted_id_list = [] // id and played_at
var result = {}
router.get('/recent', async (req, res) => {
    if (Object.keys(result).length > 0) {
        res.send({ "tracks": result })
    }
    else {
        // fetch top 50 recently played tracks
        await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${credentials.get_spotify_token()}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                var items = data.items.sort((a, b) => new Date(a.played_at).getTime() - new Date(b.played_at).getTime())
                items.forEach((element) => {
                    track_features.set(element.track.id, {
                        "name": element.track.name,
                        "id": element.track.id,
                    })
                    sorted_id_list.push({ "id": element.track.id, "played_at": element.played_at })
                })
            })
            .catch(err => console.log(err))


        // construct queries for unique track ids
        var query = ''
        track_features.forEach((data, id) => {
            query += id + ","
        })
        query = query.substring(0, query.length - 1)
        console.log(query)


        // request data for unique track ids
        await fetch(`https://api.spotify.com/v1/audio-features?ids=${query}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${credentials.get_spotify_token()}`
                }
            }
        )
            .then((response) => response.json())
            .then((data) => {
                console.log(data)

                data.audio_features.forEach((track) => {
                    var track_data = track_features.get(track.id)
                    track_data["energy"] = track.energy
                    track_data["liveness"] = track.liveness
                    track_data["instrumentalness"] = track.instrumentalness
                    track_data["speechiness"] = track.speechiness
                    track_data["acousticness"] = track.acousticness
                    track_data["tempo"] = track.tempo
                })
            })

        // assign categories to results as empty arrays
        categories = ["energy", "liveness", "instrumentalness", "speechiness", "acousticness", "played_at", "tempo"]
        categories.forEach((c) => result[c] = [])

        // append data in sorted order
        sorted_id_list.forEach((track) => {
            var track_data = track_features.get(track.id)
            result["energy"].push(track_data["energy"])
            result["liveness"].push(track_data["liveness"])
            result["instrumentalness"].push(track_data["instrumentalness"])
            result["speechiness"].push(track_data["speechiness"])
            result["acousticness"].push(track_data["acousticness"])
            result["tempo"].push(track_data["tempo"])

            result["played_at"].push(track.played_at)
        })

        res.send({ "tracks": result })
    }
})


module.exports = router