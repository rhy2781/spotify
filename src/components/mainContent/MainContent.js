import React, { useEffect } from "react"

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
            <div>
                <div onClick={() => props.prevPage()}>
                    Testing Previous
                </div>
                <div onClick={() => props.nextPage()}>
                    Testing Next
                </div>
            </div>
        </div>
    )
}

export default MainContent