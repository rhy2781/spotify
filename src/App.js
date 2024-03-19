import React, { useState, useEffect } from 'react';
import Login from './components/login/Login';
import './App.css';
import Canvas from './components/canvas/Canvas';

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
        .catch(err =>{
          console.log(err)
        })
    }

    getAuthenticated()
  }, []);

  return (
    <div className='App'>
      {(token === ' ') ? <Login /> : <Canvas token={token} />}
    </div>
  );
}

export default App;
