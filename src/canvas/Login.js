import React from "react"
import './Login.css'

/**
 * Renders a page with a log in button
 * @returns {JSX.Element}
 */
function Login() {
    return (
        <div className="Login">
            <div className="LoginText">
                This project requires you to connect to a Spotify premium account. Please login to your account to continue.
            </div>
            <a className="LoginButton" href={`${process.env.REACT_APP_BACKEND}/auth/login`}>
                Log in with Spotify
            </a>
        </div>
    )
}

export default Login