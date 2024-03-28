import React, { useEffect, useState } from "react"

import HomeView from "../homeView/HomeView"
import PlaylistView from "../playlistView/playlistView"
import './MainContent.css'
import ArtistView from "../ArtistView/ArtistView"
import PageNavigation from "../pageNavigation/PageNavigation"
import AlbumView from "../AlbumView/AlbumView"

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
            {page === "artist" && <ArtistView spotifyId={spotifyId} addPage={props.addPage} />}
            {page === "album" && <AlbumView />}
        </div>
    )
}

export default MainContent