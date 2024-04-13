import React, { useEffect, useState } from "react"

import './PlaylistPanel.css'

import blank from '../images/blank.png'

/** 
 * Returns a list of the current user's playlists to display on the side panel
 * @param {Object} props 
 * @param {Function} props.addPage Add a page to history
 * @param {String} props.currentPageUri The current uri of the page history
 * @return {JSX.Element}  
 */
function PlaylistPanel(props) {

    const [playlistData, setPlaylistData] = useState([])
    const [display, setDisplay] = useState([])

    // get playlist data
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND}/user-playlists`)
            .then((response) => response.json())
            .then((response) => setPlaylistData(response))
            .catch((error) => {
                console.error('Error fetching playlists:', error);
            });
    }, [])

    // update the contents to display to the user
    useEffect(() => {
        var temp = playlistData.map((element) => {
            // if this is the current page, style it differently 
            const isSelected = element.uri === props.currentPageUri

            return (
                <div className="Playlist"
                    key={element.uri}
                    style={{ "backgroundColor": isSelected ? "gray" : "" }}
                    onClick={() => props.addPage(element.uri)}
                >
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
        })
        setDisplay(temp)

    }, [props.currentPageUri, playlistData])

    return (
        <div className="PlaylistContainer">
            {display}
        </div>
    )
}

export default PlaylistPanel