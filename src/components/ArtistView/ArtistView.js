import React, { useEffect, useState } from "react";

import PageNavigation from '../pageNavigation/PageNavigation'
import './ArtistView.css'
import { IoPlaySharp } from "react-icons/io5";


function ArtistView(props) {

    const [data, setData] = useState({})
    const [tracks, setTracks] = useState([])
    const [showAll, setShowAll] = useState(false)
    const [hoverTrack, setHoverTrack] = useState(11)


    const handleMouseEnter = (index) => {
        setHoverTrack(index)
        console.log(index)
    }
    const handleMouseLeave = () => {
        setHoverTrack(null)
        console.log("mouse leave")
    }

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
                            <div className="TopTrack" key={index} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                                <div className="TopTrackNumber">
                                    {(hoverTrack !== index) ? index + 1 : <IoPlaySharp />}
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

    }, [props.spotifyId, hoverTrack])

    useEffect(() => {

    }, [showAll, hoverTrack])

    const handleShow = () => {
        if (showAll) { setShowAll(false) }
        else { setShowAll(true) }
    }

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
                    <div className="ArtistHeading">
                        Popular
                        <div>
                            {hoverTrack}
                        </div>
                    </div>
                    <div className="ArtistTracks">
                        <div className="TopTracks">
                            {tracks.slice(0, 5)}
                            {showAll && tracks.slice(5, 10)}
                        </div>
                    </div>
                    <div className="ShowText" onClick={() => { handleShow() }}>
                        {showAll ? "Show Less" : " Show More"}
                    </div>
                </div>
            }
        </div>
    )
}

export default ArtistView
