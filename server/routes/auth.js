const express = require('express')
var router = express.Router()
const credentials = require('../credentials')
const request = require('request')



var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};


// request code through the spotify accounts service
var stateCheck = ''
router.get('/login', (req, res) => {
    var scope = "streaming \ user-read-email \ user-read-private"
    var state = generateRandomString(16);
    var auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: credentials.getSpotifyClientId(),
        scope: scope,
        redirect_uri: credentials.getRedirectUri(),
        state: state
    })
    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString())
    stateCheck = state
})


// call back is received
router.get('/callback', function (req, res) {
    let code = req.query.code || null;
    let state = req.query.state || null;
    if (state == null || state.localeCompare(stateCheck) != 0) {
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
                redirect_uri: credentials.getRedirectUri(),
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer.from(
                    credentials.getSpotifyClientId() + ':' + credentials.getSpotifyClientSecret()).toString('base64'))
            },
            json: true
        };
        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log(body)
                credentials.setSpotifyToken(body.access_token)
                credentials.setRefreshToken(body.refresh_token)
                credentials.setExpiresIn(body.expires_in)
                res.redirect('http://localhost:3000/');
            }
        });
    }
})

router.get('/token', (req, res) => {
    res.json({
        token: credentials.getSpotifyToken()
    })
})

module.exports = router