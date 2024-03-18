import React, { useEffect, useState } from "react"

import './Playlists.css'

function Playlists() {

    const [playlists, setPlaylists] = useState([])
    const [display, setDisplay] = useState([])
        
        
    useEffect(async () => {
        await fetch(`${process.env.REACT_APP_BACKEND}/playlists`)
            .then((response) => response.json())
            .then((response) => setPlaylists(response))

        

    }, [])

    return (
        <div className="Playlists">
            This is the playlist section
        </div>
    )
}

export default Playlists

