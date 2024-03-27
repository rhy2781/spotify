import React, { useEffect, useState } from "react";

import './Current.css'

function Current(props) {

    const [artists, setArtists] = useState([])

    useEffect(() => {
        console.log(props.track.artists)
        const temp = props.track.artists.map((artist, index, arr) => (
            < div key={index} className="Artist" onClick={() => { props.addPage(artist.uri) }}>
                {(index === arr.length - 1) ? ` ${artist.name}` : `${artist.name}, `}
            </div >
        ));

        setArtists(temp);

    }, [props.track])

    return (
        <div>
            This is the current container
            {/* <div className="CurrentImageContainer">
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
            </div> */}
        </div>
    )
}
export default Current