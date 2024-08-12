import React, { useState, useEffect } from 'react';
import { doc, getDoc, getDocs, setDoc, query, where, collection } from 'firebase/firestore';
import { auth, db } from './firebase';
import './NicknameWidget.css';

const NicknameWidget = () => {
    const [nickname, setNickname] = useState('');
    const [currentNickname, setCurrentNickname] = useState('');
    const [error, setError] = useState('');
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        const fetchNickname = async () => {
            if (userId) {
                const nicknameDoc = await getDoc(doc(db, 'nicknames', userId));
                if (nicknameDoc.exists()) {
                    setCurrentNickname(nicknameDoc.data().nickname);
                }
            }
        };
        fetchNickname();
    }, [userId]);

    /**
     * Function to handle nickname change
     * @param {*} e event object
     * @returns void if nickname is already taken, otherwise updates the nickname
     */
    const handleNicknameChange = async (e) => {
        e.preventDefault();
        try {
            const nicknamesRef = collection(db, 'nicknames');
            const q = query(nicknamesRef, where('nickname', '==', nickname));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty && querySnapshot.docs[0].id !== userId) {
                setError('Nickname is already taken');
                return;
            }

            await setDoc(doc(db, 'nicknames', userId), { nickname: nickname });

            setCurrentNickname(nickname);
            setError('');
        } catch (error) {
            setError('An error occured while updating your nickname', error.message);
        }
    };

    return (
        // <div>
        //     {currentNickname && <p>Your current nickname is: {currentNickname}</p>}
        //     <form onSubmit={handleNicknameChange}>
        //         <input
        //             type="text"
        //             placeholder="Nickname"
        //             value={nickname}
        //             onChange={(e) => setNickname(e.target.value)}
        //             required
        //         />
        //         <button type="submit">Change Nickname</button>
        //     </form>
        //     {error && <p>{error}</p>}
        // </div>
        <div className="nickname-widget">
            {currentNickname && <p className="current-nickname">Your current nickname is: {currentNickname}</p>}
            <form className="nickname-form" onSubmit={handleNicknameChange}>
                <input
                    className="nickname-input"
                    type="text"
                    placeholder="Enter your new nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                />
                <button className="nickname-button" type="submit">Change Nickname</button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default NicknameWidget;