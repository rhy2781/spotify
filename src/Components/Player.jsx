import React, { useState, useEffect } from "react";
import {IoIosPlay, IoIosPause, IoMdSkipBackward, IoMdSkipForward, IoIosShuffle} from 'react-icons/io';
import {LuRepeat, LuRepeat1} from 'react-icons/lu';
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

    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);
    const [shuffle, setShuffle] = useState(false);
    const [volume, setVolume] = useState(0);
    const [repeat, setRepeat] = useState(0);


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

    }, []);

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
                        <div className="shuffle_button" onClick={() => {toggleShuffle() }} >
                            {shuffle ? <IoIosShuffle className="shuffle_icon" style={{color: "#1DB954"}}/> : <IoIosShuffle className="shuffle_icon"/>}
                        </div>  
                        <div className="previous_button" onClick={() => { player.previousTrack()}} >
                            {<IoMdSkipBackward className="previous_icon"/>}
                        </div>  
                        <div className="play_button" onClick={() => { player.togglePlay()}}>
                            {is_paused ? <IoIosPlay className="play_icon"/> : <IoIosPause className="play_icon"/>}  
                        </div>
                        <div className="next_button" onClick={() => { player.nextTrack()}} >
                            {<IoMdSkipForward className="next_icon"/>}
                        </div>  
                        <div className="repeat_button" onClick={() => {toggleRepeat()}} >
                            {repeat == 0 ? <LuRepeat className="repeat_icon"/> : repeat == 1 ? <LuRepeat className="repeat_icon" style={{color: "#1DB954"}}/> : <LuRepeat1 className="repeat_icon" style={{color: "#1DB954"}}/> }
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