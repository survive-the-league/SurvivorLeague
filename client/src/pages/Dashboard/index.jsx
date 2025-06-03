import { useContext, useEffect, useState } from 'react';
// import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
// import { db } from './firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import './Dashboard.css';
import { AuthContext } from '@/context/Auth/AuthContext';
import { db } from '../../config/firebase';

const Dashboard = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const [leagues, setLeagues] = useState([]);
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) return;
            
            setIsLoading(true);
            setError(null);
            
            try {
                // Get the user document reference
                const userRef = doc(db, 'users', currentUser.id);
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

                // Get the username document reference
                const usernameRef = doc(db, 'usernames', currentUser.id);
                const userDoc = await getDoc(usernameRef);
                // Set the username in state if it exists
                if (userDoc.exists()) {
                    setUsername(userDoc.data().username);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error loading dashboard data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [currentUser]);

    if (isLoading) {
        return (
            <div className='home-bg-main'>
                <div className="dashboard-container">
                    <div style={{ color: 'white', textAlign: 'center' }}>Loading dashboard...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='home-bg-main'>
                <div className="dashboard-container">
                    <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className='home-bg-main'>
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <h2>Welcome, {username || currentUser?.displayName || 'User'}</h2>
                </header>
                <section className="leagues-section">
                    <h3>Your Leagues</h3>
                    <div className="leagues-list">
                        {leagues.length > 0 ? (
                            leagues.map(league => (
                                <div key={league.id} className="league-card">
                                    <Link to={`/league/${league.id}`} className="league-link">{league.name}</Link>
                                </div>
                            ))
                        ) : (
                            <div style={{ color: 'white', textAlign: 'center' }}>No leagues found</div>
                        )}
                    </div>
                </section>
                <nav className="dashboard-nav">
                    <Link className="nav-link" to="/create-league">Create a League</Link>
                    <Link className="nav-link" to="/join-league">Join a League</Link>
                </nav>
                <footer className="dashboard-footer">
                    <button className="logout-button" onClick={logout}>Logout</button>
                </footer>
            </div>
        </div>
    );
};

export default Dashboard;