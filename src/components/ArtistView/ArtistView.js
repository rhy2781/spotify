import React, { useEffect, useState } from "react";

import PageNavigation from '../pageNavigation/PageNavigation'
import './ArtistView.css'
import { IoPlaySharp } from "react-icons/io5";


function ArtistView(props) {

    const [artistData, setArtistData] = useState({})
    const [trackData, setTrackData] = useState([])


    const [tracks, setTracks] = useState([])
    const [showAll, setShowAll] = useState(false)
    const [hoverTrack, setHoverTrack] = useState(11)


    const handleMouseEnter = (index) => { setHoverTrack(index) }
    const handleMouseLeave = () => { setHoverTrack(null) }


    // get base data for artist
    useEffect(() => {
        const getData = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND}/artist?id=${props.spotifyId}`, {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((response) => {
                    setArtistData(response)
                })
        }
        getData()
    }, [props.spotifyId])

    // get new data for artist top tracks
    useEffect(() => {
        const getTopTracks = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND}/artist/tracks?id=${props.spotifyId}`, {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((response) => {
                    setTrackData(response.tracks)
                    console.log(response.tracks)
                })
        }
        getTopTracks()

    }, [props.spotifyId])

    // visually update with cached data, and state update with hover variable
    useEffect(() => {
        const visual = trackData.map((element, index) => {
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

        setTracks(visual)
    }, [trackData, hoverTrack])

    const handleShow = () => {
        if (showAll) { setShowAll(false) }
        else { setShowAll(true) }
    }

    return (
        <div className="ArtistView">
            {(Object.keys(artistData).length > 0 && Object.keys(tracks).length > 0) &&
                <div>
                    <div className="ArtistHeader">
                        <div className="ArtistImage">
                            <img src={artistData.images[0].url} />
                        </div>
                        <div className="ArtistDetails">
                            <div className="ArtistName">
                                {artistData.name}
                            </div>
                            <div>
                                {artistData.followers.toLocaleString()} Followers
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
