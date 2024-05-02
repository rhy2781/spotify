import { React, useEffect, useState } from "react";

import DisplayRow from "../components/DisplayRow";
import TrackList from "../components/TrackList";
import Button from '@mui/material/Button';

import { createTheme, useTheme, ThemeProvider } from '@mui/material/styles';

import { BarChart } from "@mui/x-charts";
import { PieChart } from "@mui/x-charts/PieChart";

import './HomeView.css'

function HomeView(props) {

    const [artistData, setArtistData] = useState([])
    const [trackData, setTrackData] = useState([])

    const [stats, setStats] = useState([ {"id": 1, "value": 10, "label": "sample"} ])

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


    return (
        <div className="HomeView">
            <DisplayRow
                data={artistData}
                addPage={props.addPage}
                submitRequest={props.submitRequest}
                circle={true}
            />
                  <Button variant="text">Text</Button>
                  <BarChart
                series={[
                    { data: [35, 44, 24, 34] },
                    { data: [51, 6, 49, 30] },
                    { data: [15, 25, 30, 50] },
                    { data: [60, 50, 15, 25] },
                ]}
                height={290}
                xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                />
            <div className="pl">
                <PieChart
                    series={[
                        {
                        data:stats.map(item => ({ label: item.label, value: item.value })),
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        },
                    ]}
                    style={{
                        backgroundColor: "white"
                    }}
                    labelStyle={{
                        color: "white"
                    }}

                    height={200}
                />
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