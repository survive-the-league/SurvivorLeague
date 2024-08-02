import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react';
import Login from './Login';
import Signup from './Signup';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>Welcome to Survivor BPL</h1>
      <Login />
      <Signup />
    </div>
  )
}

export default App
