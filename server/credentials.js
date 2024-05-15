// import the variables from the .env file for use
const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.resolve(__dirname, '../.env') })
let spotify_client_id = process.env.SPOTIFY_CLIENT_ID
let spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET
let redirect_uri = `${process.env.REACT_APP_BACKEND}/auth/callback`

let spotify_token = null
let refresh_token = null


module.exports = {
    get_spotify_client_id: () => spotify_client_id,
    get_spotify_client_secret: () => spotify_client_secret,
    get_spotify_redirect_uri: () => redirect_uri,


    get_spotify_token: () => spotify_token,
    set_spotify_token: (token) => spotify_token = token,
    get_refresh_token: () => refresh_token,
    set_refresh_token: (token) => refresh_token = token
}