import React from "react";
import Player from "./Player";

function Canvas(props) {
    return(
        <div className="Canvas">
            <div>
                test
            </div>
            <Player token={props.token}/> 
        </div>
    )
}
export default Canvas;