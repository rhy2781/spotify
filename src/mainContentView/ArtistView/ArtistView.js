import React, { useEffect, useState, useRef } from "react";

import PageNavigation from '../../components/pageNavigation/PageNavigation'
import './ArtistView.css'
import { IoPlaySharp } from "react-icons/io5";
import RowContent from "../../components/rowContent/DisplayRow";
import TrackList from "../../components/trackList/TrackList";
import Header from "../../components/header/Header";


function ArtistView(props) {

    const [artistData, setArtistData] = useState({})
    const [artistDetails, setArtistDetails] = useState(null)

    // state variables for track display
    const [trackData, setTrackData] = useState([])

    // state variable for album display
    const [albumData, setAlbumData] = useState([])

    const [singleData, setSingleData] = useState([])
    const [popularData, setPopularData] = useState([])
    const [appearData, setAppearData] = useState([])

    const [render, setRender] = useState(0)
    const handleRender = (index) => { setRender(index) }



    // get base data for artist
    useEffect(() => {
        const getData = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND}/artist?id=${props.spotifyId}`, {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((response) => {
                    setArtistData(response)
                    const temp =
                        (<div className="ArtistDetails">
                            <div className="ArtistName">
                                {response.name}
                            </div>
                            <div>
                                {response.followers.toLocaleString()} Followers
                            </div>
                        </div>)
                    setArtistDetails(temp)
                })
        }
        getData()
    }, [props.spotifyId])

    // get data for artist top tracks
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

    // get single data for artist
    useEffect(() => {
        const getSingles = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND}/artist/singles?id=${props.spotifyId}`, {
                headers: {
                    method: 'GET'
                }
            })
                .then((response) => response.json())
                .then((response) => {
                    setSingleData(response.singles)
                })
                .catch(err => console.log(err))
        }
        getSingles()
    }, [props.spotifyId])

    // get popular data for artist
    useEffect(() => {
        const getSingles = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND}/artist/popular?id=${props.spotifyId}`, {
                headers: {
                    method: 'GET'
                }
            })
                .then((response) => response.json())
                .then((response) => {
                    setPopularData(response.popular)
                })
                .catch(err => console.log(err))
        }
        getSingles()
    }, [props.spotifyId])

    // get appears on data for artist
    useEffect(() => {
        const getAppear = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND}/artist/appear?id=${props.spotifyId}`, {
                headers: {
                    method: 'GET'
                }
            })
                .then((response) => response.json())
                .then((response) => {
                    setAppearData(response.appear)
                })
                .catch(err => console.log(err))
        }
        getAppear()
    }, [props.spotifyId])




    // Scroll to top whenever render changes

    return (
        <div className="ArtistView">
            {(Object.keys(artistData).length > 0) &&
                <div className="ArtistContent">


                    {/* <div className="ArtistHeader">
                        <div className="ArtistImage">
                            <img src={artistData.images[0].url} />
                            <div className="ArtistPlayContainer">
                                <div className="ArtistPlay" onClick={() => {
                                    props.submitRequest(props.uri)
                                }
                                }>
                                    <IoPlaySharp />
                                </div>
                            </div>
                        </div>

                        <div className="ArtistDetails">
                            <div className="ArtistName">
                                {artistData.name}
                            </div>
                            <div>
                                {artistData.followers.toLocaleString()} Followers
                            </div>
                        </div>
                    </div> */}

                    <Header
                        image={artistData.image}
                        uri={props.uri}
                        details={artistDetails}
                    />



                    <div className="ArtistHeading">
                        Top Tracks
                    </div>
                    <div>
                        <TrackList data={trackData} submitRequest={props.submitRequest} split={true} currentTrack={props.currentTrack} />
                    </div>
                    <div className="ArtistHeading">
                        Discography
                    </div>
                    <div className="RenderOptions">
                        <div className="RenderContainer" >
                            <div className="RenderOption" onClick={() => handleRender(0)} style={{ "backgroundColor": (render == 0) ? 'gray' : '' }}>
                                Popular
                            </div>
                        </div>
                        <div className="RenderContainer">
                            <div className="RenderOption" onClick={() => handleRender(1)} style={{ "backgroundColor": (render == 1) ? 'gray' : '' }}>
                                Album
                            </div>
                        </div>
                        <div className="RenderContainer">
                            <div className="RenderOption" onClick={() => handleRender(2)} style={{ "backgroundColor": (render == 2) ? 'gray' : '' }}>
                                Single
                            </div>
                        </div>
                    </div>
                    <div className="ContentDisplay" ref={containerRef}>
                        {render == 0 && popularData && <RowContent data={popularData} addPage={props.addPage} submitRequest={props.submitRequest} />}
                        {render == 1 && albumData && <RowContent data={albumData} addPage={props.addPage} submitRequest={props.submitRequest} />}
                        {render == 2 && singleData && <RowContent data={singleData} addPage={props.addPage} submitRequest={props.submitRequest} />}
                    </div>
                    <div className="ArtistHeading">
                        Appears On
                    </div>
                    <div>
                        {appearData && <RowContent data={appearData} addPage={props.addPage} submitRequest={props.submitRequest} />}
                    </div>
                </div>
            }
        </div>
    )
}

export default ArtistView
