import React, { useEffect, useState } from "react"

import HomeView from "../homeView/HomeView"
import PlaylistView from "../playlistView/playlistView"
import './MainContent.css'
import ArtistView from "../ArtistView/ArtistView"

function MainContent(props) {

    const [page, setPage] = useState("")

    useEffect(() => {
        setPage(props.pages[props.pageIndex].split(':')[1])
    }, [props.pageIndex, props.pages])

    return (
        <div className="MainContent">
            {page === "home" && <HomeView />}
            {page === "playlist" && <PlaylistView />}
            {page === "artist" && <ArtistView />}
        </div>
    )
}

export default MainContent