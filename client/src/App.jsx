import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Home';
import React from 'react';
import Login from './Login';
import SignupPage from './SignupPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute';
import JoinLeague from './JoinLeague';
import CreateLeague from './CreateLeague';
import { AuthProvider } from './AuthContext';
import MakePredictions from './MakePredictions';
import League from './League';

function App() {
  return (
    <Router>
      <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /> </ProtectedRoute>} />
            <Route path="/join-league" element={<ProtectedRoute><JoinLeague /></ProtectedRoute>} />
            <Route path="/create-league" element={<ProtectedRoute><CreateLeague /></ProtectedRoute>} />
            <Route path="/league/:leagueId" element={<ProtectedRoute><League /></ProtectedRoute>} />
            <Route path="/makePredictions/:leagueId" element={<ProtectedRoute><MakePredictions /></ProtectedRoute>} />
          </Routes>
      </AuthProvider>
    </Router>
  )
};

export default App