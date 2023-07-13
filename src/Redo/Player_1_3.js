import React from "react";

function Player_1_3(props){
    return(
        <div className="Player_1_3"> 
        <div>
            <img src={props.current_track.album.images[0].url} className="current_track_cover"/>
        </div>
        <div className="current_track_details_container">
            <div className="current_track_name">
                {props.current_track.name}
            </div>
            <div className="current_track_artists">
                {props.current_track.artists[0].name}
            </div>
        </div>
    </div>
    )
}

export default Player_1_3;