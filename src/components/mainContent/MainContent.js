import React, { useEffect, useState } from "react"

import HomeView from "../homeView/HomeView"
import PlaylistView from "../playlistView/playlistView"
import './MainContent.css'
import ArtistView from "../ArtistView/ArtistView"

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
            {page === "home" && <HomeView />}
            {page === "playlist" && <PlaylistView />}
            {page === "track" && <PlaylistView />}
            {page === "artist" && <ArtistView spotifyId={spotifyId} addPage={props.addPage}/>}
        </div>
    )
}

export default MainContent