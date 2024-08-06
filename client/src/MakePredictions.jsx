import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth, db } from './firebase';
import { useParams } from 'react-router-dom';
import { collection, query, where, onSnapshot, doc, updateDoc, getDocs } from 'firebase/firestore';

const MakePredictions = () => {
    const { leagueId } = useParams();
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [matchday, setMatchday] = useState('');
    const [user, setUser] = useState(null);
    const [predictions, setPredictions] = useState([]);

    useEffect(() => {

        // TODO: Fetch teams from the firebase database
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

    /**
     * Helper function to check if predictions should be locked
     * @param {*} matchday the current matchday
     * @returns true if predictions should be locked, false otherwise
     */
    const shouldLockPredictions = async (matchday) => {
        try {
            // Get the matches for the current matchday
            const matchesRef = collection(db, 'matches');
            const currentMatchdayQuery = query(matchesRef, where('matchday', '==', matchday));
            const currentMatchdaySnapshot = await getDocs(currentMatchdayQuery);
            
            // sort the matches by start time and get the first match
            const currentTime = new Date();
            const firstMatchStartTime = currentMatchdaySnapshot.docs
                .map(doc => new Date(doc.data().utcDate))
                .sort((a, b) => a - b)[0];
            // check if the current time is greater than the first match start time
            return currentTime >= firstMatchStartTime;
        } catch (error) {
            console.error('Error checking if predictions should be locked:', error);
            return true;
        }
    };

    /**
     * Helper function to get an existing prediction
     * @param {*} userId id of the user
     * @param {*} leagueId id of the league
     * @param {*} matchday the matchday
     * @returns prediction document if it exists, null otherwise
     */
    const getExistingPrediction = async (userId, leagueId, matchday) => {
        const predictionsRef = collection(db, 'predictions');
        // Check if the user has already made a prediction for the selected matchday
        const q = query(predictionsRef, 
            where('leagueId', '==', leagueId), 
            where('userId', '==', user.uid), 
            where('matchday', '==', matchday));
        
        // query the database with our query
        const querySnapshot = await getDocs(q);
        return querySnapshot.empty ? null : querySnapshot.docs[0];
    };

    /**
     * Helper function to update an existing prediction
     * @param {*} docId id of the prediction document
     * @param {*} teamId id of the team
     */
    const updatePrediction = async (docId, teamId) => {
        const existingDocRef = doc(db, 'predictions', docId);
        await updateDoc(existingDocRef, {
            teamId: teamId
        });
    }

    /**
     * Helper function to create a new prediction
     * @param {*} userId id of the user
     * @param {*} leagueId id of the league
     * @param {*} matchday matchday selected
     * @param {*} teamId id of the team
     */
    const createPrediction = async (userId, leagueId, matchday, teamId) => {
        // if no existing prediction, create a new one
        const apiUrl = 'http://localhost:3000'; //update to backend URL eventually (some AWS or Google Cloud URL)
        await axios.post(`${apiUrl}/makePredictions`, {
            userId: user.uid,
            leagueId: leagueId,
            matchday: matchday,
            teamId: selectedTeam,
        });
    };

    /**
     * Function to handle making a prediction
     * @returns error message if prediction fails
     */
    const handlePrediction = async () => {
        if (user && selectedTeam && matchday) {
            try {
                const shouldLock = await shouldLockPredictions(matchday);
                if (shouldLock) {
                    alert('Predictions are locked for this matchday');
                    return;
                }

                const existingPrediction = await getExistingPrediction(user.uid, leagueId, matchday);
                if (existingPrediction) {
                    await updatePrediction(existingPrediction.id, selectedTeam);
                    alert('Prediction updated successfully!');
                } else {
                    await createPrediction(user.uid, leagueId, matchday, selectedTeam);
                    alert('Prediction made successfully!');
                }

                setSelectedTeam('');
                setMatchday('');
            } catch (error) {
                console.error('Error making prediction:', error);
                alert('Failed to make prediction');
            }
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
                placeholder='matchday'
                value={matchday}
                onChange={(e) => setMatchday(e.target.value)}
            />
            <button onClick={handlePrediction}>Submit Prediction</button>

            <h2>Your Predictions</h2>
            <ul>
                {predictions.map(prediction => (
                    <li key={prediction.id}>
                        {prediction.teamId} - Matchday {prediction.matchday}</li>
                    ))}
            </ul>
        </div>
    );
};

export default MakePredictions;