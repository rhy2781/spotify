import { ReactDOM, useEffect, useState } from "react";

function PlaylistView(props) {

    const [color, setColor] = useState([0, 0, 0])
    const [data, setData] = useState({})

    useEffect(() => {
        const getData = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND}/playlists?id=${props.spotifyId}`)
                .then((response) => response.json())
                .then((response) => console.log(response))
        }

        console.log(props)
        console.log(props.spotifyId)
        setData(getData())

    }, [props.spotifyId])

    return (
        <div className="PlayListView" style={{ backgroundImage: `linear-gradient(rgb(${color[0]}, ${color[1]}, ${color[2]}), #000000)` }}>
            This is the playlist view
            {data.name}
        </div>
    )

}

export default PlaylistView;