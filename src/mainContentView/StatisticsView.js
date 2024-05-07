import React, { useEffect, useState} from "react";


import FeatureChart from "../components/FeatureChart";

import './StatisticsView.css'

function StatisticsView(){
    const [trackData, setData] = useState({
        "energy": [],
        "liveness": [], 
        "instrumentalness": [],
        "speechiness": [],
        "acousticness": [],
        "tempo": [],
    })

    // dates for the x Axis
    const [playedAt, setPlayedAt] = useState([])

    // series including liveness and energy
    const [series1, setSeries1] = useState(
        [
            {data: [], label: "energy", showMark: false},
            {data: [], label: "liveness", showMark: false}
        ]
    )

    // series including speechiness, acousticness, and instrumentalness
    const [series2, setSeries2] = useState(
        [
            {data: [], label: "instrumentalness", showMark: false},
            {data: [], label: "speechiness", showMark: false},
            {data: [], label: "acousticness", showMark: false}
        ]
    )

    // series for tempo
    const [series3, setSeries3] = useState(
        [
            {data: [], label: "tempo", showMark: false},
        ]
    )

    // query backend for the data
    useEffect(async() => {
        await fetch(`${process.env.REACT_APP_BACKEND}/home/recent`)
            .then((response) => response.json())
            .then((data) => {
                var dates = [] 
                data.tracks.played_at.forEach((value) => dates.push(new Date(value)))
                setPlayedAt(dates)
                setData(data.tracks)
            })
            .catch(err => console.log(err))    
    }, [])

    // update series1
    useEffect(() => {
        var res = [] 
        res.push({data: trackData.energy, label: "energy", showMark: false})
        res.push({data: trackData.liveness, label: "liveness", showMark: false})
        setSeries1(res)
    }, [trackData])

    //update series2
    useEffect(() => {
        var res = [] 
        res.push({data: trackData.acousticness, label: "acousticness", showMark: false})
        res.push({data: trackData.speechiness, label: "speechiness", showMark: false})
        res.push({data: trackData.instrumentalness, label: "instrumentalness", showMark: false})
        setSeries2(res)
    }, [trackData])

    // update series3
    useEffect(() => {
        setSeries3([{data: trackData.tempo, label: "tempo", showMark: false}])
    }, [trackData])



    return(
        <div className="Statistics">
            <div className="Header">
                Your Recent Listening Trends
            </div>
            <div className="Text">
                Spotify performs analysis on all songs uploaded to spotify. The following graphs represent an analysis 
                on your last 50 recently played songs. The following definitions for each graph are provided from the 
                Spotify API.
            </div>
        

            <FeatureChart 
                playedAt={playedAt}
                data={series1}
            />
            <div className="Text">
                Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. 
                Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, 
                while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include 
                dynamic range, perceived loudness, timbre, onset rate, and general entropy.
            </div>
            <div className="Text">
                Liveness detects the presence of an audience in the recording. Higher liveness values represent an increased 
                probability that the track was performed live. A value above 0.8 provides strong likelihood that the 
                track is live.
            </div>
            <FeatureChart 
                playedAt={playedAt}
                data={series2}
            />
            <div className="Text">
                Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording 
                (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe 
                tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that
                may contain both music and speech, either in sections or layered, including such cases as rap music. Values 
                below 0.33 most likely represent music and other non-speech-like tracks.  
            </div>
            <div className="Text">
                Instrumentalness predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this 
                context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0,
                the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent 
                instrumental tracks, but confidence is higher as the value approaches 1.0.
            </div>
            <div className="Text">
                Acousticness is A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents
                 high confidence the track is acoustic.

            </div>
            <FeatureChart 
                playedAt={playedAt}
                data={series3}
            />
            <div>
                The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the
                speed or pace of a given piece and derives directly from the average beat duration.
            </div>
        </div>
    )
}

export default StatisticsView

