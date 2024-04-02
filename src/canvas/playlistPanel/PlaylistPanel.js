import React, { useEffect, useState } from "react"

import './PlaylistPanel.css'

import blank from '../../images/blank.png'

function Playlists(props) {
    const [playlistData, setPlaylistData] = useState([])
    const [display, setDisplay] = useState([])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND}/playlists`)
            .then((response) => response.json())
            .then((response) => setPlaylistData(response))
            .catch((error) => {
                console.error('Error fetching playlists:', error);
            });
    }, [])

    useEffect(() => {
        var temp = playlistData.map((element) => {

            if (element.uri.localeCompare(props.pages[props.pageIndex]) == 0) {
                return (
                    <div className="Playlist" style={{ "backgroundColor": "gray" }} key={element.uri} onClick={() => props.addPage(element.uri)}>
                        <div className="temp">
                            {element.image === "none" ? <img src={blank} className="PlaylistCover" /> : <img src={element.image} className="PlaylistCover" />}
                        </div>
                        <div className="PlaylistDetails">
                            <div>
                                {element.name}
                            </div>
                            <div>
                                selected
                            </div>
                        </div>
                    </div>
                )
            }
            else {
                return (
                    <div className="Playlist" key={element.uri} onClick={() => props.addPage(element.uri)}>
                        <div className="temp">
                            {element.image === "none" ? <img src={blank} className="PlaylistCover" /> : <img src={element.image} className="PlaylistCover" />}
                        </div>
                        <div className="PlaylistDetails">
                            <div>
                                {element.name}
                            </div>
                        </div>
                    </div>
                )
            }
        })
        setDisplay(temp)

    }, [props.pageIndex, playlistData])




    return (
        <div className="PlaylistContainer">
            {display}
        </div>
    )
}

export default Playlists

