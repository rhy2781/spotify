import React, { useEffect, useState } from "react";

import PageNavigation from '../components/PageNavigation'
import './ArtistView.css'
import { IoPlaySharp } from "react-icons/io5";
import RowContent from "../components/DisplayRow";
import TrackList from "../components/TrackList";
import Header from "../components/Header";


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


    const fetchData = async (url, setter) => {
        await fetch(url)
            .then((response) => response.json())
            .then((response) => setter(response.items))
            .catch(err => console.log(err))
    }

    // base data for artist
    useEffect(() => {
        // fetchData(`${process.env.REACT_APP_BACKEND}/artist?id=${props.spotifyId}`, setArtistData)
        fetchData(`${process.env.REACT_APP_BACKEND}/artist/tracks?id=${props.spotifyId}`, setTrackData)
        fetchData(`${process.env.REACT_APP_BACKEND}/artist/albums?id=${props.spotifyId}`, setAlbumData)
        fetchData(`${process.env.REACT_APP_BACKEND}/artist/singles?id=${props.spotifyId}`, setSingleData)
        fetchData(`${process.env.REACT_APP_BACKEND}/artist/popular?id=${props.spotifyId}`, setPopularData)
        fetchData(`${process.env.REACT_APP_BACKEND}/artist/appear?id=${props.spotifyId}`, setAppearData)
    }, [props.spotifyId])



    //base data
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

    // Scroll to top whenever render changes

    return (
        <div className="ArtistView">
            {(Object.keys(artistData).length > 0) &&
                <div className="ArtistContent">


                    {/* <div className="ArtistHeader">
                        <div className="ArtistImage">
                            <img src={artistData.images[0].url} />f
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
                        uri={props.currentPageUri}
                        submitRequest={props.submitRequest}
                    // details={artistDetails}
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
                    <div className="ContentDisplay">
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
