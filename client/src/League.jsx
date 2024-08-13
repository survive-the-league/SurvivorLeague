import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from './firebase';
import { collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import axios from 'axios';
import LeagueTable from './LeagueTable';
import './League.css';

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
     * Function to check if predictions should be displayed publicly
     * @param {*} matchday the current matchday to check
     * @returns true if the predictions should be displayed, false otherwise
     */
    const shouldShowPredictions = async (matchday) => {
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
            return false;
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

            // Get the username for the user
            const usernameDoc = await getDoc(doc(db, 'usernames', prediction.userId));
            // If the username exists, use it, otherwise use a default value
            const username = usernameDoc.exists() ? usernameDoc.data().username : "Unknown";

            // Check if the predictions should be shown
            const shouldShow = await shouldShowPredictions(currentMatchday);

            return {
                ...prediction,
                username: username,
                shouldShow: shouldShow
            };
        });

        const resolvedPredictions = await Promise.all(predictionsData);

        // Filter the predictions to show the predictions for the matchday only if the matchday is locked
        const filteredPredictions = resolvedPredictions.filter(userPrediction => userPrediction.shouldShow);
        setPredictions(filteredPredictions);
    };

    return (
        <div className="league-container">
            {league ? (
                <div className="league-container">
                    <h2 className="league-title">{league.name}</h2>
                    <div className="league-details">
                        <h5 className="league-code">Code: {league.code}</h5>
                        <Link to={`/makePredictions/${leagueId}`} className="make-predictions-link">Make Predictions</Link>
                        <h4 className="predictions-title">League Board</h4>
                        <LeagueTable predictions={predictions} />
                    </div>
                </div>
                ) : (
                <p className="loading-text">Loading...</p>
            )}
        </div>
    );
};

export default League;