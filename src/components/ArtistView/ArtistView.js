import React, { useEffect, useState } from "react";

import './ArtistView.css'

function ArtistView(props) {

    const [data, setData] = useState({})

    useEffect(() => {
        const getData = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND}/artist?id=${props.spotifyId}`, {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((response) => {
                    console.log(response)
                    setData(response)
                })
        }
        
        getData()

    }, [props.spotifyId])

    return (
        <div className="ArtistView">
            {Object.keys(data).length > 0 &&
                <div>
                    <div className="ArtistImageContainer">
                        <img src={data.images[0].url} />
                    </div>
                    <div>
                        This is the Artist view
                    </div>
                </div>
            }
        </div>
    )
}
export default ArtistView