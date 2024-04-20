import React, { useEffect, useState } from "react"

import './TrackList.css'

import { IoPlaySharp } from "react-icons/io5"
import Artists from './Artists'

/**
 * @typedef {Object} Artist
 * @property {String} name The name of the artist
 * @property {String} uri The uri of the Artist
 */
/**
 * @typedef {Object} TrackItem
 * @property {String} name The name of the track
 * @property {String} uri The uri of the track
 * @property {Artist[]} artists The artists that performed on the tracks
 * @property {String} album_uri The uri of the album that the track is a part of
 * @property {String} album_name The name of the album that the track is a part of
 * @property {Number} track_number The number that the track is on the album
 * @property {String} image An image for the track
 * @property {String} added_at The string[date-time] that the object was added into the playlist
 * @property {String} time The formatted minute:second string that represents the full time of the track
 */
/**
 * This is a jsx element that display a list of tracks to the user. There are several prop parameters that allow the
 * the developer to customize the look of this element
 * @param {Object} props
 * @param {number} props.height The size to make the height and scale the width of components
 * @param {number} props.padding The number of vmin to apply to the padding surrounding each track in the view
 * @param {boolean} props.split This boolean indicates whether or not to display only half of the items in the list
 * @param {Function} props.submitRequest Submit a request to play a song through the web playback
 * @param {Function} props.addPage Insert a new page to the page history
 * @param {TrackItem[]} props.data A collection of tracks to display to the user
 * @return {JSX.Element}
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
                <div className="Track"
                    key={element.uri}
                    style={{
                        "padding": props.padding + "vmin",
                        "height": props.height + "px",
                        "color": element.uri.localeCompare(props.currentTrack.uri) == 0 ? "#44c767" : "white",
                    }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="TrackNumber"
                        style={{
                            "width": `${props.height}px`
                        }}
                        onClick={() => { props.submitRequest(element.album_uri, element.track_number) }}
                    >
                        {(hoverTrack !== index) ? index + 1 : <IoPlaySharp />}
                    </div>
                    {element.image &&
                        <div className="TrackImageContainer"
                            style={{
                                "width": `${props.height}px`,
                            }}
                        >
                            <img src={element.image} alt={element.uri} />
                        </div>
                    }
                    <div className="TrackMainDescription"
                        style={{
                            "color": element.uri.localeCompare(props.currentTrack.uri) == 0 ? "#44c767" : "white",
                            "width": `calc(((100% - ${3 * props.height}px - 2vmin) / 5)* 2`
                        }}
                    >
                        <div className="TrackName">
                            {element.name}
                        </div>
                        {element.artists &&
                            <div className="TrackArtists">
                                <Artists
                                    artists={element.artists}
                                    addPage={props.addPage}
                                />
                            </div>
                        }
                    </div>
                    {element.album_name &&
                        <div
                            className="TrackAlbumContainer"
                            style={{
                                "width": `calc(((100% - ${3 * props.height}px - 2vmin) / 5) * 2`
                            }}
                        >
                            <div className="TrackAlbum" onClick={() => props.submitRequest(element.album_uri)}>
                                {element.album_name}
                            </div>
                        </div>
                    }
                    {element.added_at &&
                        <div className="TrackDate"
                            style={{
                                "width": `calc(((100% - ${3 * props.height}px - 2vmin) / 5) * 1`
                            }}
                        >
                            {formatted_date.substring(4, formatted_date.length)}
                        </div>
                    }
                    < div className="TrackTimeContainer"
                        style={{
                            "width": `${props.height}px`,
                        }}
                    >
                        <div className="TrackTime">
                            {element.time}
                        </div>
                    </div >
                </div >
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