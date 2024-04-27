const express = require('express')
var app = express()
const port = 5001;

// allow cors
const cors = require('cors')
var options = {
    origin: 'http://localhost:3000'
}
app.use(cors(options))
app.use(express.json())

const qs = require('qs')
app.set('query parser',
    (str) => qs.parse(str)
)

/**
 * Authentication routes
 */
const auth = require('./routes/auth')
app.use('/auth', auth)

// test route
const credentials = require('./credentials')
app.get('/test', (req, res) => {
    res.json({
        'client_id': credentials.getSpotifyClientId(),
        'client_secret': credentials.getSpotifyClientSecret(),
        'redirect_uri': credentials.getRedirectUri(),
    })
})


const transfer = require('./routes/transfer')
app.use('/transfer', transfer)


const controls = require('./routes/controls')
app.use('/controls', controls)


const user_playlists = require('./routes/user_playlists')
app.use('/user-playlists', user_playlists)

const artist = require('./routes/artist')
app.use('/artist', artist)

const playlists = require('./routes/playlist')
app.use('/playlists', playlists)


const album = require('./routes/album')
app.use('/album', album)

const home = require('./routes/home')
app.use('/home', home)

app.listen(port, () => {
    console.log(`Application listening on port ${port}`)
})