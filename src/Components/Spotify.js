import React from "react";
import Player from "./Player";

function Spotify(props) {
    return (
        <div>
            <div>Player compoent</div>
            <Player token={props.token} />
        </div>
    );
}

export default Spotify;