import React, { useEffect, useState } from "react"

import './TrackList.css'

import { IoPlaySharp } from "react-icons/io5"

/**
 * @typedef {Object} TrackItem
 * @property {String} name
 * @property {String} uri
 * @property {String} album_uri
 * @property {Number} track_number
 * @property {String} image
 * @property {String} time - The formatted ms time of the track
 */
/**
 * A JSX Element that is being a pain
 * @param {*} props The state ofs sometjlkasdgf
 * @param {number} props.size The size to make the height and width of square components
 * @param {TrackItem[]} props.data A collection of items
 * @returns 
 */

// TODO: continue to document
/**
 * A JSX Element that is being a pain // This one works
 * @param {Object} props The state of something
 * @param {number} props.size The size to make the height and width of square components
 * @param {TrackItem[]} props.data A collection of items
 * @returns {JSX.Element}
 */
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

            const date = new Date(element.added_at).toDateString();
            const formatted_date = date.substring(0, 7) + ", " + date.substring(8, date.length).replace(/^0+/, '')





            return (
                <div className="TopTrack"
                    key={element.uri}
                    style={{
                        "padding": props.padding + "vmin",
                        "height": props.size + "px",
                    }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="TopTrackNumber"
                        style={{
                            "color": element.uri.localeCompare(props.currentTrack.uri) == 0 ? "#44c767" : "white",
                            "width": `${props.size}px`,
                            "height": `${props.size}px`
                        }}
                        onClick={() => { props.submitRequest(element.album_uri, element.track_number) }}
                    >
                        {(hoverTrack !== index) ? index + 1 : <IoPlaySharp />}
                    </div>
                    {props.renderImage &&
                        <div className="TopTrackImageContainer"
                            style={{
                                "width": `${props.size}px`,
                                "height": `${props.size}px`
                            }}
                        >
                            <img src={element.image} alt={element.uri} />
                        </div>
                    }
                    <div className="TopTrackName"
                        style={{
                            "color": element.uri.localeCompare(props.currentTrack.uri) == 0 ? "#44c767" : "white",
                            "max-width": "calc(100% - 150px - 1vmin)" // TODO: How to scale this based on what values we display
                        }}
                    >
                        <div className="temp">
                            {element.name}
                        </div>
                        <div className="temp">
                            {element.artists.map((e) => e.name)}
                        </div>
                    </div>
                    <div onClick={() => props.submitRequest(element.album_uri)}>
                        {element.album_name}
                    </div>
                    <div>
                        {formatted_date}
                    </div>
                    <div className="TopTrackTimeBox"
                        style={{
                            "width": `${props.size}px`,
                            "height": `${props.size}px`
                        }}
                    >
                        <div className="TopTrackTime">
                            {element.time}
                        </div>
                    </div>
                </div>
            )
        })
        setVisual(temp)

    }, [props.data, props.currentTrack, hoverTrack])


    return (
        <div>
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