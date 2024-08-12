import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';
import './CreateLeague.css';

const CreateLeague = () => {
    const [leagueName, setLeagueName] = useState('');
    const navigate = useNavigate();

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
            navigate('/dashboard');
        } catch (error) {
            console.error('Error adding document: ', error);
        }
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