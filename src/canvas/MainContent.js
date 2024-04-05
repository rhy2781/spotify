import React, { useEffect, useState } from "react"

import './MainContent.css'

import PageNavigation from "../components/pageNavigation/PageNavigation"

import HomeView from "../mainContentView/homeView/HomeView"
import PlaylistView from "../mainContentView/playlistView/playlistView"
import ArtistView from "../mainContentView/ArtistView/ArtistView"
import AlbumView from "../mainContentView/AlbumView/AlbumView"

/**
 * Renders the main content of the page based on the uri of the current page
 * @param {Object} props 
 * @param {Function} props.addPage Add page to history
 * @param {Function} props.prevPage Go back a page in history 
 * @param {Function} props.nextPage Go forward a page in history
 * @param {Function} props.submitRequest Submit a request to play a spotify uri
 * @param {String} props.currentPageUri The current uri of the page history
 * @param {Object} props.currentTrack The current playing track of the Spotify Playback 
 * @returns {JSX.Element}
 */
function MainContent(props) {

    const [page, setPage] = useState("")
    const [spotifyId , setSpotifyId] = useState("")

    // parse uri to facilitate rendering
    useEffect(() => {
        const temp = props.currentPageUri.split(":")
        setPage(temp[1])
        setSpotifyId(temp[2])
    }, [props.currentPageUri])

    // load different content based off of currentPageUri
    return (
        <div className="MainContent">
            <PageNavigation
                prevPage={props.prevPage}
                nextPage={props.nextPage}
            />
            {page === "home" && <HomeView />}
            {page === "playlist" && <PlaylistView />}
            {page === "track" && <PlaylistView />}
            {page === "artist" && <ArtistView 
                currentPageUri={props.currentPageUri}
                spotifyId={spotifyId} 
                addPage={props.addPage} 
                submitRequest={props.submitRequest} 
                currentTrack={props.currentTrack}/>}
            {page === "album" && <AlbumView />}
        </div>
    )
}

export default MainContent