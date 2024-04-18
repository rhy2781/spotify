import React, { useEffect, useState } from "react";

import './CurrentTrack.css'
import Artists from "../components/Artists";

/**
 * Renders the currently playing track
 * @param {Object} props 
 * @param {Function} props.addPage Adds a spotify uri to the page history
 * @param {Object} props.currentTrack The current track that the playback is playing
 * @returns 
 */
function CurrentTrack(props) {
    return (
        <div className="CurrentContainer">
            <div className="CurrentImageContainer">
                <img
                    src={props.currentTrack.album.images[0].url}
                    alt={props.currentTrack.uri}
                />
            </div>
            <div className="CurrentDetails">
                <div className="CurrentTrack" onClick={() => props.addPage(props.currentTrack.album.uri)}>
                    {props.currentTrack.name}
                </div>
                <div className="CurrentArtists">
                    <Artists 
                        artists={props.currentTrack.artists} 
                        addPage={props.addPage} 
                    />
                </div>
            </div>
        </div>
    )
}
export default CurrentTrack