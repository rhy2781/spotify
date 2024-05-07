import React, { useEffect, useState } from "react";

import { ThemeProvider } from "@emotion/react";
import { LineChart } from "@mui/x-charts";
import { createTheme, useScrollTrigger } from "@mui/material";

import Stack from "@mui/material/Stack";



function FeatureChart(){

    // energy -> [] 
    // liveness -> [] 
    // tempo -> []

    const [trackData, setData] = useState({
        "energy": [],
        "liveness": [], 
        "instrumentalness": [],
        "speechiness": [],
        "acousticness": [],
        "played_at": [],
        "tempo": [],
    })




    useEffect(async() => {
        await fetch(`${process.env.REACT_APP_BACKEND}/home/recent`)
            .then((response) => response.json())
            .then((data) => {
                var dates = [] 
                data.tracks.played_at.forEach((value) => dates.push(new Date(value)))
                data.tracks.played_at = dates
                setData(data.tracks)
                console.log(data.tracks)
            })
            .catch(err => console.log(err))    


    }, [])


    const newTheme = createTheme({ palette: { mode: "dark" } });

    return(
        <div style={{width: '100%'}}>
        <ThemeProvider theme={newTheme} >
            {/* <Stack sx={{ width: '100%' }}> */}
            <LineChart
                sx={{width: '100%'}}
                height={500}
                // width={1000}
                series={[
                    { data: trackData.energy, label: 'energy', showMark: false},
                    { data: trackData.liveness, label: 'liveness', showMark: false},
                ]}
                xAxis={[{ 
                    scaleType: 'time', 
                    data: trackData.played_at, 
                    // tickInterval: (time) => time.getHours() === 0,
                }]}

                tooltip={false}
            />
            {/* </Stack> */}
            <LineChart
                sx={{width: '100%'}}
                height={500}
                series={[
                    { data: trackData.instrumentalness, label: 'instrumentalness', showMark:false},
                    { data: trackData.speechiness, label: 'speechiness',showMark:false},
                    { data: trackData.acousticness, label: 'acousticness', showMark:false}
                ]}
                xAxis={[{ 
                    scaleType: 'time', 
                    data: trackData.played_at }]}
            />
            <LineChart
                sx={{width: '100%'}}
                height={500}
                series={[
                    { data: trackData.tempo, label: 'tempo', showMark:false}
                ]}
                xAxis={[{ scaleType: 'time', data: trackData.played_at }]}
            />
        </ThemeProvider>
        </div>
    )
}

export default FeatureChart