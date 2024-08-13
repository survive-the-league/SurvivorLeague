import React from 'react';
import './SignupPage.css';
import Signup from './Signup.jsx';

const SignupPage = () => {
  return (
    <div className="signuppageauth-container">
      <h1>Sign Up to Survivor BPL</h1>
      <div className="signuppage-container">
        <div className="signuppage-card">
          <Signup />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
