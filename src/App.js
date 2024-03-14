import React, { useState, useEffect } from 'react';
import WebPlayback from './components/WebPlayback';
import Login from './components/Login';
import './App.css';
import Canvas from './components/Canvas';

function App() {

  const [token, setToken] = useState(' ');

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
    }

    getAuthenticated()
  }, []);

  return (
    <>
      {(token === ' ') ? <Login /> : <Canvas />}
    </>
  );
}

export default App;
