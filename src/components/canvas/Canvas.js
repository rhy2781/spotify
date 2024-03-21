import { React, useState, useEffect } from "react";

import './Canvas.css'
import ProgressBar from "../progressBar/ProgressBar";
import Current from "../current/Current";
import MainControl from "../mainControl/MainControl";
import SideControl from "../sideControl/SideControl";
import Playlists from "../playlists/Playlists";
import MainContent from "../mainContent/MainContent";


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
    const [pages, setPages] = useState(["spotify:home"])
    const [pageIndex, setPageIndex] = useState(0)

    function addPage(uri) {
        setPages(prevPages => {
            const temp = prevPages.slice(0, pageIndex + 1);
            const res = [...temp, uri];
            return res;
        });
        // setPageIndex(prevIndex => prevIndex + 1);
        next();
    }

    function prev() {
        if (pageIndex == 0) {
            return
        }
        setPageIndex(pageIndex => pageIndex - 1);
    }

    function next() {
        if (pageIndex == pages.length - 1) {
            return
        }
        setPageIndex(pageIndex => pageIndex + 1)
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
                    return;
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

        //     // setInterval(progress, 1000); // Update every half second
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

    if (active) {
        return (
            <div>
                <div className="Top">
                    <Playlists
                        addPage={addPage}
                    />
                    <MainContent
                        pages={pages}
                        pageIndex={pageIndex}
                        prev={prev}
                    />
                </div>
                <div className="Player">
                    <Current
                        track={currentTrack}
                    />
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
                    <SideControl
                        player={player}
                        volume={volume}
                        setVolume={setVolume}
                    />
                </div>
            </div>
        )
    }
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