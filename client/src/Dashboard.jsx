import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import { db } from './firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import './Dashboard.css';

const Dashboard = () => {
    const { currentUser, logout } = useAuth();
    const [leagues, setLeagues] = useState([]);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchLeagues = async () => {
            if (currentUser) {
                try {
                    // Get the user document reference
                    const userRef = doc(db, 'users', currentUser.uid);
                    // Get the leagues collection reference
                    const leaguesRef = collection(db, 'leagues');
                    // Get the leagues where the user is a member
                    const q = query(leaguesRef, where('users', 'array-contains', userRef));
                    // Get the document references for each league
                    const querySnapshot = await getDocs(q);
                    // Map the leagues to an array
                    const leaguesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    // Set the leagues in state
                    setLeagues(leaguesList);
                } catch (error) {
                    console.error('Error fetching leagues: ', error);
                }
            }
        };

        /**
         * Fetches the username for the current user
         */
        const fetchUsername = async () => {
            if (currentUser) {
                try {
                    // Get the username document reference
                    const userRef = doc(db, 'usernames', currentUser.uid);
                    const userDoc = await getDoc(userRef);
                    // Set the username in state if it exists
                    if (userDoc.exists()) {
                        setUsername(userDoc.data().username);
                    }
                } catch (error) {
                    console.error('Error fetching username: ', error);
                }
            }
        };

        fetchLeagues();
        fetchUsername();
    }, [currentUser.uid]);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h2>Welcome, {username}</h2>
            </header>
            <section className="leagues-section">
                <h3>Your Leagues</h3>
                <div className="leagues-list">
                    {leagues.map(league => (
                        <div key={league.id} className="league-card">
                            <Link to={`/league/${league.id}`} className="league-link">{league.name}</Link>
                        </div>
                    ))}
                </div>
            </section>
            <nav className="dashboard-nav">
                <Link className="nav-link" to ="/create-league">Create a League</Link>
                <Link className="nav-link" to ="/join-league">Join a League</Link>
            </nav>
            <footer className="dashboard-footer">
                <button className="logout-button" onClick={logout}>Logout</button>
            </footer>
        </div>
    );
};

export default Dashboard;