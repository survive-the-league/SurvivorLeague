import React from 'react';
import { useAuth } from './AuthContext';

const Dashboard = () => {
    const { currentUser, logout } = useAuth();

    return (
        <div>
            <h2>Welcome, {currentUser.email}</h2>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Dashboard;