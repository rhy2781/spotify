import React from "react";
import { useState, useEffect } from "react";
import { createTheme } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { ThemeProvider } from "@emotion/react";
import { styled } from '@mui/material/styles';

import { useDrawingArea } from '@mui/x-charts/hooks';


function TagPie(){


    const [pieData, setPieData] = useState([{"label": "loading", "value": 10, "artists": []}])

    useEffect(async ()=>{
        await fetch(`${process.env.REACT_APP_BACKEND}/home/statistics`)
        .then((response) => response.json())
        .then((response) => {
            setPieData(response.data)
        })
        .catch(err => console.log(err))
    }, [])





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
    const newTheme = createTheme({ palette: { mode: "dark" } });

    return(
        <ThemeProvider theme={newTheme} >
            <PieChart
                colors={['#476240', '#FF00FF', '#EDC8FF', '#FFC000', '#F5F5DC', '#40E0D0']}
                series={[
                    {
                        data: pieData, 
                        valueFormatter: (v, { dataIndex }) => {
                            let res = pieData[dataIndex]["artists"]
                            let str = ''
                            res.forEach(artist => str += artist + ", ")
                            str = str.slice(0, str.length - 2)

                            if(pieData.length > 1){
                                return `Sample Artists include: ${str}`
                            }
                            return ""
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
                    console.log(JSON.stringify(pieData[d.dataIndex], null, 2))
                }}

                tooltip={{ trigger: 'item' }}
            >
                {pieData.length == 1 && <PieCenterLabel>Data is Loading...</PieCenterLabel>}
            </PieChart>
        </ThemeProvider>
    )
}

export default TagPie