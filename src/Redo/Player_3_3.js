import React from "react";
import {BsVolumeUp} from 'react-icons/bs';


function Player_3_3(props){

    return(
        <div className="Player_3_3">
        <div className="volume_container">
            <BsVolumeUp className="sound_icon"/>
            <input 
                className="slider" 
                type="range" 
                min={0} 
                max={1} 
                step={"any"} 
                value={props.volume} 
                onChange={event => { 
                    props.adjust_volume(event.target.valueAsNumber)
                }} 
            />
        </div>
    </div>
    )
}

export default Player_3_3;