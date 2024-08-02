import React from 'react';
import Signup from './Signup.jsx';
import Login from './Login.jsx';

const Home = () => {
  return (
    <div>
      <h1>Welcome to Survivor BPL</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <Signup />
        </div>
        <div>
          <Login />
        </div>
      </div>
    </div>
  );
};

export default Home;
