import React, { useEffect, useState } from "react"

import './TrackList.css'

import { IoPlaySharp } from "react-icons/io5"

function TrackList(props) {

    const [visual, setVisual] = useState([])
    const [hoverTrack, setHoverTrack] = useState(-1)
    const [showAll, setShowAll] = useState(false)

    const handleMouseEnter = (index) => { setHoverTrack(index) }
    const handleMouseLeave = () => { setHoverTrack(null) }

    const handleShow = () => {
        if (showAll) { setShowAll(false) }
        else { setShowAll(true) }
    }

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
                                <img src={element.image} alt={element.uri} />
                            </div>
                        </div>
                        <div className="TopTrackName">
                            {element.name}
                        </div>
                    </div>
                    <div className="TopTrackTimeBox">
                        <div className="TopTrackTime">
                            {element.time}
                        </div>
                    </div>
                </div>
            )
        })
        setVisual(temp)

    }, [props.data, hoverTrack])


    return (
        <div className="debug">
            {!props.split && visual}
            {props.split && visual.slice(0, visual.length / 2)}
            {props.split && showAll && visual.slice(visual.length / 2, visual.length)}
            {props.split &&
                <div className="ShowText" >
                    <div onClick={() => handleShow()}>
                        {showAll ? "Show Less" : " Show More"}
                    </div>
                </div>
            }
        </div>
    )
}

export default TrackList