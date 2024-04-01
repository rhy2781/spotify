import React, { useEffect, useState } from "react";
import { IoPlaySharp } from "react-icons/io5";

import './DisplayRow.css'

/**
 * @param {Object} props 
 * @param {Array.<RowItem>} props.data - An array of objects representing items to display.
 * @param {RequestFunction} props.submitRequest
 * @param {AddPageFunction} props.addPage
 */

/**
 * @typedef {RowItem} 
 * @property {string} uri
 * @property {string} image – the url source of the image to display
 * @property {string} mainText – the main text to display
 * @property {string} subText – additional information 
 */

function RowContent(props) {

    const [display, setDisplay] = useState([])

    useEffect(() => {
        const temp = props.data.map((element, index) => {
            return (
                <div className="RowItem" key={index} onClick={() => props.addPage(element.uri)}>
                    <div className="Inner">
                        <div className="Image">
                            <img src={element.image} />
                            <div className="PContainer">
                                <div className="PlayIcon">
                                    <IoPlaySharp onClick={() => props.submitRequest(element.uri)} />
                                </div>
                            </div>
                        </div>
                        <div className="RowItemMainText">
                            {element.mainText}
                        </div>
                        <div className="RowItemSubText">
                            {element.subText}
                        </div>

                    </div>

                </div>
            )
        })
        while (temp.length < 5) {
            temp.push(
                <div className="RowItemEmpty" key={temp.length} />
            )
        }
        setDisplay(temp.slice(0, 5))
    }, [props.data])

    return (
        <div>
            <div className="Row">
                {display}
            </div>
        </div>
    )
}

export default RowContent