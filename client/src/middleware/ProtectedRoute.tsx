/* eslint-disable react/prop-types */
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/Auth/AuthContext';
import { useContext } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser, isLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#1a1a1a'
      }}>
        <div style={{ color: 'white' }}>Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;