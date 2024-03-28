import React, { useEffect, useState } from "react";

import PageNavigation from '../pageNavigation/PageNavigation'
import './ArtistView.css'
import { IoPlaySharp } from "react-icons/io5";
import RowContent from "../rowContent/RowContent";


function ArtistView(props) {

    const [artistData, setArtistData] = useState({})

    // state variables for track display
    const [trackData, setTrackData] = useState([])
    const [tracks, setTracks] = useState([])
    const [showAll, setShowAll] = useState(false)
    const [hoverTrack, setHoverTrack] = useState(11)

    // state variable for album display
    const [albumData, setAlbumData] = useState([])
    const [album, setAlbum] = useState([])


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
                    <div className="Container">
                        <div className="TopTrackNumber" onClick={() => { props.addPage(element.uri) }}>
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
                    </div>
                    <div className="TopTrackTimeBox">
                        <div className="TopTrackTime">
                            {min}:{sec}
                        </div>
                    </div>
                </div>
            )
        })

        setTracks(visual)
    }, [trackData, hoverTrack])

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
                    console.log(response.album)
                })
        }
        getAlbums();

    }, [props.spotifyId])

    useEffect(() => {
        // console.log(albumData)
        const visual = albumData.map((element) => {
            return (
                <div className="Album" onClick={() => props.addPage(element.uri)}>
                    <div className="ArtistCoverArt">
                        <img src={element.images[0].url} />
                    </div>
                    <div className="AlbumName">
                        {element.name}
                    </div>
                    <div className="AlbumDetails">
                        <div>
                            {element.release_date.slice(0, 4)} •
                        </div>
                        <div className="AlbumType">
                            {element.type.charAt(0).toUpperCase() + element.type.slice(1)}
                        </div>
                    </div>
                </div>
            )
        })
        while (visual.length < 5) {
            visual.push(
                <div className="Album">

                </div>
            )
        }
        setAlbum(visual)

    }, [albumData])



    const handleShow = () => {
        if (showAll) { setShowAll(false) }
        else { setShowAll(true) }
    }




    const [temp, setTemp] = useState([])
    useEffect(()=>{
        const tri = albumData.map((element) => {
            return{
                "uri": element.uri,
                "image" : element.images[0].url,
                "mainText" : element.name,
                "subText": `${element.release_date.slice(0, 4)} • ${element.type}` 
            }
        })
        setTemp(tri)
        console.log(tri)
    },[albumData])




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
                    {/* <div className="AlbumTrack">
                        {album}
                    </div> */}

                    <div className="AlbumList">
                        <RowContent data={temp} addPage={props.addPage}/>
                    </div>
                </div>
            }
        </div>
    )
}

export default ArtistView
