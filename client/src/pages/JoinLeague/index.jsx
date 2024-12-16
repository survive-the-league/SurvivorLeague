import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import { db } from '../../middleware/firebase';
import { useAuth } from '../../context/AuthContext';
import './JoinLeague.css';

const JoinLeague = () => {
    const [leagueCode, setLeagueCode] = useState('');
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleJoinLeague = async (e) => {
        e.preventDefault();

        const q = query(collection(db, 'leagues'), where('code', '==', leagueCode));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert('No league found with that code');
            return;
        }
        
        // Add the current user to the league
        querySnapshot.forEach(async (document) => {
            const leagueRef = document.ref;
            const userRef = doc(db, 'users', currentUser.uid);
            
            // Add the user to the array of users in the league
            await updateDoc(leagueRef, {
                users: arrayUnion(userRef)
            });
            
            //take us back to the dashboard
            navigate('/dashboard');
        });
    };

    return (
        <div className='home-bg-main'>
 <div className="join-league-container">
            <h2>Join a League</h2>
            <form onSubmit={handleJoinLeague} className="join-league-form">
                <label className="league-label">
                    <input 
                        type="text"
                        value={leagueCode}
                        onChange={(e) => setLeagueCode(e.target.value)}
                        className="league-input"
                        placeholder="Enter league code"
                        required
                    />
                </label>
                <button type="submit" className="join-league-button">Join</button>
            </form>
        </div>
        </div>
       
    );
};

export default JoinLeague;