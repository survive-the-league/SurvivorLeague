import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';

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
        <div>
            <h2>Join a League</h2>
            <form onSubmit={handleJoinLeague}>
                <label>
                    League Code:
                    <input type="text" value={leagueCode} onChange={(e) => setLeagueCode(e.target.value)} />
                </label>
                <button type="submit">Join</button>
            </form>
        </div>
    );
};

export default JoinLeague;