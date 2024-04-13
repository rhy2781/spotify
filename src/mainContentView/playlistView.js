import { ReactDOM, useEffect, useState } from "react";

function PlaylistView(props) {

    const [color, setColor] = useState([0, 0, 0])

    // useEffect(() => {
    //     const getData = async () => {
    //         await fetch(`${process.env.REACT_APP_BACKEND}/`)
    //     }

    // }, [props.spotifyId])

    return (
        <div className="PlayListView" style={{ backgroundImage: `linear-gradient(rgb(${color[0]}, ${color[1]}, ${color[2]}), #000000)` }}>
            This is the playlist view
            {props.currentPageUri}
        </div>
    )

}

export default PlaylistView;