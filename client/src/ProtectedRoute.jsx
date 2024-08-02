import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const { currentUser } = useAuth();
    // if unauthenticated, redirect to home page
    return currentUser ? children : <Navigate to="/" />;
};

export default ProtectedRoute;