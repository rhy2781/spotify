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
 * Authentication Routes
 * 
 * GET
 * /auth/login
 * redirect the user to login to their spotify account 
 * 
 * GET
 * /auth/callback
 * exchange code sent to front end from spotify accounts service to get token for api/playback use
 * 
 * GET
 * /auth/refresh
 * requests a new token from the spotify accounts service providing 
 * 1. the client_id and client_secret in base64 encoding
 * 2. the refresh token from the initial token generation
 * 
 * 
 * GET
 * /auth/token
 * return the token used for interaction with the spotify api/playback
 */
app.use('/auth', require('./routes/auth'))

/**
 * Transfer Route
 * 
 * POST 
 * /transfer
 * body: {"device": device}
 * submit request to spotify api to transfer playback to current browser
 */
app.use('/transfer', require('./routes/transfer'))

/**
 * API Routes for HomeView.js
 * 
 * GET
 * /home/artists
 * get the top artists for the user by popularity
 * 
 * GET
 * /home/tracks
 * get the top 50 tracks played by the user
 * 
 * GET
 * /home/statistics
 * get the tags counts for the most played top 500 tracks played for by the user
 * the top 12 tags are returned to allow the pie chart to display without lagging the browser
 * 
 * GET 
 * /home/recent
 * TODO: in progress
 * 
 */
app.use('/home', require('./routes/home'))


app.use('/album', require('./routes/album'))



app.use('/stats', require('./routes/stats'))



const controls = require('./routes/controls')
app.use('/controls', controls)


const user_playlists = require('./routes/user_playlists')
app.use('/user-playlists', user_playlists)

const artist = require('./routes/artist')
app.use('/artist', artist)

const playlists = require('./routes/playlist')
app.use('/playlists', playlists)






app.listen(port, () => {
    console.log(`Application listening on port ${port}`)
})