import React from "react";
import {IoIosPlay, IoIosPause, IoMdSkipBackward, IoMdSkipForward, IoIosShuffle} from 'react-icons/io';
import {LuRepeat, LuRepeat1} from 'react-icons/lu';

function Player_2_3(props){
    // Toggle Shuffle on Play
    async function toggleShuffle(){
        if(props.shuffle){
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

    // Toggle Repeat on Play
    async function toggleRepeat(){
        if(props.repeat == 0){
            const response = fetch('https://api.spotify.com/v1/me/player/repeat?state=context', {
                method: 'PUT',
                headers:{
                    'Authorization': `Bearer ${props.token}`
                }
            })
        }
        else if(props.repeat == 1){
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


    return(
        <div className="Player_2_3"> 
            <div className="Player_2_3_top">
                <div className="shuffle_button" onClick={() => {toggleShuffle() }} >
                    {props.shuffle ? <IoIosShuffle className="shuffle_icon" style={{color: "#1DB954"}}/> : <IoIosShuffle className="shuffle_icon"/>}
                </div>  
                <div className="previous_button" onClick={() => {props.player.previousTrack()}} >
                    {<IoMdSkipBackward className="previous_icon"/>}
                </div>  
                <div className="play_button" onClick={() => {props.player.togglePlay()}}>
                    {props.is_paused ? <IoIosPlay className="play_icon"/> : <IoIosPause className="pause_icon"/>}  
                </div>
                <div className="next_button" onClick={() => {props.player.nextTrack()}} >
                    {<IoMdSkipForward className="next_icon"/>}
                </div>  
                <div className="repeat_button" onClick={() => {toggleRepeat()}} >
                    {props.repeat == 0 ? <LuRepeat className="repeat_icon"/> : props.repeat == 1 ? <LuRepeat className="repeat_icon" style={{color: "#1DB954"}}/> : <LuRepeat1 className="repeat_icon" style={{color: "#1DB954"}}/> }
                </div>  
            </div>
            <div className="Player_2_3_bottom">
                <div>
                    {props.progress_duration_display}
                </div>
                <div className="slider_encased">
                    <input 
                            className="test"
                            type="range" 
                            min={0} 
                            max={1} 
                            step={"any"} 
                            value={props.progressBarGraphic} 
                            onChange={event => { 
                                props.handleProgressChange(event.target.valueAsNumber);
                            }} 
                        />
                </div>
                <div>
                    {props.total_duration_display}
                </div>
            </div>
        </div>
    )
}

export default Player_2_3;