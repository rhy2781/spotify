import React, { useEffect, useState } from "react";

import { ThemeProvider } from "@emotion/react";
import { LineChart } from "@mui/x-charts";
import { createTheme, useScrollTrigger } from "@mui/material";



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
        "tempo": []
    })




    useEffect(async() => {
        await fetch(`${process.env.REACT_APP_BACKEND}/home/recent`)
            .then((response) => response.json())
            .then((data) => {
                setData(data.tracks)
            })
            .catch(err => console.log(err))    

    }, [])


    const newTheme = createTheme({ palette: { mode: "dark" } });

    return(
        <ThemeProvider theme={newTheme} >
            <LineChart
                sx={{width: '100%'}}
                height={300}
                series={[
                    { data: trackData.energy, label: 'energy'},
                    { data: trackData.liveness, label: 'liveness'},
                ]}
                xAxis={[{ scaleType: 'point', data: trackData.played_at }]}
            />
        </ThemeProvider>
    )
}

export default FeatureChart