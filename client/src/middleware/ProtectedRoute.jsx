/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { currentUser } = useAuth();
    // if unauthenticated, redirect to home page
    return currentUser ? children : <Navigate to="/" />;
};

export default ProtectedRoute;