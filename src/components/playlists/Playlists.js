import React, { useEffect, useState } from "react"
import { FaSpotify } from "react-icons/fa";


import './Playlists.css'

import blank from '../../images/blank.png'
function Playlists() {

    const [display, setDisplay] = useState([])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND}/playlists`)
            .then((response) => response.json())
            .then((response) => {
                console.log(response)
                var temp = response.map((x) => {
                    return (
                        <div className="Playlist" key={x.uri}>
                            <div className="temp">
                                {x.image === "none" ? <img src={blank} className="PlaylistCover" /> : <img src={x.image} className="PlaylistCover" />}
                            </div>
                            <div className="PlaylistDetails">
                                <div>
                                    {x.name}
                                </div>
                                <div>
                                    {x.uri}
                                </div>
                            </div>
                        </div>
                    )
                })
                setDisplay(temp)
            })
            .catch((error) => {
                console.error('Error fetching playlists:', error);
            });

    }, [])

    return (
        <div className="Playlists">
            {/* <ul> */}
            {display}
            {/* </ul> */}
        </div>
    )
}

export default Playlists

