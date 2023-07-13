import React from "react";
import Player from "./Player";
import Playlists from "./Playlists";

function Canvas(props) {
    return(
        <div className="Canvas">
            <Playlists token = {props.token}/>
            <div>
                test
            </div>
            <Player token={props.token}/> 
        </div>
    )
}
export default Canvas;