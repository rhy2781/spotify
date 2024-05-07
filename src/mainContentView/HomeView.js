import { React, useEffect, useState } from "react";

import DisplayRow from "../components/DisplayRow";
import TrackList from "../components/TrackList";

import { createTheme,ThemeProvider } from '@mui/material/styles';
import { PieChart} from "@mui/x-charts/PieChart";
import { useDrawingArea } from '@mui/x-charts/hooks';
import { LineChart } from '@mui/x-charts/LineChart';
import { styled } from '@mui/material/styles';

import './HomeView.css'
import { GiConsoleController } from "react-icons/gi";

import FeatureChart from "../components/FeatureChart";


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

    const [pieData, setPieData] = useState([{"label": "loading", "value": 10, "artists": []}])

    const [audioFeaturesData, setAudioFeaturesData] = useState({})






    const [energy, setEnergy] = useState([])
    const [liveness, setLiveness] = useState([])
    const [xLabels, setXLabels] = useState([])

    // gather statistics for pie chart
    useEffect(async ()=>{
        await fetch(`${process.env.REACT_APP_BACKEND}/home/statistics`)
        .then((response) => response.json())
        .then((response) => {
            setPieData(response.data)
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

                </div>

                <div className="test">
                    Welcome 
                </div>
            </div>
            <div className="Header">
                Your Recent Listening Trends
            </div>


            <FeatureChart />



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