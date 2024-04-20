import { React, useState, useEffect } from "react";
import Header from "../components/Header";

import './AlbumView.css'
import TrackList from "../components/TrackList";
import fetchAndEncodeImage from "./Color";

/**
 * 
 * @param {Object} props 
 * @param {String} props.currentPageUri
 * @param {String} props.spotifyId The spotify id associated with the album
 * @param {} props.currentTrack
 * @param {Function} props.addPage Add a page to the page history
 * @param {Function} props.submitRequest Submit a play request to the web playback
 * 
 * 
 * @returns 
 */
function AlbumView(props) {

    const [color, setColor] = useState([0, 0, 0])
    const [albumData, setAlbumData] = useState({})

    useEffect(async () => {
        await fetch(`${process.env.REACT_APP_BACKEND}/album?id=${props.spotifyId}`)
            .then((response) => response.json())
            .then((response) => setAlbumData(response))
            .catch(err => console.log(err))
    }, [props.spotifyId])

    useEffect(() => {
        fetchAndEncodeImage(albumData.image, setColor)
    }, [albumData])


    return (
        <div className="AlbumView" style={{ backgroundImage: `linear-gradient(rgb(${color[0]}, ${color[1]}, ${color[2]}), #000000)` }}>
            {(Object.keys(albumData).length > 0 &&
                <div>
                    <Header
                        image={albumData.image}
                        uri={albumData.uri}
                        main={albumData.name}
                        description={albumData.date}
                    />
                    <TrackList
                        data={albumData.tracks}
                        currentTrack={props.currentTrack}
                        split={false}
                        submitRequest={props.submitRequest}
                        padding={0.5}
                        addPage={props.addPage}
                        height={50}
                    />
                    <div className="Copyrights">
                        <div>
                            {albumData.label}
                        </div>
                        {albumData.copyrights.map((copyright) => {
                            return (
                                <div>
                                    {copyright.text}
                                </div>
                            )
                        }
                        )}
                    </div>

                </div>
            )}
        </div>
    )
}

export default AlbumView;