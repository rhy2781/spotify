import { React } from "react";
import { IoPlaySharp, IoPauseSharp, IoShuffleSharp, IoPlaySkipBackSharp, IoPlaySkipForwardSharp } from "react-icons/io5"
import { LuRepeat, LuRepeat1 } from "react-icons/lu"

import './MainControl.css'
/**
 * Renders the main controls of the application
 * @param {Object} props 
 * @param {Function} props.setPause Updates the pause state variable
 * @param {SpotifyPlayer} props.player The player object for the web playback sdk
 * @param {boolean} props.pause The state variable mirroring the pause state of the player
 * @param {boolean} props.shuffle The state variable mirroring the shuffle state of the player
 * @param {number} props.repeat The state variable mirroring the repeat state of the player
 * @returns {JSX.Element}   
 */
function MainControl(props) {

    // submit request to toggle shuffle through api
    async function toggleShuffle() {
        await fetch(`${process.env.REACT_APP_BACKEND}/controls/shuffle`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'state': props.shuffle })
        })
            .catch(err => {
                console.log(err)
            })
    }

    // submit request to toggle repeat through api
    async function toggleRepeat() {
        await fetch(`${process.env.REACT_APP_BACKEND}/controls/repeat`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'state': props.repeat })
        })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className="MainControl">
            <div className="Shuffle" onClick={() => toggleShuffle()} >
                {props.shuffle ? <IoShuffleSharp /> : <IoShuffleSharp style={{ color: "#1DB954" }} />}
            </div>
            <div className="SkipBackward" onClick={() => { props.player.previousTrack() }}>
                <IoPlaySkipBackSharp />
            </div>
            <div className="Play" onClick={() => {
                props.player.togglePlay()
                props.setPause(!props.pause)
            }}>
                <div className="PlayButton">
                    {(props.pause) ? <IoPlaySharp /> : <IoPauseSharp />}
                </div>
            </div>
            <div className="SkipForward" onClick={() => { props.player.nextTrack() }}>
                <IoPlaySkipForwardSharp />
            </div>
            <div className="Repeat" onClick={() => toggleRepeat()}>
                {props.repeat === 0 ? <LuRepeat className="RepeatIcon" /> : props.repeat === 1 ? <LuRepeat className="RepeatIcon" style={{ color: "#1DB954" }} /> : <LuRepeat1 className="RepeatIcon" style={{ color: "#1DB954" }} />}
            </div>
        </div>
    )
}

export default MainControl