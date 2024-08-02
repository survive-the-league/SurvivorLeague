import React from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { currentUser, logout } = useAuth();

    return (
        <div>
            <h2>Welcome, {currentUser.email}</h2>
            <button onClick={logout}>Logout</button>
            <nav>
                <Link to="/create-league">Create a League</Link>
                <Link to="/join-league">Join a League</Link>
            </nav>
        </div>
    );
};

export default Dashboard;