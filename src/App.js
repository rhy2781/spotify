import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Login from './Components/Login';
import Canvas from './Redo/Canvas';


function App() {

  const [token, setToken] = useState('');

  useEffect(() => {
    async function getToken() {
      const response = await fetch('http://localhost:5000/token');
      const json = await response.json();
      setToken(json.access_token);
    }

    getToken();

  }, []);

  return (
    <div className='App'>
      {(token === '') ? <Login /> : <Canvas token={token} />}
    </div>
  );
}

export default App;
