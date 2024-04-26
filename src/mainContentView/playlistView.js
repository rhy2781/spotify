import { ReactDOM, useEffect, useState } from "react";


import PageNavigation from "../components/PageNavigation";
import Header from '../components/Header'
import fetchAndEncodeImage from './Color'
import TrackList from "../components/TrackList";

import './PlaylistView.css'

// 

//TODO: Document
/**
 * @param {} props 
 * @returns 
 */
function PlaylistView(props) {

    const [color, setColor] = useState([0, 0, 0])
    const [playlistData, setPlaylistData] = useState({})


    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND}/playlists?id=${props.spotifyId}`)
            .then((response) => response.json())
            .then((response) => setPlaylistData(response))
            .catch(err => console.log(err))
    }, [props.spotifyId]
    )

    useEffect(() => {
        fetchAndEncodeImage(playlistData.image, setColor)
    }, [playlistData])

    useEffect(() => {
        props.onColorChange(color)
    }, [color])


    return (
        <div className="PlaylistView">
            {(Object.keys(playlistData).length > 0) &&
                <div className="PlayListContent">
                    <Header
                        image={playlistData.image}
                        uri={props.currentPageUri}
                        main={playlistData.name}
                        description={""}
                        submitRequest={props.submitRequest}
                    />
                    <TrackList
                        data={playlistData.tracks}
                        currentTrack={props.currentTrack}
                        split={false}
                        submitRequest={props.submitRequest}
                        padding={0.5}
                        addPage={props.addPage}
                        height={50}
                    />
                </div>
            }
        </div>
    )

}

export default PlaylistView;