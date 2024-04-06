import React from "react"
import { IoArrowForwardSharp, IoArrowBackSharp } from "react-icons/io5";

import './PageNavigation.css'

function PageNavigation(props) {
    return (
        <div className="PageNavigation">
            <div className="NavigationBox">
                <div className="NavigationCircle" onClick={() => { props.prevPage() }}>
                    <IoArrowBackSharp />
                </div>
            </div>
            <div className="Spacer" />
            <div className="NavigationBox">
                <div className="NavigationCircle" onClick={() => { props.nextPage() }}>
                    <IoArrowForwardSharp />
                </div>
            </div>
        </div>
    )

}

export default PageNavigation