import React from "react";

import "./NavigationPanel.css"
import { IoHome, IoSearch } from "react-icons/io5";


function NavigationPanel(props) {
    return (
        <div className="NavigationPanel">
            <div className="NavigationContent">
                <div className="NavigationButton">
                    <IoHome />Home
                </div>
                <div className="NavigationButton">
                    <IoSearch/> Search
                </div>
            </div>
        </div>
    )
}

export default NavigationPanel;