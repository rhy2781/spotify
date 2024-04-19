const express = require('express')
const router = express.Router()

const credentials = require('../credentials')


const getMore = async (more) => {
    const response = await fetch(more, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.getSpotifyToken()}`
        }
    });
    const data = await response.json();
    const res = data.items.map((element) => {
        const min = Math.floor((element.track.duration_ms / 1000) / 60)
        const sec = Math.floor((element.track.duration_ms / 1000) % 60).toString().padStart(2, '0')
        return {
            "added_at": element.added_at,
            "album_name": element.track.album.name,
            "album_uri": element.track.album.uri,
            "image": element.track.album.images[0].url,
            "artists": element.track.artists.map((artist) => {
                return {
                    "name": artist.name,
                    "uri": artist.uri
                }
            }),
            "uri": element.track.uri,
            "explicit": element.track.explicit,
            "duration": element.track.duration,
            "name": element.track.name,
            "time": `${min}:${sec}`,
            "track_number": element.track.track_number
        }
    })
    return [res, data.next];
}



router.use('/', async (req, res) => {
    const playlist_id = req.query.id;
    console.log(`request received ${playlist_id}`);
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.getSpotifyToken()}`
        }
    });
    const playlist = await response.json();


    const tracks = playlist.tracks;
    var formatted = tracks.items.map((element) => {
        const min = Math.floor((element.track.duration_ms / 1000) / 60)
        const sec = Math.floor((element.track.duration_ms / 1000) % 60).toString().padStart(2, '0')
        
        return {
            "added_at": element.added_at,
            "album_name": element.track.album.name,
            "album_uri": element.track.album.uri,
            "image": element.track.album.images[0].url,
            "artists": element.track.artists.map((artist) => {
                return {
                    "name": artist.name,
                    "uri": artist.uri
                }
            }),
            "uri": element.track.uri,
            "explicit": element.track.explicit,
            "duration": element.track.duration,
            "name": element.track.name,
            "time": `${min}:${sec}`,
            "track_number": element.track.track_number
        }
    })
    // console.log(JSON.stringify(formatted, null, 2))


    // var more = tracks.next;
    // while (more != null) {
    //     const temp = await getMore(more);
    //     formatted = formatted.concat(temp[0])
    //     more = temp[1];
    // }

    res.json({
        "name": playlist.name,
        "description": playlist.description,
        "image": playlist.images[0].url,
        "uri": playlist.uri,
        "tracks": formatted

    });
});

module.exports = router