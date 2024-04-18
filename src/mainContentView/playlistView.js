import { ReactDOM, useEffect, useState } from "react";


import fetchAndEncodeImage from './Color'
function PlaylistView(props) {

    const [color, setColor] = useState([0, 0, 0])
    const [playlistData, setPlaylistData] = useState({})


    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND}/playlists?id=${props.spotifyId}`)
            .then((response) => response.json())
            .then((response) => setPlaylistData(response))
            .catch(err => console.log(err))
        }, [props.spotifyId]
    )

    useEffect(() => {
        console.log(playlistData.image)
        fetchAndEncodeImage(playlistData.image, setColor)
    }, [playlistData])


    return (
        <div className="PlayListView" style={{ backgroundImage: `linear-gradient(rgb(${color[0]}, ${color[1]}, ${color[2]}), #000000)` }}>

            {(Object.keys(playlistData).length > 0) &&
                <div>
                    hello there
                </div>
            }
        </div>
    )

}

export default PlaylistView;