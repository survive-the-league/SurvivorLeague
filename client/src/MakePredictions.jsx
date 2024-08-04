import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth, db } from './firebase';
import { useParams } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const MakePredictions = () => {
    const { leagueId } = useParams();
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [matchweek, setMatchweek] = useState('');
    const [user, setUser] = useState(null);
    const [predictions, setPredictions] = useState([]);

    useEffect(() => {

        setTeams(['Arsenal', 'Aston Villa', 'Brentford', 'Brighton', 'Burnley', 'Chelsea', 'Crystal Palace', 'Everton', 'Fulham', 'Leeds', 'Leicester', 'Liverpool', 'Manchester City', 'Manchester United', 'Newcastle', 'Norwich', 'Southampton', 'Tottenham', 'Watford', 'West Ham', 'Wolves']);
        
        const unsubscribeAuth = auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user);

                const predictionsRef = collection(db, 'predictions');
                const q = query(predictionsRef, where('leagueId', '==', leagueId), where('userId', '==', user.uid));

                // Firestore Listener provides real-time updates
                const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
                    const newPredictions = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setPredictions(newPredictions);
                });

                return () => unsubscribeFirestore();
            } else {
                setUser(null);
            }
        });

        return () => unsubscribeAuth();
    }, [leagueId]);

    const handlePrediction = async () => {
        if (user && selectedTeam && matchweek) {
            try {
                const apiUrl = 'http://localhost:3000'; //update to backend URL eventually (some AWS or Google Cloud URL)
                await axios.post(`${apiUrl}/makePredictions`, {
                    userId: user.uid,
                    leagueId: leagueId,
                    matchweek: matchweek,
                    teamId: selectedTeam,
            });
            alert('Prediction made successfully!');
            } catch (error) {
                console.error('Error making prediction:', error);
                alert('Failed to make prediction');
            }
        } else {
            alert('Please select a team and matchweek');
        }
    };

    return (
        <div>
            <h2>Make Your Prediction</h2>
            <select onChange={(e) => setSelectedTeam(e.target.value)} value={selectedTeam}>
                <option value=''>Select a team</option>
                {teams.map(team => (<option key={team} value={team}>{team}</option>))}
            </select>
            <input
                type='number'
                placeholder='Matchweek'
                value={matchweek}
                onChange={(e) => setMatchweek(e.target.value)}
            />
            <button onClick={handlePrediction}>Submit Prediction</button>

            <h2>Your Predictions</h2>
            <ul>
                {predictions.map(prediction => (
                    <li key={prediction.id}>
                        {prediction.teamId} - Matchweek {prediction.matchweek}</li>
                    ))}
            </ul>
        </div>
    );
};

export default MakePredictions;