import React, { useEffect, useState } from "react";

import PageNavigation from '../../components/pageNavigation/PageNavigation'
import './ArtistView.css'
import { IoPlaySharp } from "react-icons/io5";
import RowContent from "../../components/rowContent/DisplayRow";


function ArtistView(props) {

    const [artistData, setArtistData] = useState({})

    // state variables for track display
    const [trackData, setTrackData] = useState([])
    const [tracks, setTracks] = useState([])
    const [showAll, setShowAll] = useState(false)
    const [hoverTrack, setHoverTrack] = useState(11)

    // state variable for album display
    const [albumData, setAlbumData] = useState([])


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

    //TODO 
    // get new data for artist top tracks
    useEffect(() => {
        const getTopTracks = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND}/artist/tracks?id=${props.spotifyId}`, {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((response) => {
                    setTrackData(response.tracks)
                })
                .catch(err => console.log(err))
        }
        getTopTracks()

    }, [props.spotifyId])

    // TODO
    // visually update with cached data, and state update with hover variable
    // useEffect(() => {
    //     console.log(trackData)
    //     const visual = trackData.map((element, index) => {
    //         const min = Math.floor((element.duration_ms / 1000) / 60)
    //         const sec = Math.floor((element.duration_ms / 1000) % 60).toString().padStart(2, '0')

    //         return (
    //             <div className="TopTrack" key={index} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
    //                 <div className="Container">
    //                     <div className="TopTrackNumber" onClick={() => { props.submitRequest(element.album.uri, element.track_number) }}>
    //                         {(hoverTrack !== index) ? index + 1 : <IoPlaySharp />}
    //                     </div>
    //                     <div className="TopTrackImage">
    //                         <div className="TopTrackImageContainer">
    //                             <img src={element.album.images[0].url} alt={element.uri} />
    //                         </div>
    //                     </div>
    //                     <div className="TopTrackName">
    //                         {element.name}
    //                     </div>
    //                 </div>
    //                 <div className="TopTrackTimeBox">
    //                     <div className="TopTrackTime">
    //                         {min}:{sec}
    //                     </div>
    //                 </div>
    //             </div>
    //         )
    //     })

    //     setTracks(visual)
    // }, [trackData, hoverTrack])

    // get album data for artist
    useEffect(() => {
        const getAlbums = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND}/artist/albums?id=${props.spotifyId}`, {
                headers: {
                    method: 'GET'
                }
            })
                .then((response) => response.json())
                .then((response) => {
                    setAlbumData(response.album)
                })
                .catch(err => console.log(err))
        }
        getAlbums();

    }, [props.spotifyId])


    const handleShow = () => {
        if (showAll) { setShowAll(false) }
        else { setShowAll(true) }
    }

    return (
        <div className="ArtistView">
            {(Object.keys(artistData).length > 0) &&
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
                    </div>
                    {/* <div className="ArtistTracks">
                        <div className="TopTracks">
                            {tracks.slice(0, 5)}
                            {showAll && tracks.slice(5, 10)}
                        </div>
                    </div>
                    <div className="ShowText" onClick={() => { handleShow() }}>
                        {showAll ? "Show Less" : " Show More"}
                    </div> */}

                    <div className="AlbumList">
                        <RowContent data={albumData} addPage={props.addPage} submitRequest={props.submitRequest} />
                    </div>
                </div>
            }
        </div>
    )
}

export default ArtistView
