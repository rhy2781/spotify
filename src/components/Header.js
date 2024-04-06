import React, { useEffect, useState } from "react";
import { IoPlaySharp } from "react-icons/io5";

import ColorThief from 'colorthief'

import './Header.css'
/*
data ={
    image: "" url string,
    uri:"" uri string,
    details: jsx element // this way we can configure how everything looks

}
*/


// Example usage:
// fetchAndEncodeImage('https://example.com/image.jpg');



function Header(props) {
    function fetchAndEncodeImage(imageUrl) {
        fetch(imageUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then(blob => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            })
            .then(base64Data => {
                console.log('Base64 encoded image:', base64Data);
                // Pass base64Data to Color Thief after creating an img element
                const img = new Image();
                img.onload = () => {
                    const colorThief = new ColorThief();
                    const dominantColor = colorThief.getColor(img);
                    console.log('Dominant color:', dominantColor);
                    // Now you can use the dominantColor for your application
                };
                img.src = base64Data;
            })
            .catch(error => {
                console.error('Error fetching or encoding image:', error);
            });
    }

    useEffect(async () => {
        fetchAndEncodeImage(props.image)

    }, [props.image])

    return (
        <div className="Header">
            <div className="HeaderImage">
                <img src={props.image} />
                <div className="PlayContainer">
                    <div className="Play2" onClick={() => { props.submitRequest(props.uri) }}>
                        <IoPlaySharp />
                    </div>
                </div>
            </div>

            <div className="Details">
                {props.details}
            </div>
        </div>
    )
}

export default Header