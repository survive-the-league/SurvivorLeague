// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./middleware/ProtectedRoute";
import JoinLeague from "./pages/JoinLeague";
import { CreateLeaguePage } from "./pages/CreateLeague/CreateLeaguePage";
import { AuthProvider } from "./context/AuthContext";
import MakePredictions from "./pages/MakePredictions";
import League from "./pages/League";
import Dashboard from "./pages/Dashboard";
import { LoginPage } from "./pages/Auth/Login/LoginPage";
import { SignUpPage } from "./pages/Auth/SignUp/SignUpPage";
import { ForgotPasswordPage } from "./pages/Auth/ForgotPassword/ForgotPassword";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/join-league"
            element={
              <ProtectedRoute>
                <JoinLeague />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-league"
            element={
              <ProtectedRoute>
                <CreateLeaguePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/league/:leagueId"
            element={
              <ProtectedRoute>
                <League />
              </ProtectedRoute>
            }
          />
          <Route
            path="/makePredictions/:leagueId"
            element={
              <ProtectedRoute>
                <MakePredictions />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
