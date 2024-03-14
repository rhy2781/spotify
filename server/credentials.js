// import the variables from the .env file for use
const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.resolve(__dirname, '../.env') })
let spotifyClientId = process.env.SPOTIFY_CLIENT_ID
let spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET
let redirectUri = `${process.env.REACT_APP_BACKEND}/auth/callback`

let spotifyToken = null
let refreshToken = null
let expiresIn = null



module.exports = {
    getSpotifyClientId: () => spotifyClientId,
    getSpotifyClientSecret: () => spotifyClientSecret,
    getRedirectUri: () => redirectUri,


    getSpotifyToken: () => spotifyToken,
    setSpotifyToken: (token) => spotifyToken = token,
    getRefreshToken: () => refreshToken,
    setRefreshToken: (token) => refreshToken = token,
    getExpiresIn: () => expiresIn,
    setExpiresIn: (time) => expiresIn = time 
}