const express = require('express')
var router = express.Router()
const credentials = require('../credentials')
const request = require('request')

// used to generate state to provide some security to the authentication process
var generate_random_string = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};



/**
 * GET
 * /auth/login
 * redirect the user to login to their spotify account 
 */
var state_check = ''
router.get('/login', (req, res) => {
    const scope = `user-read-private user-read-email streaming user-read-playback-state user-modify-playback-state 
        playlist-read-private user-top-read user-read-recently-played

    `
    var state = generate_random_string(16);
    var auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: credentials.get_spotify_client_id(),
        scope: scope,
        redirect_uri: credentials.get_spotify_redirect_uri(),
        state: state
    })
    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString())
    state_check = state
})


/**
 * GET
 * /auth/callback
 * exchange code sent to front end from spotify accounts service to get token for api/playback use 
 */
router.get('/callback', function (req, res) {
    let code = req.query.code || null;
    let state = req.query.state || null;
    if (state == null || state.localeCompare(state_check) != 0) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            })
        )
    } else {
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: credentials.get_spotify_redirect_uri(),
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer.from(
                    credentials.get_spotify_client_id() + ':' + credentials.get_spotify_client_secret()).toString('base64'))
            },
            json: true
        };
        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                credentials.set_spotify_token(body.access_token)
                credentials.set_refresh_token(body.refresh_token)
                res.redirect('http://localhost:3000/');
            }
        });
    }
})

/**
 * GET
 * /auth/refresh
 * requests a new token from the spotify accounts service providing 
 * 1. the client_id and client_secret in base64 encoding
 * 2. the refresh token from the initial token generation
 */
router.get('/refresh', function (req, res) {
    var refresh_token = credentials.get_refresh_token()
    var client_id = credentials.get_spotify_client_id()
    var client_secret = credentials.get_spotify_client_secret()

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    }
    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            credentials.set_spotify_token(body.access_token)
            res.json({
                access_token: body.access_token,
            })
        }
    })
})

/**
 * Request authenticated token 
 * GET 
 */
router.get('/token', (req, res) => {
    res.json({
        token: credentials.get_spotify_token()
    })
})

module.exports = router