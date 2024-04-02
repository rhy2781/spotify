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
    // const [tracks, setTracks] = useState([])
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
                        <TrackList data={trackData} submitRequest={props.submitRequest} split={true} />
                    </div>
                    <div className="AlbumList">
                        <RowContent data={albumData} addPage={props.addPage} submitRequest={props.submitRequest} />
                    </div>
                </div>
            }
        </div>
    )
}

export default ArtistView
