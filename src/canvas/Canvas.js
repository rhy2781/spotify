import { React, useState, useEffect } from "react";

import './Canvas.css'

import ProgressBar from "./TrackProgress";
import Current from "./CurrentTrack";
import MainControl from "./MainControl";
import SideControl from "./SideControl";
import Playlists from "./PlaylistPanel";
import MainContent from "./MainContent";

// default track
const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

/**
 * @component
 * @param {object} props 
 * @param {string} props.token The OAuthToken used to interact with the Spotify Web Playback SDK
 * @description The Canvas component is the main component that is used for format of the web clone
 * @returns {JSX.Element}
 */
function Canvas(props) {
    // web playback
    const [player, setPlayer] = useState(undefined)
    const [active, setActive] = useState(false)
    const [device, setDevice] = useState(null)

    // state variables to manage controls
    const [pause, setPause] = useState(false)
    const [currentTrack, setCurrentTrack] = useState(track)
    const [shuffle, setShuffle] = useState(false)
    const [repeat, setRepeat] = useState(0)
    const [progressMS, setProgressMS] = useState(0)
    const [durationMS, setDurationMS] = useState(0)
    const [volume, setVolume] = useState(0)

    // state variable to manage page
    const [pages, setPages] = useState(["spotify:home:home"])
    const [pageIndex, setPageIndex] = useState(0)

    /**
     * @function
     * @param {String} uri The string of the spotify uri
     * @description Adds a page to the pages history state variable.
     * @returns {void}
     */
    const addPage = (uri) => {
        if (uri.localeCompare(pages[pageIndex]) == 0) return;
        setPages([...pages.slice(0, pageIndex + 1), uri])
        setPageIndex(pageIndex + 1)
    }

    /**
     * @function
     * @description Decrements the current pointer in the page history by 1
     * @returns {void}
     */
    const prevPage = () => {
        if (pageIndex == 0) return
        setPageIndex(pageIndex - 1)
    }

    /**
     * @function
     * @description Increments the current pointer in the page history by 1
     * @returns 
     */
    const nextPage = () => {
        if (pageIndex == pages.length - 1) return
        setPageIndex(pageIndex + 1)
    }

    // spotify player object integration
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback Player -' + new Date().getTime(),
                getOAuthToken: cb => cb(props.token),
                volume: 0.5
            });

            setVolume(0.5);
            setPlayer(player);

            // Ready
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setDevice(device_id)
            });

            // Not Ready
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            // Player State Change Listener
            player.addListener('player_state_changed', (state => {
                if (!state) {
                    return
                }

                setCurrentTrack(state.track_window.current_track);
                setPause(state.paused);
                setShuffle(state.shuffle);
                setRepeat(state.repeat_mode);
                player.getVolume().then((v) => setVolume(v))

                setProgressMS(state.position)
                setDurationMS(state.track_window.current_track.duration_ms)
                player.getCurrentState().then((state) => {
                    (!state) ? setActive(false) : setActive(true)
                });

            }));
            player.connect();
        };

        window.addEventListener('beforeunload', () => player.disconnect()); // disconnect player on reload
        window.addEventListener('close', () => player.disconnect()); // disconnect player when window closes

        return () => {
            window.removeEventListener('beforeunload', () => {
                if (player) player.disconnect()
            });
            window.removeEventListener('close', () => {
                if (player) player.disconnect()
            });
            if (player) player.disconnect()
        };
        // eslint-disable-next-line
    }, []);

    /**
     * @async
     * @function
     * @description Request to transfer the playback of the Spotify Player to the current web app
     */
    const handleTransfer = async () => {
        await fetch(`${process.env.REACT_APP_BACKEND}/transfer`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'device': device })
        })
            .catch(err => {
                console.log(err)
            })
    }

    /**
     * @typedef {submitRequest} 
     * @param {string} uri The string uri of a spotify object to play
     * @param {string} [offset] The number of tracks to offset the playing of an album or a playlist. 1-indexed
     * @return {void}
     */
    const submitRequest = (uri, offset) => {
        // if the uri is an artist then submit our request to /requestArtist without a offset value
        if (uri.split(':')[1].localeCompare("artist") == 0) {
            fetch(`${process.env.REACT_APP_BACKEND}/controls/requestArtist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uri: uri,
                    device: device
                })
            })
                .catch(err => {
                    console.log(err)
                })
        }
        // otherwise submit a request to /request with the offset value
        // offset should be passed in as a 1-based indexed number
        else {
            fetch(`${process.env.REACT_APP_BACKEND}/controls/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uri: uri,
                    device: device,
                    offset: offset - 1
                })
            })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    // if the component is active, render the format of Canvas
    if (active) {
        return (
            <div className="Canvas">
                <div className="Top">
                    <div className="Playlists">
                        <Playlists
                            addPage={addPage}
                            pages={pages}
                            pageIndex={pageIndex}
                        />
                    </div>
                    <div className="Content">
                        <MainContent
                            addPage={addPage}
                            pages={pages}
                            pageIndex={pageIndex}
                            prevPage={prevPage}
                            nextPage={nextPage}
                            submitRequest={submitRequest}
                            currentTrack={currentTrack}
                        />
                    </div>
                </div>

                <div className="Bottom">
                    <div className="Current">
                        <Current
                            track={currentTrack}
                            addPage={addPage}
                        />
                    </div>
                    <div className="Controls">
                        <MainControl
                            player={player}
                            pause={pause}
                            shuffle={shuffle}
                            repeat={repeat}
                            durationMS={durationMS}
                            ms={progressMS}
                        />
                        < ProgressBar
                            player={player}
                            pause={pause}
                            durationMS={durationMS}
                            ms={progressMS}
                        />
                    </div>
                    <div className="SideControls">
                        <SideControl
                            player={player}
                            volume={volume}
                            setVolume={setVolume}
                        />
                    </div>
                </div>
            </div>
        )
    }
    // otherwise render a component to inform the user to transfer and provide the capability to transfer
    // the playback to the browser
    else {
        return (
            <div className="NoPlayback">
                <div className="NoPlaybackText">
                    Please transfer playback to the Web SDK
                </div>
                {device &&
                    <div className="TransferButton" onClick={handleTransfer}>
                        Transfer Playback to this Web Browser
                    </div>
                }
            </div >
        )
    }
}
export default Canvas;