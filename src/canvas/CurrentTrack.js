import React, { useEffect, useState } from "react";

import './CurrentTrack.css'

/**
 * Renders the currently playing track
 * @param {Object} props 
 * @param {Function} props.addPage Adds a spotify uri to the page history
 * @param {Object} props.currentTrack The current track that the playback is playing
 * @returns 
 */
function CurrentTrack(props) {

    const [artists, setArtists] = useState([])

    // render visual data
    useEffect(() => {
        const temp = props.currentTrack.artists.map((artist, index, arr) => (
            < div key={index} className="Artist" onClick={() => props.addPage(artist.uri)}>
                {(index === arr.length - 1) ? ` ${artist.name}` : `${artist.name}, `}
            </div >
        ));
        setArtists(temp);

    }, [props.currentTrack, props.pages])

    return (
        <div className="CurrentContainer">
            <div className="CurrentImageContainer">
                <img
                    src={props.currentTrack.album.images[0].url}
                    alt={props.currentTrack.uri}
                />
            </div>
            <div className="CurrentDetails">
                <div className="CurrentTrack" onClick={() => props.addPage(props.currentTrack.uri)}>
                    {props.currentTrack.name}
                </div>
                <div className="CurrentArtists">
                    {artists}
                </div>
            </div>
        </div>
    )
}
export default CurrentTrack