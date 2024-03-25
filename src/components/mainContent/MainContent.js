import React, { useEffect } from "react"

import PageNavigation from "../pageNavigation/PageNavigation"
import './MainContent.css'

function MainContent(props) {

    useEffect(() => {

    }, [props.pageIndex, props.pages])

    return (
        <div className="MainContent">
            <div>
                {/* This is the main content. */}
                {props.pages.map((p) => p + " /")}
                {props.pageIndex}
            </div>
        </div>
    )
}

export default MainContent