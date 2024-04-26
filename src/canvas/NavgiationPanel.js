import React from "react";

import "./NavigationPanel.css"
import { IoHome, IoSearch } from "react-icons/io5";


function NavigationPanel(props) {
    return (
        <div className="NavigationPanel">
            <div className="NavigationContent">
                <div
                    className="NavigationButton"
                    onClick={() => props.addPage("spotify:home")}
                    style={{
                        "backgroundColor": props.currentPageUri === "spotify:home" ? "gray" : ""
                    }}
                >
                    <IoHome />Home
                </div>
                <div
                    className="NavigationButton"
                    onClick={() => props.addPage("spotify:search")}
                    style={{
                        "backgroundColor": props.currentPageUri === "spotify:search" ? "gray" : ""
                    }}
                >
                    <IoSearch /> Search
                </div>
            </div>
        </div >
    )
}

export default NavigationPanel;