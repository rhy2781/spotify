import React, { useEffect, useState } from "react";

import PageNavigation from '../pageNavigation/PageNavigation'
import './ArtistView.css'

function ArtistView(props) {

    const [data, setData] = useState({})
    const [tracks, setTracks] = useState([])

    useEffect(() => {
        const getData = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND}/artist?id=${props.spotifyId}`, {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((response) => {
                    console.log(response)
                    setData(response)
                })
        }
        getData()

        const getTopTracks = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND}/artist/tracks?id=${props.spotifyId}`, {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((response) => {
                    console.log("tracks")
                    console.log(response)
                    const view = response.tracks.map((element, index) => {
                        const min = Math.floor((element.duration_ms / 1000) / 60)
                        const sec = Math.floor((element.duration_ms / 1000) % 60).toString().padStart(2, '0')
                        return (
                            <div className="TopTrack" key={index}>
                                <div className="TopTrackNumber">
                                    {index + 1}
                                </div>
                                <div className="TopTrackImage">
                                    <div className="TopTrackImageContainer">
                                        <img src={element.album.images[0].url} alt={element.uri} />
                                    </div>
                                </div>
                                <div className="TopTrackName">
                                    {element.name}
                                </div>
                                <div className="TopTrackTime">
                                    {min}:{sec}
                                </div>
                            </div>
                        )
                    })
                    setTracks(view)
                })
        }
        getTopTracks()

    }, [props.spotifyId])

    return (
        <div className="ArtistView">
            {(Object.keys(data).length > 0 && Object.keys(tracks).length > 0) &&
                <div>
                    <div className="ArtistHeader">
                        <div className="ArtistImage">
                            <img src={data.images[0].url} />
                        </div>
                        <div className="ArtistDetails">
                            <div className="ArtistName">
                                {data.name}
                            </div>
                            <div>
                                {data.followers.toLocaleString()} Followers
                            </div>
                        </div>
                    </div>
                    <div className="ArtistTracks">
                        <div className="TopTracks">
                            {tracks}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default ArtistView
