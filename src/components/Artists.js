import {React, useEffect, useState} from "react";

function Artists(props){

    const[display, setDisplay] = useState([])

    useEffect(() =>{
        const temp = props.artists.map((artist, index, arr) => (
            < div key={index} className="Artist" onClick={() => props.addPage(artist.uri)}>
                {(index === arr.length - 1) ? ` ${artist.name}` : `${artist.name}, `}
            </div >
        ));
        setDisplay(temp);

    }, [props.artists])

    return(
        <div>   
            {display}
        </div>
    )
}

export default Artists;