import { React, useEffect, useState } from "react";

import DisplayRow from "../components/DisplayRow";
import TrackList from "../components/TrackList";
import Button from '@mui/material/Button';

import { createTheme, useTheme, ThemeProvider } from '@mui/material/styles';

import { BarChart } from "@mui/x-charts";
import { PieChart } from "@mui/x-charts/PieChart";

import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';

import './HomeView.css'


function HomeView(props) {

    const [artistData, setArtistData] = useState([])
    const [trackData, setTrackData] = useState([])

    const [stats, setStats] = useState([{"label": "loading", "value": 10}])

    // gather statistics for pie chart
    useEffect(async ()=>{
        await fetch(`${process.env.REACT_APP_BACKEND}/home/statistics`)
        .then((response) => response.json())
        .then((response) => {setStats(response.data)
            console.log(response.data)
        })
        .catch(err => console.log(err))
    }, [])


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



    const newTheme = createTheme({ palette: { mode: "dark" } });

    return (
        <div className="HomeView">
            <DisplayRow
                data={artistData}
                addPage={props.addPage}
                submitRequest={props.submitRequest}
                circle={true}
            />
            <div className="Welcome">
                <div className="test">
                    Welcome 
                </div>
                <div className="test2">
                    <ThemeProvider theme={newTheme} >
                        <PieChart
                            series={[
                                {
                                    data: stats, 
                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                    cy: '50%',
                                    cx: '50%'
                                }
                            ]}
                            slotProps={{
                                legend: {
                                    hidden: true
                                },      
                                "loading": true                          
                            }}
                            margin={
                                {
                                left: 50,
                                right: 50
                                }
                            }
                            height={500}
                            width={500}
                        />
                    </ThemeProvider>
                </div>
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

            {/* <TrackList
                data={trackData}
                submitRequest={props.submitRequest}
                split={true}
                currentTrack={props.currentTrack}
                padding={1}
                height={70}
            /> */}

            <div>
                This is the home view
            </div>
        </div>
    )
}

export default HomeView