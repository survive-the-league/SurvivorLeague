// src/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebase';
import './Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'usernames', user.uid), {
        userId: user.uid,
        email: user.email,
        username: username
      });
      // Redirect to dashboard after signup
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="signup-container">
       <h1>Sign Up for Survival BPL</h1>
        <div className="signup-card">
          <form onSubmit={handleSignup}>
            <label className="signup-label">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="signup-label">
              <input
                type="Username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <label className="signup-label">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error && <p className="signup-error">{error}</p>}
            <button type="submit">Sign Up</button>
          </form>
      </div>
    </div>
  );
};

export default Signup;