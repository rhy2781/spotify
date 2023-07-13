import React from "react";

function Button(){
    return(
        <div>
            <div className="LoginSpace">
            </div>
            <div className="">
                This project connects to your spotify premium account,  so you will need to log in to your account to continue
            </div>
            <a className="Login" href="http://localhost:5000/login">
                Login with Spotify
            </a>
        </div>
    );
}

export default Button;