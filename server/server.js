const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const querystring = require('querystring');
const request = require('request');
const cors = require('cors');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = 'http://localhost:5000/callback';
const port = 5000;
global.access_token = '';
var state_check = '';

var generateRandomString = function (length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var app = express();
app.use(cors());

app.get('/login', function (req, res) {
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email streaming user-read-playback-state';
    res.redirect('http://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        })
    );
    state_check = state;
});

app.get('/callback', function (req, res) {
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
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                access_token = body.access_token
                res.redirect('http://localhost:3000/');
            }
        });
    }
});

app.get('/token', (req, res) => {
    res.json({ access_token: access_token })
})

app.get('/refresh_token', function (req, res) {
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});


app.listen(port, () => {
    console.log(`Application listening on port ${port}`);
});
