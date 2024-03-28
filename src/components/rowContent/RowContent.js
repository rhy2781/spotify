import React, { useEffect, useState } from "react";
import { IoPlaySharp } from "react-icons/io5";

import './RowContent.css'

function RowContent(props) {

    const [display, setDisplay] = useState([])

    useEffect(() => {
        const visual = props.data.map((element) => {
            return (
                <div className="RowItem" onClick={() => props.addPage(element.uri)}>
                    <div className="Inner">
                        <div className="Image">
                            <img src={element.image} />
                        </div>
                        <div className="PContainer">
                            <div className="PlayIcon">
                                <IoPlaySharp />
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
            )
        })
        while (visual.length < 5) {
            visual.push(
                <div className="RowItemEmpty" />
            )
        }
        setDisplay(visual.slice(0, 5))
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