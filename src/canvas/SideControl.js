import { React, useEffect, useState } from "react";
import { IoVolumeMuteSharp, IoVolumeOffSharp, IoVolumeLowSharp, IoVolumeMediumSharp, IoVolumeHighSharp } from "react-icons/io5";

import './SideControl.css'

function SideControl(props) {

    const [icon, setIcon] = useState(null)

    useEffect(() => {
        if (props.volume === 0) {
            setIcon(<IoVolumeMuteSharp />)
        }
        else if (props.volume < 0.25) {
            setIcon(<IoVolumeOffSharp />)
        }
        else if (props.volume < 0.50) {
            setIcon(<IoVolumeLowSharp />)
        }
        else if (props.volume < 0.75) {
            setIcon(<IoVolumeMediumSharp />)
        }
        else {
            setIcon(<IoVolumeHighSharp />)
        }

        /* style for volume input range */

        const slider = document.querySelector(".VolumeInputSlider")
        // slider remains green during input
        const handleSliderInput = (event) => {
            var temp = (event.target.valueAsNumber / 1) * 100
            slider.style.background = `linear-gradient(to right, #44c767 ${temp}%, #535353 ${temp}%)`
        };
        slider.addEventListener("input", handleSliderInput)

        const container = document.querySelector(".VolumeInputContainer")
        // slider turns green when mouse over
        const handleContainerMouseEnter = () => {
            var temp = (slider.valueAsNumber / 1) * 100
            slider.style.background = `linear-gradient(to right, #44c767 ${temp}%, #535353 ${temp}%)`
        }
        container.addEventListener("mouseenter", handleContainerMouseEnter)


        //slider turns white when mouse leave
        const handleContainerMouseLeave = () => {
            var temp = (slider.valueAsNumber / 1) * 100
            slider.style.background = `linear-gradient(to right, #ffffff ${temp}%, #535353 ${temp}%)`
        }
        container.addEventListener("mouseleave", handleContainerMouseLeave)

        return () => {
            slider.removeEventListener("input", handleSliderInput);
            slider.removeEventListener("mouseenter", handleContainerMouseEnter);
            slider.removeEventListener("mouseleave", handleContainerMouseLeave);
        }

    }, [props.volume])

    useEffect(() => {
        const slider = document.querySelector(".VolumeInputSlider")
        const temp = slider.valueAsNumber * 100
        slider.style.background = `linear-gradient(to right, #ffffff ${temp}%, #535353 ${temp}%)`;
    }, [])


    const handleVolume = (i) => {
        props.setVolume(i)
        props.player.setVolume(i)
    }


    return (
        <div className="SideControl">
            <div>
                {icon}
            </div>
            <div className="VolumeInputContainer">
                <input
                    className="VolumeInputSlider"
                    type="range"
                    min={0}
                    max={1}
                    step={"any"}
                    value={props.volume}
                    onChange={event => {
                        handleVolume(event.target.valueAsNumber)
                    }}
                />
            </div>
        </div>
    )
}

export default SideControl