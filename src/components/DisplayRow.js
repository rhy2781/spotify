import React, { useEffect, useState } from "react";
import { IoPlaySharp } from "react-icons/io5";

import './DisplayRow.css'

/**
 * @typedef {Object} RowItem
 * @property {string} uri – the spotify uri of the item
 * @property {string} image – the url source of the image to display
 * @property {string} mainText – the main text to display
 * @property {string} subText – additional information 
 */
/**
 * A JSX Element displaying a row of content allowing the user to view images and pick and choose what to play 
 * @param {Object} props 
 * @param {RowItem[]} props.data An array of objects representing items to display.
 * @param {Function} props.submitRequest Submits a request to play a desired spotify uri
 * @param {Function} props.addPage Adds a spotify uri string page history
 * @return {JSX.Element}
 */
function RowContent(props) {

    const [display, setDisplay] = useState([])

    // visually map the data array
    useEffect(() => {
        const temp = props.data.map((element, index) => {
            return (
                <div className={`RowItem${index + 1}`} key={index} onClick={() => props.addPage(element.uri)}>
                    <div className="Inner">
                        <div className="Image">
                            <img src={element.image} />
                            <div className={`PContainer${index + 1}`}>
                                <div className="PlayIcon" onClick={(e) => e.stopPropagation()}>
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

        // pad the row with empty items
        var index = temp.length
        while (temp.length < 11) {
            temp.push(
                <div className={`RowItemEmpty${index + 1}`} key={temp.length} />
            )
            index += 1
        }
        setDisplay(temp.slice(0, 10))
    }, [props.data])

    return (
        <div className="Row">
            {display}
        </div>
    )
}

export default RowContent