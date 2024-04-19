import { React, useEffect, useState } from "react";

import './Artist.css'

// TODO: Document
function Artists(props) {

    const [display, setDisplay] = useState([])

    useEffect(() => {
        const temp = props.artists.map((artist, index, arr) => (
            < div key={index} className="Artist" onClick={() => props.addPage(artist.uri)}>
                {(index === arr.length - 1) ? ` ${artist.name}` : `${artist.name}, `}
            </div >
        ));
        setDisplay(temp);

    }, [props.artists])

    return (
        <div className="ArtistList">
            {display}
        </div>
    )
}

export default Artists;