import React, { useState, useEffect } from 'react';
import Login from './canvas/Login';
import './App.css';
import Canvas from './canvas/Canvas';

function App() {

  const [token, setToken] = useState(' ');
  const [expiresIn, setExpiresIn] = useState(0)

  // request token initially
  useEffect(() => {
    async function getAuthenticated() {
      await fetch(`${process.env.REACT_APP_BACKEND}/auth/token`)
        .then((response) => response.json())
        .then((response) => {
          if (response.token) {
            setToken(response.token)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }

    getAuthenticated()
  }, []);

  // get refresh token for SDK callback function
  useEffect(() => {
    const interval = setInterval(async () => {
      await fetch(`${process.env.REACT_APP_BACKEND}/auth/refresh`, {
        method: 'GET'
      })
        .then((response) => response.json())
        .then((response) => {
          setToken(response.access_token)
        })
        .catch(err => {
          console.log(err)
        })
    }, 60000 * 30)

    return () => clearInterval(interval)
  }, [token])


  return (
    <div className='App'>
      {(token === ' ') ? <Login /> : <Canvas token={token} />}
    </div>
  );
}

export default App;
