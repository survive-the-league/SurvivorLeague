import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth, db } from '../../middleware/firebase';
import { useParams } from 'react-router-dom';
import { collection, query, where, onSnapshot, doc, updateDoc, getDocs, getDoc } from 'firebase/firestore';
import './MakePredictions.css';

const MakePredictions = () => {
    const { leagueId } = useParams();
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [matchday, setMatchday] = useState('');
    const [user, setUser] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [currentMatchday, setCurrentMatchday] = useState('');
    const [isUpdate, setIsUpdate]  =useState(false)

    useEffect(() => {     
        const fetchCurrentMatchday = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/fetchCurrentMatchday`);
                setCurrentMatchday(response.data.currentMatchday);
            } catch (error) {
                console.error('Error fetching current matchday:', error);
            }
        };

        const unsubscribeAuth = auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user);

                const predictionsRef = collection(db, 'predictions');
                const q = query(predictionsRef, where('leagueId', '==', leagueId), where('userId', '==', user.uid));

                const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
                    const newPredictions = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    
                    newPredictions.sort((a, b) => a.matchday - b.matchday);
                    setPredictions(newPredictions);
                });

                fetchCurrentMatchday();

                return () => unsubscribeFirestore();
            } else {
                setUser(null);
            }
        });

        return () => unsubscribeAuth();
    }, [leagueId]);

    useEffect(() => {
        const fetchTeams = async () => {
            const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/fetchTeams`);
            const allTeams = response.data;
            setTeams(allTeams);
            if (user && currentMatchday) {
                const previouslyLockedTeams = await getLockedTeams(user.uid, leagueId, currentMatchday);
                const availableTeams = filterAvailableTeams(allTeams, previouslyLockedTeams);
                setTeams(availableTeams);
            } else {
                setTeams(allTeams);
            }
        };
        fetchTeams();
    }, [user, leagueId, currentMatchday]);

    const shouldLockPredictions = async (matchday) => {
        try {
            const matchesRef = collection(db, 'matches');
            const currentMatchdayQuery = query(matchesRef, where('matchday', '==', parseInt(matchday, 10)));
            const currentMatchdaySnapshot = await getDocs(currentMatchdayQuery);
            const currentTime = new Date();
            const firstMatchStartTime = currentMatchdaySnapshot.docs
                .map(doc => new Date(doc.data().utcDate))
                .sort((a, b) => a - b)[0];
            return currentTime >= firstMatchStartTime;
        } catch (error) {
            console.error('Error checking if predictions should be locked:', error);
            return true;
        }
    };

    const getExistingPrediction = async (userId, leagueId, matchday) => {
        const predictionsRef = collection(db, 'predictions');
        const q = query(predictionsRef, 
            where('leagueId', '==', leagueId), 
            where('userId', '==', user.uid), 
            where('matchday', '==', parseInt(matchday, 10)));
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.empty ? null : querySnapshot.docs[0];
    };

    const updatePrediction = async (docId, teamId) => {
        const existingDocRef = doc(db, 'predictions', docId);
        await updateDoc(existingDocRef, {
            teamId: teamId
        });
    };

    const createPrediction = async (userId, leagueId, matchday, teamId) => {
        const apiUrl = import.meta.env.VITE_APP_API_BASE_URL;
        const username = await fetchUsername();
        await axios.post(`${apiUrl}/makePredictions`, {
            userId: user.uid,
            username: username,
            leagueId: leagueId,
            matchday: parseInt(matchday, 10),
            teamId: teamId
        });
    };

    const fetchUsername = async () => {
        if (user) {
            try {
                const userRef = doc(db, 'usernames', user.uid);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    return userDoc.data().username;
                }
                return user.uid;
            } catch (error) {
                console.error('Error fetching username: ', error);
            }
        }
    };

    const handlePrediction = async (e) => {
        e.preventDefault();
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
                    setIsUpdate(false)
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

    const handleUpdatePrediction = async (predictionId, newTeam) => {
        try {
            await updatePrediction(predictionId, newTeam);
            alert('Prediction updated successfully!');
        } catch (error) {
            console.error('Error updating prediction:', error);
            alert('Failed to update prediction');
        }
    };

    const handleSelectTeam = (teamName, matchDay) => {
        setSelectedTeam(teamName);
        setMatchday(matchDay)
        setIsUpdate(true)
    };

    const canUpdatePrediction = (matchday) => {
        return matchday >= currentMatchday;
    };

    return (
        <div className="home-bg-main">
            <div className="make-predictions-container">
                <h2>Make Your Prediction</h2>
                <form onSubmit={handlePrediction} className="make-predictions-form">
                    <label className="predictions-label">
                        Select Team:
                        <select 
                            value={selectedTeam} 
                            onChange={(e) => setSelectedTeam(e.target.value)}
                            className="predictions-select">
                            <option value="">Select a team</option>
                            {teams.map(team => (
                                <option key={team.name} value={team.name}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="predictions-label">
                        Matchday:
                        <input 
                            type="number"
                            placeholder="Matchday"
                            value={matchday}
                            onChange={(e) => {!isUpdate && setMatchday(e.target.value)}}
                            min={1}
                            max={38}
                            className="predictions-input"
                            readOnly={isUpdate}
                            disabled={isUpdate}
                        />
                    </label>

                    <button type="submit" className="predictions-button"> {isUpdate ? "Update Prediction" : "Submit Prediction"} </button>
                </form>

                <h2>Your Predictions</h2>
                <ul className="predictions-list">
                    {predictions.map(prediction => (
                        <li key={prediction.id} className="prediction-item">
                            <div className="prediction-card">
                                <div className="prediction-details">
                                    <div className="prediction-team">{prediction.teamId}</div>
                                    <div className="prediction-matchday">Matchday {prediction.matchday}</div>
                                </div>

                                {canUpdatePrediction(prediction.matchday) && (
                                    <button 
                                        className="update-button"
                                        onClick={() => handleSelectTeam(prediction.teamId, prediction.matchday)}>
                                        Update
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MakePredictions;
