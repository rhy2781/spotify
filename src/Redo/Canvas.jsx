import React, { useState, useEffect, useCallback } from "react";
import Player_1_3 from "./Player_1_3";
import Player_2_3 from "./Player_2_3";
import Player_3_3 from "./Player_3_3";

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

function Canvas(props){
    // Variables for spotify player object
    const [player, setPlayer] = useState(undefined);
    const [is_active, setActive] = useState(false);
    
    // Variables for state
    const [is_paused, setPaused] = useState(false); 
    const [current_track, setTrack] = useState(track); 
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState(0);
    const [volume, setVolume] = useState(0); 

    // Variables for song progress
    const [progress_duration_display, setProgressDurationDisplay] = useState("0:00"); // string display
    const [total_duration_display, setTotalDurationDisplay] = useState("-0:00"); // string display
    const [total_duration_ms, setTotalDurationMS] = useState(0); // used to progress seek
    const [progressBarGraphic, setProgressBarGraphic] = useState(0); // value to display on progress bar


    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Web Playback Player -' + new Date().getTime(),
                getOAuthToken: cb => { cb(props.token) },
                volume: 0.5
            });

            setVolume(0.5);
            setPlayer(player);

            // Ready
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
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

                setTrack(state.track_window.current_track);
                setPaused(state.paused);
                setShuffle(state.shuffle);
                setRepeat(state.repeat_mode);

                player.getCurrentState().then(state => {
                    (!state) ? setActive(false) : setActive(true)
                });

            }));
            player.connect();      
        };

        const newTimer = setInterval(progress, 1000); // Update every half second

        window.addEventListener('beforeunload', handleBeforeUnload);

    }, []);

    function handleBeforeUnload(){
        player.disconnect();
    }

    async function progress(){
        const response = await fetch('https://api.spotify.com/v1/me/player', {
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${props.token}`
            }
        })
        if(response.status == 200){
            const json = await response.json()
            const progress_min = Math.floor((json.progress_ms / 1000) / 60);
            const progress_sec = Math.floor((json.progress_ms / 1000) % 60);
            if(progress_sec < 10){
                setProgressDurationDisplay(`${progress_min}:0${progress_sec}`);
            }
            else{
                setProgressDurationDisplay(`${progress_min}:${progress_sec}`);
            }

            const duration_min = Math.floor(((json.item.duration_ms - json.progress_ms ) / 1000) / 60);
            const duration_sec = Math.floor(((json.item.duration_ms - json.progress_ms ) / 1000) % 60);

            if(duration_sec < 10){
                setTotalDurationDisplay(`-${duration_min}   :0${duration_sec}`);
            }
            else{
                setTotalDurationDisplay(`-${duration_min}   :${duration_sec}`);
            }
            setTotalDurationMS(json.item.duration_ms);
            setProgressBarGraphic((json.progress_ms / json.item.duration_ms))
        }
    }

    const handleProgressChange = useCallback((i) =>{
        const seek_to = Math.floor(total_duration_ms * i);
        player.togglePlay();
        player.seek(seek_to);
        setProgressBarGraphic(seek_to / total_duration_ms);
        player.togglePlay();
    })

    const adjust_volume = useCallback((i) =>{
        player.setVolume(i);
        setVolume(i);
    })

    if(is_active){
        return(
            <div>
                Canvas
                <div className="Player">
                    <Player_1_3 
                        current_track={current_track}
                    />
                    <Player_2_3 
                        player = {player} 
                        token = {props.token} 
                        shuffle = {shuffle} 
                        repeat = {repeat} 
                        is_paused = {is_paused}
                        progress_duration_display = {progress_duration_display}
                        total_duration_display = {total_duration_display}
                        handleProgressChange = {handleProgressChange}
                        progressBarGraphic = {progressBarGraphic}
                    />
                    <Player_3_3 
                        volume = {volume}
                        adjust_volume = {adjust_volume}
                    />

                </div>
            </div>
        )
    }
    else{
        return(
            <div>
                Please Transfer Playback to the WebSDK through the Spotify Application
            </div>
        )
    }
}

export default Canvas;