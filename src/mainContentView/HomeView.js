import { React, useEffect, useState } from "react";

import DisplayRow from "../components/DisplayRow";
import TrackList from "../components/TrackList";
import Button from '@mui/material/Button';

import { createTheme, useTheme, ThemeProvider } from '@mui/material/styles';

import { BarChart } from "@mui/x-charts";
import { PieChart } from "@mui/x-charts/PieChart";

import Box from '@mui/material/Box';
import { Typography } from "@mui/material";
import { LineChart } from '@mui/x-charts/LineChart';

import './HomeView.css'


function HomeView(props) {

    const [artistData, setArtistData] = useState([])
    const [trackData, setTrackData] = useState([])

    const [stats, setStats] = useState([{"label": "loading", "value": 10, "artists": []}])

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
            <div className="Welcome">
                <div className="test2">
                    <div className="Header">
                        Your Music Tastes
                    </div>

                    <ThemeProvider theme={newTheme} >
                        <PieChart
                            colors={['#476240', '#FF00FF', '#EDC8FF', '#FFC000', '#F5F5DC', '#40E0D0']}
                            series={[
                                {
                                    data: stats, 
                                    valueFormatter: (v, { dataIndex }) => {
                                        let res = stats[dataIndex]["artists"]
                                        let str = ''
                                        res.forEach(artist => str += artist + ", ")
                                        str = str.slice(0, str.length - 2)

                                        return `Sample Artists include: ${str}`
                                      },
                                    outerRadius: '200px',
                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
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
                                    right: 50,
                                    bottom: 50
                                }
                            }
                            height={500}
                            width={500}

                            onItemClick={(event, d) => {
                                console.log(JSON.stringify(stats[d.dataIndex], null, 2))
                            }}

                            tooltip={{ trigger: 'item' }}

                        />
                    </ThemeProvider>
                </div>

                <div className="test">
                    Welcome 
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