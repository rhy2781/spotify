import React, { useState, useEffect } from 'react';
import Login from './components/login/Login';
import './App.css';
import Canvas from './components/canvas/Canvas';

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
  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     console.log('attempted')
  //     await fetch(`${process.env.REACT_APP_BACKEND}/auth/refresh`, {
  //       method: 'GET'
  //     })
  //       .then((response) => response.json())
  //       .then((response) => {
  //         setToken(response.access_token)
  //         setExpiresIn(response.expiresIn)
  //       })
  //       .catch(err => {
  //         console.log(err)
  //       })
  //   }, (expiresIn - 60) * 1000)

  //   return () => clearInterval(interval)
  // }, [token])


  return (
    <div className='App'>
      {(token === ' ') ? <Login /> : <Canvas token={token} />}
    </div>
  );
}

export default App;
