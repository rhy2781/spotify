const express = require('express')
var app = express()
const port = 5001;

// allow cors
const cors = require('cors')
var options = {
    origin: 'http://localhost:3000'
}
app.use(cors(options))

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


app.listen(port, () => {
    console.log(`Application listening on port ${port}`)
})