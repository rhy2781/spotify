import React, { useState, useEffect } from "react";
import {IoIosPlay, IoIosPause, IoMdSkipBackward, IoMdSkipForward, IoIosShuffle} from 'react-icons/io';
import {LuRepeat, LuRepeat1} from 'react-icons/lu';
import {BsVolumeUp} from 'react-icons/bs';

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


function Player(props) {
    // Variables for spotify player object
    const [player, setPlayer] = useState(undefined); 
    const [is_active, setActive] = useState(false); 

    // Variables for state
    const [is_paused, setPaused] = useState(false); 
    const [current_track, setTrack] = useState(track); 
    const [shuffle, setShuffle] = useState(false);
    const [volume, setVolume] = useState(0); 
    const [repeat, setRepeat] = useState(0);

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

    async function toggleShuffle(){
        if(shuffle){
            const response = fetch('https://api.spotify.com/v1/me/player/shuffle?state=false', {
                method: 'PUT',
                headers:{
                    'Authorization': `Bearer ${props.token}`
                }
            })
        }
        else{
            const response = fetch('https://api.spotify.com/v1/me/player/shuffle?state=true', {
                method: 'PUT',
                headers:{
                    'Authorization': `Bearer ${props.token}`
                }
            })
        }
    }

    async function toggleRepeat(){
        console.log(repeat)
        if(repeat == 0){
            const response = fetch('https://api.spotify.com/v1/me/player/repeat?state=context', {
                method: 'PUT',
                headers:{
                    'Authorization': `Bearer ${props.token}`
                }
            })
        }
        else if(repeat == 1){
            const response = fetch('https://api.spotify.com/v1/me/player/repeat?state=track', {
                method: 'PUT',
                headers:{
                    'Authorization': `Bearer ${props.token}`
                }
            })
        }
        else{
            const response = fetch('https://api.spotify.com/v1/me/player/repeat?state=off', {
                method: 'PUT',
                headers:{
                    'Authorization': `Bearer ${props.token}`
                }
            })
        }
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

    async function adjust_volume(i){
        player.setVolume(i);
        setVolume(i);
    }

    async function handleProgressChange(i){
        const seek_to = Math.floor(total_duration_ms * i);
        player.togglePlay();
        player.seek(seek_to);
        setProgressBarGraphic(seek_to / total_duration_ms);
        player.togglePlay();
    }
    
    if (is_active) {
        return (
            <div>
                <div className="Player">
                    <div className="Player_1_3"> 
                        <div>
                            <img src={current_track.album.images[0].url} className="current_track_cover"/>
                        </div>
                        <div className="current_track_details_container">
                            <div className="current_track_name">
                                {current_track.name}
                            </div>
                            <div className="current_track_artists">
                                {current_track.artists[0].name}
                            </div>
                        </div>
                    </div>
                    <div className="Player_2_3"> 
                        <div className="Player_2_3_top">
                            <div className="shuffle_button" onClick={() => {toggleShuffle() }} >
                                {shuffle ? <IoIosShuffle className="shuffle_icon" style={{color: "#1DB954"}}/> : <IoIosShuffle className="shuffle_icon"/>}
                            </div>  
                            <div className="previous_button" onClick={() => { player.previousTrack()}} >
                                {<IoMdSkipBackward className="previous_icon"/>}
                            </div>  
                            <div className="play_button" onClick={() => { player.togglePlay()}}>
                                {is_paused ? <IoIosPlay className="play_icon"/> : <IoIosPause className="pause_icon"/>}  
                            </div>
                            <div className="next_button" onClick={() => { player.nextTrack()}} >
                                {<IoMdSkipForward className="next_icon"/>}
                            </div>  
                            <div className="repeat_button" onClick={() => {toggleRepeat()}} >
                                {repeat == 0 ? <LuRepeat className="repeat_icon"/> : repeat == 1 ? <LuRepeat className="repeat_icon" style={{color: "#1DB954"}}/> : <LuRepeat1 className="repeat_icon" style={{color: "#1DB954"}}/> }
                            </div>  
                        </div>
                        <div className="Player_2_3_bottom">
                            <div>
                                {progress_duration_display}
                            </div>
                            <div className="slider_encased">
                                <input 
                                        className="test"
                                        type="range" 
                                        min={0} 
                                        max={1} 
                                        step={"any"} 
                                        value={progressBarGraphic} 
                                        onChange={event => { 
                                            handleProgressChange(event.target.valueAsNumber);
                                        }} 
                                    />
                            </div>
                            <div>
                                {total_duration_display}
                            </div>
                        </div>
                    </div>
                    <div className="Player_3_3">
                        <div className="volume_container">
                            <BsVolumeUp className="sound_icon"/>
                            <input 
                                className="slider" 
                                type="range" 
                                min={0} 
                                max={1} 
                                step={"any"} 
                                value={volume} 
                                onChange={event => { 
                                    adjust_volume(event.target.valueAsNumber)
                                }} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                Please Transfer Playback to Web SDK
            </div>
        )
    }
}

export default Player;