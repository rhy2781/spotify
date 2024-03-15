# Spotify Clone
The goal of this project is to recreate the spotify experience in the web browser.

## Installation
### Credentials
This project requires credentials to be provided within a .env file at the root directory. Please add this information when you clone the repository

#### Spotify credentials
Firstly this project makes use of the spotify web api and spotify web playback functionalities which is provided by spotify. This requires the use of a premium spotify account and you must create an application through their [development portal](https://developer.spotify.com/dashboard)

`SPOTIFY_CLIENT_ID` - This is the client id associated with the app created on the developer dashboard

`SPOTIFY_CLIENT_SECRET` - This is the associated secret with the app created on the developer dashboard

#### React Application Environmental variables
The react application makes references to the backend server. Any environmental variables within the react application is accessible via npm package [react-dotenv](https://www.npmjs.com/package/react-dotenv). This package requires that variables wished to be accessed from the react application be prefaced with "REACT_APP"

`REACT_APP_BACKEND` - this variable refers to the url that we are using for the backend node express server. It should reference local host and the port that the backend server will be running on.

### Node Package Installation
To install all of our node packages, we use the command

`npm install` 

### Node SSL Legacy
If you run into `Error: error:0308010C:digital envelope routines::unsupported`, you simply need to reference a legacy version of node SSL using the following command

`export NODE_OPTIONS=--openssl-legacy-provider`
