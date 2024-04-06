import React from "react"
import { IoArrowForwardSharp, IoArrowBackSharp } from "react-icons/io5";

import './PageNavigation.css'

/**
 * 
 * @param {Object} props 
 * @param {Function} prevPage Moves the display to the previous page in the history
 * @param {Function} nextPage Moves the display to the next page in the history
 * @returns {JSX.Element}
 */
function PageNavigation(props) {
    return (
        <div className="PageNavigation">
            <div className="NavigationBox">
                <div className="NavigationCircle" onClick={props.prevPage}>
                    <IoArrowBackSharp />
                </div>
            </div>
            <div className="Spacer" />
            <div className="NavigationBox">
                <div className="NavigationCircle" onClick={props.nextPage}>
                    <IoArrowForwardSharp />
                </div>
            </div>
        </div>
    )

}

export default PageNavigation