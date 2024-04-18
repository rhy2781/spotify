import React, { useEffect } from "react";
import { IoPlaySharp } from "react-icons/io5";

import './Header.css'

/**
 * The formatted header
 * 
 * @param {Object} props 
 * @param {string} props.image The source for the image that is to be displayed
 * @param {string} props.uri The uri for the play button in the header 
 * @param {string} props.main The main content
 * @param {string} props.description The description of the content
 * @return {JSX.Element}
 */
function Header(props) {

    useEffect(() => {
        console.log(props.uri)
    }, [props.uri])

    return (
        <div className="Header">
            <div className="HeaderImage">
                <img src={props.image} />
                <div className="HeaderPlayContainer">
                    <div className="HeaderPlay" onClick={() => { props.submitRequest(props.uri) }}>
                        <IoPlaySharp />
                    </div>
                </div>
            </div>
            <div className="HeaderDetails">
                <div className="HeaderMain">
                    {props.main}
                </div>
                <div>
                    {props.description}
                </div>
            </div>
        </div>
    )
}

export default Header