import React from "react";
import { IoPlaySharp } from "react-icons/io5";

import './Header.css'

/**
 * The formatted header for an Artist
 * 
 * @param {Object} props 
 * @param {string} props.image The source for the artist's image 
 * @param {string} props.uri The spotify uri for the artist 
 * @param {string} props.name The name of the artist
 * @param {string} props.followers The number of followers of the artist 
 * @return {JSX.Element}
 */
function Header(props) {
    return (
        <div className="Header">
            <div className="HeaderImage">
                <img src={props.image} />
                <div className="PlayContainer">
                    <div className="Play2" onClick={() => { props.submitRequest(props.uri) }}>
                        <IoPlaySharp />
                    </div>
                </div>
            </div>
            <div className="ArtistDetails">
                <div className="ArtistName">
                    {props.name}
                </div>
                <div>
                    {props.followers.toLocaleString()} Followers
                </div>
            </div>
        </div>
    )
}

export default Header