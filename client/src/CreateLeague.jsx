import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { addDoc, collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';
import './CreateLeague.css';

const CreateLeague = () => {
    const [leagueName, setLeagueName] = useState('');
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const generateUniqueCode = () => {
        return Math.random().toString(36).substring(2, 8);
    };

    const handleCreateLeague = async (e) => {
        e.preventDefault();
        const uniqueCode = generateUniqueCode();

        try {
            // Add a new document with a generated ID
            const docRef = await addDoc(collection(db, 'leagues'), {
                name: leagueName,
                code: uniqueCode
            });
            console.log('Document written with ID: ', docRef.id);
            await joinLeagueOnceCreated(uniqueCode);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    /**
     * Function to join a league once it has been created. Duplicate from JoinLeague.jsx. Refactor in future.
     * @param {*} leagueCode the unique code of the league to join
     * @returns void
     */
    const joinLeagueOnceCreated = async (leagueCode) => {
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
        <div className="create-league-container">
            <h2>Create a League</h2>
            <form onSubmit={handleCreateLeague} className="create-league-form">
                <label className="league-label">
                    <input type="text"
                        value={leagueName}
                        onChange={(e) => setLeagueName(e.target.value)}
                        className="league-input"
                        placeholder="Enter league name"
                        required
                     />
                </label>
                <button type="submit" className="create-league-button">Create</button>
            </form>
        </div>
    );
}

export default CreateLeague;