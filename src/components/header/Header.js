import React, { useEffect } from "react";
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

    useEffect(() => {

    }, [props.image])

    return (
        <div className="Header">
            <div className="HeaderImage">
                <img src={props.image} />
                {/* <div className="PlayContainer">
                    <div className="Play" onClick={() => { props.submitRequest(props.uri) }}>
                        <IoPlaySharp />
                    </div>
                </div> */}
            </div>

            <div className="Details">
                {props.details}
                <div className="Playtest">
                    <div className="Play2" onClick={() => { props.submitRequest(props.uri) }}>
                        <IoPlaySharp />
                    </div>
                    {/* <div>Shuffle Play</div> */}
                </div>
            </div>
        </div>
    )
}

export default Header