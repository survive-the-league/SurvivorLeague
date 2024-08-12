import React from 'react';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import './Home.css'

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Survivor BPL</h1>
      <div className="auth-container">
        <div className="auth-card">
          <Signup />
        </div>
        <div className="auth-card">
          <Login />
        </div>
      </div>
    </div>
  );
};

export default Home;
