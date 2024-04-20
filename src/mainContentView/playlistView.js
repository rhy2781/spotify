import { ReactDOM, useEffect, useState } from "react";

import Header from '../components/Header'
import fetchAndEncodeImage from './Color'
import TrackList from "../components/TrackList";

import './PlaylistView.css'

// TODO: document
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
            .then((response) => {
                setPlaylistData(response)
            })
            .catch(err => console.log(err))
    }, [props.spotifyId]
    )

    useEffect(() => {
        fetchAndEncodeImage(playlistData.image, setColor)
    }, [playlistData])


    return (
        <div className="PlaylistView" style={{ backgroundImage: `linear-gradient(rgb(${color[0]}, ${color[1]}, ${color[2]}), #000000)` }}>

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
                        renderImage={true}
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