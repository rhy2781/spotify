import React, { useEffect, useState } from "react"

function TrackList(props) {
    // TODO

    const [visual, setVisual] = useState([])
    const [hoverTrack, setHoverTrack] = useState(-1)

    useEffect(() => {
        const temp = props.data.map((element, index) => {
            return (
                <div className="TopTrack" key={element.uri} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                    <div className="Container">
                        <div className="TopTrackNumber" onClick={() => { props.submitRequest(element.album_uri, element.track_number) }}>
                            {(hoverTrack !== index) ? index + 1 : <IoPlaySharp />}
                        </div>
                        <div className="TopTrackImage">
                            <div className="TopTrackImageContainer">
                                <img src={element.album.image} alt={element.uri} />
                            </div>
                        </div>
                        <div className="TopTrackName">
                            {element.name}
                        </div>
                    </div>
                    <div className="TopTrackTimeBox">
                        <div className="TopTrackTime">
                            {min}:{sec}
                        </div>
                    </div>
                </div>
            )
        })

    }, [props.data])


    return (
        <div>


        </div>
    )
}

export default TrackList