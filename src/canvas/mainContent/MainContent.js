import React, { useEffect, useState } from "react"

import './MainContent.css'

import HomeView from "../../mainContentView/homeView/HomeView"
import PlaylistView from "../../mainContentView/playlistView/playlistView"
import ArtistView from "../../mainContentView/ArtistView/ArtistView"
import PageNavigation from "../../components/pageNavigation/PageNavigation"
import AlbumView from "../../mainContentView/AlbumView/AlbumView"

function MainContent(props) {

    const [page, setPage] = useState("")
    const [spotifyId, setSpotifyId] = useState("")

    useEffect(() => {
        const split = props.pages[props.pageIndex].split(':')
        setPage(split[1])
        setSpotifyId(split[2])

    }, [props.pageIndex, props.pages])

    return (
        <div className="MainContent">
            <PageNavigation
                prevPage={props.prevPage}
                nextPage={props.nextPage}
            />
            {page === "home" && <HomeView />}
            {page === "playlist" && <PlaylistView />}
            {page === "track" && <PlaylistView />}
            {page === "artist" && <ArtistView spotifyId={spotifyId} addPage={props.addPage} submitRequest={props.submitRequest} />}
            {page === "album" && <AlbumView />}
        </div>
    )
}

export default MainContent