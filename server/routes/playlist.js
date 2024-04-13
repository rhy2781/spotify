const express = require('express')
const router = express.Router()

const credentials = require('../credentials')


// TODO 
const getMore = async (more) => {
    const response = await fetch(more, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.getSpotifyToken()}`
        }
    });
    const data = await response.json();
    return [data.items, data.next];
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

    var more = tracks.next;
    var test = 1;
    while (more != null) {
        console.log(test);
        test += 1;
        const temp = await getMore(more); // Wait for getMore function to execute
        console.log(temp[0]);
        more = temp[1];
    }

    res.json({
        "name": playlist.name,
        "description": playlist.description,
        "image": playlist.images[0].url
    });
});

module.exports = router