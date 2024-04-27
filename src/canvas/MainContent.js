import React, { useEffect, useState } from "react"

import './MainContent.css'

import PageNavigation from "../components/PageNavigation"
import PlaylistView from "../mainContentView/PlaylistView"
import HomeView from "../mainContentView/HomeView"
import ArtistView from "../mainContentView/ArtistView"
import AlbumView from "../mainContentView/AlbumView"
import SearchView from "../mainContentView/SearchView"

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

    const [color, setColor] = useState([53, 53, 53])
    const [page, setPage] = useState("")
    const [spotifyId, setSpotifyId] = useState("")


    // parse uri to facilitate rendering and data loading
    useEffect(() => {
        const temp = props.currentPageUri.split(":")
        setPage(temp[1])
        setSpotifyId(temp[2])
    }, [props.currentPageUri])

    /**
     * Callback function to change color of main content component based on ColorThief
     * @function 
     * @param {Number[]} c The RGB Color array gained from the child components
     */
    const handleColorChange = (c) => {
        var sum = 0
        c.forEach((value) => sum += value)
        console.log(sum)
        if (sum >= 500) {
            for (var i = 0; i < c.length; i++) {
                c[i] -= 50
            }
        } else if (sum < 150) {
            for (var i = 0; i < c.length; i++) {
                c[i] += 50
            }
        }
        setColor(c)
    }

    // load different content based off of currentPageUri
    return (
        <div
            className="MainContent"
            style={{ background: (page != "home" && page != "search") ? `linear-gradient(rgb(${color[0]}, ${color[1]}, ${color[2]}), #000000)` : "#141414" }}
        >
            <PageNavigation
                prevPage={props.prevPage}
                nextPage={props.nextPage}
            />
            <div className="MainContentView">
                {page === "home" && <HomeView
                    addPage={props.addPage}
                    submitRequest={props.submitRequest}
                    currentTrack={props.currentTrack}

                />}
                {page === "search" && <SearchView />}
                {page === "playlist" && <PlaylistView
                    onColorChange={handleColorChange}

                    currentPageUri={props.currentPageUri}
                    spotifyId={spotifyId}
                    addPage={props.addPage}
                    submitRequest={props.submitRequest}
                    currentTrack={props.currentTrack}
                />}
                {page === "track" && <PlaylistView />}
                {page === "artist" && <ArtistView
                    onColorChange={handleColorChange}

                    currentPageUri={props.currentPageUri}
                    spotifyId={spotifyId}
                    addPage={props.addPage}
                    submitRequest={props.submitRequest}
                    currentTrack={props.currentTrack} />}
                {page === "album" && <AlbumView
                    onColorChange={handleColorChange}

                    spotifyId={spotifyId}
                    currentPageUri={props.currentPageUri}
                    addPage={props.addPage}
                    submitRequest={props.submitRequest}
                    currentTrack={props.currentTrack}
                />}
            </div>
        </div>
    )
}

export default MainContent