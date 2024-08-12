import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import { db } from './firebase';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import NicknameWidget from './NicknameWidget';
import './Dashboard.css';

const Dashboard = () => {
    const { currentUser, logout } = useAuth();
    const [leagues, setLeagues] = useState([]);

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

        fetchLeagues();
    }, [currentUser.uid]);

    return (
        // <div>
        //     <h2>Welcome, {currentUser.email}</h2>
        //     <button onClick={logout}>Logout</button>
        //     <nav>
        //         <Link to="/create-league">Create a League</Link>
        //         <Link to="/join-league">Join a League</Link>
        //     </nav>
        //     <NicknameWidget />
        //     <h3>Your Leagues</h3>
        //     <ul>
        //         {leagues.map(league => (
        //             <li key={league.id}>
        //                 <Link to={`/league/${league.id}`}>{league.name}</Link>
        //             </li>
        //         ))}
        //     </ul>
        // </div>
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h2>Welcome, {currentUser.email}</h2>
            </header>
            <nav className="dashboard-nav">
                <Link className="nav-link" to ="/create-league">Create a League</Link>
                <Link className="nav-link" to ="/join-league">Join a League</Link>
            </nav>
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
            <NicknameWidget />
            <footer className="dashboard-footer">
                <button className="logout-button" onClick={logout}>Logout</button>
            </footer>
        </div>
    );
};

export default Dashboard;