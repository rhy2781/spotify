import { React, useEffect, useState } from "react"

import './TrackProgress.css'

/**
 * @typedef {import('../types').SpotifyPlayer} SpotifyPlayer
 */

/**
 * Renders the bottom part of the controls, with strings to represent the current time of the track and 
 * total time of the track along with a interactive progress bar
 * @param {Object} props 
 * @param {SpotifyPlayer} props.player The Spotify Web Playback player
 * @param {boolean} props.pause Relays whether or not the player is paused
 * @param {number} props.durationMS The duration of the current playing track
 * @param {number} props.progressMS The current duration of the current track
 * @returns {JSX.Element}
 */
function TrackProgress(props) {
    const [progress, setProgress] = useState(props.progressMS)
    const [progressPercentage, setProgressPercentage] = useState(0)
    const [progressString, setProgressString] = useState("")
    const [durationString, setDurationString] = useState("")

    //sync up the state variable whenever we get push notification information about the progress of the track
    useEffect(() => {
        setProgress(props.progressMS)
    }, [props.progressMS])

    // use an internal timer to simulate the passage of time
    useEffect(() => {
        const interval = setInterval(() => {
            if (!props.pause) {
                const temp = progress + 500;
                setProgress(temp)
            }
        }, 500)
        return () => clearInterval(interval)
    }, [progress, props.pause])

    // dynamically update the progress slider to display a gradient
    useEffect(() => {
        const slider = document.querySelector(".ProgressInputSlider")
        var temp = slider.valueAsNumber * 100
        slider.style.background = `linear-gradient(to right, #ffffff ${temp}%, #535353 ${temp}%)`
    }, [])

    // updating component
    useEffect(() => {
        const progressMin = Math.floor((progress / 1000) / 60)
        const progressSec = Math.floor((progress / 1000) % 60)
        setProgressPercentage(progress / props.durationMS)
        setProgressString(`${progressMin}:${progressSec.toString().padStart(2, '0')}`)

        // adjusting css for progress slider
        const slider = document.querySelector(".ProgressInputSlider")

        // slider remains green during input
        const handleSliderInput = (event) => {
            var temp = event.target.valueAsNumber * 100
            slider.style.background = `linear-gradient(to right, #44c767 ${temp}%, #535353 ${temp}%)`
        };
        slider.addEventListener("input", handleSliderInput)

        const container = document.querySelector(".ProgressInputSliderContainer")
        // slider turns green when mouse over
        const handleContainerMouseEnter = () => {
            var temp = slider.valueAsNumber * 100
            slider.style.background = `linear-gradient(to right, #44c767 ${temp}%, #535353 ${temp}%)`
        }
        container.addEventListener("mouseenter", handleContainerMouseEnter)


        // //slider turns white when mouse leave
        const handleContainerMouseLeave = () => {
            var temp = slider.valueAsNumber * 100
            slider.style.background = `linear-gradient(to right, #ffffff ${temp}%, #535353 ${temp}%)`
        }
        container.addEventListener("mouseleave", handleContainerMouseLeave)

        return () => {
            slider.removeEventListener("input", handleSliderInput);
            slider.removeEventListener("mouseenter", handleContainerMouseEnter);
            slider.removeEventListener("mouseleave", handleContainerMouseLeave);
        }

    }, [progress, props.durationMS])

    // string representations for the time
    useEffect(() => {
        const durationMin = Math.floor((props.durationMS / 1000) / 60)
        const durationSec = Math.floor((props.durationMS / 1000) % 60)
        setDurationString(`${durationMin}:${durationSec.toString().padStart(2, '0')}`)
    }, [props.durationMS])

    // handle seeking the playtime of the track
    function handleSeek(i) {
        const seek_to = Math.floor(props.durationMS * i);
        props.player.togglePlay();
        props.player.seek(seek_to);
        setProgressPercentage(seek_to / props.durationMS);
        props.player.togglePlay();
    }

    return (
        <div className="ProgressBar">
            <div>
                {progressString}
            </div>
            <div className="ProgressInputSliderContainer">
                <input
                    className="ProgressInputSlider"
                    type="range"
                    min={0}
                    max={1}
                    step={"any"}
                    value={progressPercentage}
                    onChange={event => handleSeek(event.target.valueAsNumber)}
                />
            </div>
            <div>
                {durationString}
            </div>
        </div>

    )
}

export default TrackProgress