/**
 * The player object of the spotify web sdk
 * @typedef {Object} SpotifyPlayer
 * @property {Function} previousTrack Play the previous track
 * @property {Function} nextTrack Play the next track
 * @property {Function} togglePlay Pause or play the music depending on the state of the playback
 * @property {Function} seek Seek a specific time in the current playback
 * 
 * @property {boolean} pause Whether ot not the playback is currently paused
 * @property {boolean} shuffle  Whether or not the playback is being shuffled
 * @property {number} repeat The current state of the playback's repeat
 */

module.exports = SpotifyPlayer