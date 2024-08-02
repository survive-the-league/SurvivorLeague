import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

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
        <div>
            <h2>Create a League</h2>
            <form onSubmit={handleCreateLeague}>
                <label>
                    League Name:
                    <input type="text" value={leagueName} onChange={(e) => setLeagueName(e.target.value)} />
                </label>
                <button type="submit">Create</button>
            </form>
        </div>
    );
}

export default CreateLeague;