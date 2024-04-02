import React, { useEffect, useState } from "react";

import PageNavigation from '../../components/pageNavigation/PageNavigation'
import './ArtistView.css'
import { IoPlaySharp } from "react-icons/io5";
import RowContent from "../../components/rowContent/DisplayRow";
import TrackList from "../../components/trackList/TrackList";


function ArtistView(props) {

    const [artistData, setArtistData] = useState({})

    // state variables for track display
    const [trackData, setTrackData] = useState([])

    // state variable for album display
    const [albumData, setAlbumData] = useState([])

    const [singleData, setSingleData] = useState([])
    const [popularData, setPopularData] = useState([])


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

    // get album data for artist
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
                    <div>
                        <TrackList data={trackData} submitRequest={props.submitRequest} split={true} currentTrack={props.currentTrack} />
                    </div>
                    <div>
                        {popularData && <RowContent data={popularData} addPage={props.addPage} submitRequest={props.submitRequest} />}
                    </div>
                    <div className="AlbumList">
                        {albumData && <RowContent data={albumData} addPage={props.addPage} submitRequest={props.submitRequest} />}
                    </div>
                    <div>
                        {singleData && <RowContent data={singleData} addPage={props.addPage} submitRequest={props.submitRequest} />}
                    </div>
                </div>
            }
        </div>
    )
}

export default ArtistView
