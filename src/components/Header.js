import React, { useEffect, useState } from "react";
import { IoPlaySharp } from "react-icons/io5";

import './Header.css'
/*
data ={
    image: "" url string,
    uri:"" uri string,
    details: jsx element // this way we can configure how everything looks

}
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