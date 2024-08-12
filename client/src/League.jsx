import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from './firebase';
import { collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import axios from 'axios';

const League = () => {
    const { leagueId } = useParams();
    const [league, setLeague] = useState(null);
    const [currentMatchday, setCurrentMatchday] = useState('');
    const [predictions, setPredictions] = useState([]);

    /**
     * useEffect is a React Hook that lets you synchronize a component with an external system.
     */
    useEffect(() => {
        const fetchLeague = async () => {
            const leagueCollection = collection(db, 'leagues')
            const leagueRef = doc(leagueCollection, leagueId);
            const leagueDoc = await getDoc(leagueRef);
            if (leagueDoc.exists) {
                setLeague(leagueDoc.data());
            }
        };

        /**
        * Fetches the current matchday from the backend. Also reused from MakePredictions. Refactor in future.
        */
        const fetchCurrentMatchdayFromDatabase = async () => {
            const matchdayDoc = await getDoc(doc(db, 'metadata', 'currentMatchday'));
            if (matchdayDoc.exists()) {
                setCurrentMatchday(matchdayDoc.data().value);
            } else {
                try {
                    const response = await axios.get('http://localhost:3000/fetchCurrentMatchday');
                    setCurrentMatchday(response.data.currentMatchday);
                } catch (error) {
                    console.error('Error fetching current matchday:', error);
                }
            }
        };

        fetchLeague();
        fetchCurrentMatchdayFromDatabase();
        // list of dependencies for the useEffect hook
    }, [leagueId]);

    useEffect(() => {
        if (currentMatchday !== null) {
            fetchUsersPredictions();
        }
    }, [currentMatchday]);

    /**
     * Helper function to check if predictions should be locked according to our current matchday
     * Note: this is a repeated function. Refactor it to a utility function
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
     * Fetches the predictions for the current and previous matchdays from the database
     */
    const fetchUsersPredictions = async () => {
        // Get the predictions collection
        const predictionsCollection = collection(db, 'predictions');
        // Create a query to get the predictions for previous and current matchdays
        const q = query(predictionsCollection, where('leagueId', '==', leagueId), where('matchday', '<=', currentMatchday));

        // Get the predictions for the current matchday
        const querySnapshot = await getDocs(q);
        // Get the data from the query snapshot
        const predictionsData = querySnapshot.docs.map(async (document) => {
            const prediction = document.data();

            const nicknameDoc = await getDoc(doc(db, 'nicknames', prediction.userId));
            const nickname = nicknameDoc.exists() ? nicknameDoc.data().nickname : "Create Nickname";

            return {
                ...prediction,
                nickname: nickname
            };
        });

        const resolvedPredictions = await Promise.all(predictionsData);

        // Filter the predictions to only show the predictions for the current matchday if the matchday is locked
        const filteredPredictions = resolvedPredictions.filter(prediction => {
            if (prediction.matchday === currentMatchday) {
                // console.log('currentMatchday:', currentMatchday);
                // console.log('shouldLockPredictions:', shouldLockPredictions(currentMatchday));
                return shouldLockPredictions(currentMatchday);
            }
            return false;
        });
        setPredictions(filteredPredictions);
    };

    return (
        <div>
            <h2>League</h2>
            {league ? (
                <div>
                    <h3>{league.name}</h3>
                    <p>{league.description}</p>
                    <Link to={`/makePredictions/${leagueId}`}>Make Predictions</Link>

                    <h4>Predictions</h4>
                    <ul>
                        {predictions.map((prediction, index) => (
                            <li key={index}>
                                User: {prediction.nickname}, Matchday: {prediction.matchday}, Team: {prediction.teamId}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default League;