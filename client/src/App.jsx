// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
// import React from 'react';
// import Login from './Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './middleware/ProtectedRoute';
import JoinLeague from './pages/JoinLeague';
import CreateLeague from './pages/CreateLeague';
import { AuthProvider } from './context/AuthContext';
import MakePredictions from './pages/MakePredictions';
import League from './pages/League';
import Home from './pages/Home';
import SignupPage from './pages/SignUp';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/login" element={<Login />} /> */}
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
}

export default App