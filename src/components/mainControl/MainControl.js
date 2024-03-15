import { React } from "react";
import { IoPlaySharp, IoPauseSharp, IoShuffleSharp, IoPlaySkipBackSharp, IoPlaySkipForwardSharp } from "react-icons/io5"
import { LuRepeat, LuRepeat1 } from "react-icons/lu"

import './MainControl.css'

function MainControl(props) {

    async function toggleShuffle() {
        await fetch(`${process.env.REACT_APP_BACKEND}/controls/shuffle`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'state': props.shuffle })
        })
    }

    async function toggleRepeat() {
        await fetch(`${process.env.REACT_APP_BACKEND}/controls/repeat`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'state': props.repeat })
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
            <div className="Play" onClick={() => { props.player.togglePlay() }}>
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