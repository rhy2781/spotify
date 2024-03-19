import React from "react"

import './MainContent.css'

function MainContent(props) {

    return (
        <div className="MainContent">
            {/* This is the main content. */}
            {props.pages.map((p) => p + " /")}
        </div>
    )
}

export default MainContent