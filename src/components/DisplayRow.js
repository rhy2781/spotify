import React, { useEffect, useState } from "react";
import { IoPlaySharp } from "react-icons/io5";

import './DisplayRow.css'

/**
 * @param {Object} props 
 * @param {RowItem[]} props.data An array of objects representing items to display.
 * @param {Function} props.submitRequest Submits a request to play a desired spotify uri
 * @param {Function} props.addPage Adds a spotify uri string page history
 */

/**
 * @typedef {RowItem} 
 * @property {string} uri – the spotify uri of the item
 * @property {string} image – the url source of the image to display
 * @property {string} mainText – the main text to display
 * @property {string} subText – additional information 
 */

function RowContent(props) {

    const [display, setDisplay] = useState([])

    // visually map the data array
    useEffect(() => {
        const temp = props.data.map((element, index) => {
            return (
                <div className="RowItem" key={index} onClick={() => props.addPage(element.uri)}>
                    <div className="Inner">
                        <div className="Image">
                            <img src={element.image} />
                            <div className="PContainer">
                                <div className="PlayIcon" onClick={(e) => e.stopPropagation()}>
                                    <IoPlaySharp onClick={() => props.submitRequest(element.uri)} />
                                </div>
                            </div>
                        </div>
                        <div className="RowItemText">
                            <div className="RowItemMainText">
                                {element.mainText}
                            </div>
                            <div className="RowItemSubText">
                                {element.subText}
                            </div>
                        </div>

                    </div>
                </div>
            )
        })
        
        // pad the row with empty items
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