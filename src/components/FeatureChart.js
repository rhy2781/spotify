import React, { useEffect, useState } from "react";

import { ThemeProvider } from "@emotion/react";
import { LineChart } from "@mui/x-charts";
import { createTheme, useScrollTrigger } from "@mui/material";

import Stack from "@mui/material/Stack";


// data -> list of {label : str, data: [], showMark: false}
// playedAt -> [times] 
function FeatureChart(props){

    const newTheme = createTheme({ palette: { mode: "dark" } });

    return(
        <ThemeProvider theme={newTheme}>
            <LineChart
                sx={{width: '100%'}}
                height={500}
                series={props.data}
                xAxis={[{ 
                    scaleType: 'time', 
                    data: props.playedAt }]}
            />
        </ThemeProvider>
    )
}

export default FeatureChart