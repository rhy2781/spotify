import React, { useEffect, useState } from "react";

import './CurrentTrack.css'

/**
 * Renders the currently playing track
 * @param {Object} props 
 * @param {Function} props.addPage Add a page to the page history
 * @param {Object} props.currentTrack The current Track that the playback is playing
 * @returns 
 */
function CurrentTrack(props) {

    const [artists, setArtists] = useState([])

    // render visual data
    useEffect(() => {
        const temp = props.track.artists.map((artist, index, arr) => (
            < div key={index} className="Artist" onClick={() => { props.addPage(artist.uri) }}>
                {(index === arr.length - 1) ? ` ${artist.name}` : `${artist.name}, `}
            </div >
        ));
        setArtists(temp);

    }, [props.track])

    return (
        <div className="CurrentContainer">
            <div className="CurrentImageContainer">
                <img
                    src={props.track.album.images[0].url}
                    alt={props.track.uri}
                />
            </div>
            <div className="CurrentDetails">
                <div className="CurrentTrack" onClick={() => props.addPage(props.track.uri)}>
                    {props.track.name}
                </div>
                <div className="CurrentArtists">
                    {artists}
                </div>
            </div>
        </div>
    )
}
export default CurrentTrack