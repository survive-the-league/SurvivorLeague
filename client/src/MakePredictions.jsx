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
    const [currentMatchday, setCurrentMatchday] = useState('');

    /**
     * 
     */
    useEffect(() => {     
        const fetchCurrentMatchday = async () => {
            try {
                const response = await axios.get('http://localhost:3000/fetchCurrentMatchday');
                setCurrentMatchday(response.data.currentMatchday);
            } catch (error) {
                console.error('Error fetching current matchday:', error);
            }
        };  

        /**
         * onAuthStateChanged is a method provided by Firebase Authentication that allows you to subscribe to user state changes.
         */
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
                    
                    // Sort the predictions by matchday for legibility
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

    /**
     * useEffect is a hook in React that allows you to perform side effects in function components. Side effects can include data fetching, 
     * direct DOM manipulations, setting up subscriptions, and more. useEffect runs after the render and can optionally clean up after itself
     * before running again or when the component unmounts.
     */
    useEffect(() => {
        const fetchTeams = async () => {
            // const allTeams = ['Arsenal', 'Aston Villa', 'Brentford', 'Brighton', 'Burnley', 
            //     'Chelsea', 'Crystal Palace', 'Everton', 'Fulham', 'Leeds', 'Leicester', 
            //     'Liverpool', 'Manchester City', 'Manchester United', 'Newcastle', 'Norwich', 'Southampton', 'Tottenham', 
            //     'Watford', 'West Ham', 'Wolves'];
            
            const response = await axios.get('http://localhost:3000/fetchTeams');
            const allTeams = response.data;
            setTeams(allTeams);
            if (user && currentMatchday) {
                // const currentMatchday = await fetchCurrentMatchday();
                // console.log('Current matchday:', currentMatchday); // test
                const previouslyLockedTeams = await getLockedTeams(user.uid, leagueId, currentMatchday);
                // console.log('Previously locked teams:', previouslyLockedTeams); // test
                const availableTeams = filterAvailableTeams(allTeams, previouslyLockedTeams);
                // console.log('Available teams:', availableTeams); // test
                setTeams(availableTeams);
            } else {
                setTeams(allTeams);
            }
        };
        fetchTeams();
    }, [user, leagueId, currentMatchday]);

    // /**
    //  * Helper function to fetch the current matchday from the backend
    //  * @returns the current matchday
    //  */
    // const fetchCurrentMatchday = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:3000/fetchCurrentMatchday');
    //         return response.data.currentMatchday;
    //     } catch (error) {
    //         console.error('Error fetching current matchday:', error);
    //         return null;
    //     }
    // };

    /**
     * Helper function to check if predictions should be locked according to our current matchday
     * @param {*} matchday the current matchday
     * @returns true if predictions should be locked, false otherwise
     */
    const shouldLockPredictions = async (matchday) => {
        try {
            // Get the matches for the current matchday
            const matchesRef = collection(db, 'matches');
            const currentMatchdayQuery = query(matchesRef, where('matchday', '==', parseInt(matchday, 10)));
            const currentMatchdaySnapshot = await getDocs(currentMatchdayQuery);
            console.log('Current matchday snapshot:', currentMatchdaySnapshot.docs); // test
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
            where('matchday', '==', parseInt(matchday, 10)));
        
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
    };

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
            // converting matchday to an integer for ease of comparison in database queries
            matchday: parseInt(matchday, 10),
            teamId: selectedTeam
        });
    };

    /**
     * Helper function to get previously selected teams. NOTE: not previously locked teams, previously selected teams
     * @param {*} userId id of the user
     * @param {*} leagueId id of the league
     * @param {*} currentMatchday current matchday to check if we're before or after 21
     * @returns list of previously selected teams
     */
    const getPreviouslySelectedTeams = async (userId, leagueId, selectedMatchday) => {
        const predictionsRef = collection(db, 'predictions');
        let queryForPredictions;
        // if the matchday is less than or equal to 20, only get predictions for matchdays 1-20
        if (selectedMatchday < 21) {
            queryForPredictions = query(predictionsRef, 
                where('userId', '==', userId), 
                where('leagueId', '==', leagueId),
                // checking for any predictions made 0 <= current matchday <= 20
                where('matchday', '<', 21));
        } else {
            queryForPredictions = query(predictionsRef, 
                where('userId', '==', userId), 
                where('leagueId', '==', leagueId), 
                // checking for any predictions made 21 <= current matchday <= 38
                where('matchday', '>=', 21));
        }
        const querySnapshot = await getDocs(queryForPredictions);
        const teams = querySnapshot.docs.map(doc => doc.data().teamId);
        return teams;
    };

    /**
     * Helper function to get previously selected teams
     * @param {*} userId id of the user
     * @param {*} leagueId id of the league
     * @returns list of previously selected teams
     */
    const getLockedTeams = async (userId, leagueId, currentMatchday) => {
        const predictionsRef = collection(db, 'predictions');
        let queryForPredictions;
        // if the matchday is less than or equal to 20, only get predictions for matchdays 1-20
        if (currentMatchday < 21) {
            queryForPredictions = query(predictionsRef, 
                where('userId', '==', userId), 
                where('leagueId', '==', leagueId),
                where('matchday', '<', parseInt(currentMatchday, 10)));
        } else {
            queryForPredictions = query(predictionsRef, 
                where('userId', '==', userId), 
                where('leagueId', '==', leagueId), 
                where('matchday', '>=', 21), 
                where('matchday', '<=', parseInt(currentMatchday, 10)));
        }
        const querySnapshot = await getDocs(queryForPredictions);
        const teams = querySnapshot.docs.map(doc => doc.data().teamId);
        return teams;
    };

    /**
     * Helper function to filter available teams (we exclude teams already picked by user)
     * @param {*} allTeams list of all teams in the BPL
     * @param {*} previouslySelectedTeams list of previously selected teams
     * @returns filtered list of available teams
     */
    const filterAvailableTeams = (allTeams, previouslySelectedTeams) => {
        return allTeams.filter(team => !previouslySelectedTeams.includes(team.name));
    };

    /**
     * Helper function to check if a team can be selected
     * @param {*} selectedTeam current team the user has selected
     * @param {*} previouslySelectedTeams list of previously selected teams
     * @returns true if the team can be selected, false otherwise
     */
    const canSelectTeam = async (selectedTeam, previouslySelectedTeams) => {
        return !previouslySelectedTeams.includes(selectedTeam)
    };

    /**
     * Function to handle making a prediction
     * @returns error message if prediction fails
     */
    const handlePrediction = async () => {
        if (user && selectedTeam && matchday) {
            try {
                // Check if the matchday is valid
                if (matchday < 1 || matchday > 38) {
                    alert('Matchday must be between 1 and 38');
                    return;
                }

                // Check if predictions for the selected matchday should be locked
                const shouldLock = await shouldLockPredictions(matchday);
                if (shouldLock) {
                    alert('Predictions are locked for this matchday');
                    return;
                }

                const previouslySelectedTeams = await getPreviouslySelectedTeams(user.uid, leagueId, matchday);
                const canSelect = await canSelectTeam(selectedTeam, previouslySelectedTeams, matchday);
                if (!canSelect) {
                    alert('You have already selected this team for a past matchday.');
                    return;
                }

                // check if the user has made an existing prediction for the selected matchday (thus we need to update the prediction)
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
                {
                teams.map(team => (
                    <option key={team.name} value={team.name}>
                        {team.name}
                    </option>
                ))}
            </select>
            <input
                type='number'
                placeholder='matchday'
                value={matchday}
                onChange={(e) => {
                    setMatchday(e.target.value)
                }}
                min={1}
                max={38}
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