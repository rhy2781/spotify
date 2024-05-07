import { React, useEffect, useState } from "react";

import DisplayRow from "../components/DisplayRow";
import TrackList from "../components/TrackList";

import { createTheme,ThemeProvider } from '@mui/material/styles';
import { PieChart} from "@mui/x-charts/PieChart";
import { useDrawingArea } from '@mui/x-charts/hooks';
import { LineChart } from '@mui/x-charts/LineChart';
import { styled } from '@mui/material/styles';
import TagPie from "../components/TagPieChart";

import './HomeView.css'

// PieCenter Label
const StyledText = styled('text')(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 20,
  }));
  
function PieCenterLabel({ children }) {
    const { width, height, left, top } = useDrawingArea();
    return (
      <StyledText x={left + width / 2} y={top + height / 2}>
        {children}
      </StyledText>
    );
}




function HomeView(props) {

    const [artistData, setArtistData] = useState([])
    const [trackData, setTrackData] = useState([])

    useEffect(async () => {
        await fetch(`${process.env.REACT_APP_BACKEND}/home/artists`)
            .then((response) => response.json())
            .then((response) => setArtistData(response.items))
            .catch(err => console.log(err))
    }, [])

    useEffect(async () => {
        await fetch(`${process.env.REACT_APP_BACKEND}/home/tracks`)
            .then((response) => response.json())
            .then((response) => {
                setTrackData(response.items)
            })
            .catch(err => console.log(err))
    }, [])


    return (
        <div className="HomeView">
            <div className="Welcome">
                <div className="test2">
                    <div className="Header">
                        Your Music Tastes
                    </div>
                    <TagPie />
                </div>
                <div className="Header">
                    Queue 
                </div>
            </div>
            <div className="Header">
                Your Top Artists
            </div>
            <DisplayRow
                data={artistData}
                addPage={props.addPage}
                submitRequest={props.submitRequest}
                circle={true}
            />
            <div className="Header">
                Your Top Tracks
            </div>
            <TrackList
                height={70}
                padding={5}
                split={false}

                data={trackData}
                currentTrack={props.currentTrack}
                submitRequest={props.submitRequest}
                addPage={props.addPage}
            />

            <div>
                This is the home view
            </div>
        </div>
    )
}

export default HomeView