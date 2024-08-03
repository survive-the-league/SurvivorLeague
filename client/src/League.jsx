import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from './firebase';
import { collection, doc, getDoc } from 'firebase/firestore';


const League = () => {
    const { leagueId } = useParams();
    const [league, setLeague] = useState(null);

    useEffect(() => {
        const fetchLeague = async () => {
            const leagueCollection = collection(db, 'leagues')
            const leagueRef = doc(leagueCollection, leagueId);
            const leagueDoc = await getDoc(leagueRef);
            if (leagueDoc.exists) {
                setLeague(leagueDoc.data());
            }
        };
        fetchLeague();
    }, [leagueId]);

    return (
        <div>
            <h2>League</h2>
            {league ? (
                <div>
                    <h3>{league.name}</h3>
                    <p>{league.description}</p>
                    <Link to={`/makePredictions/${leagueId}`}>Make Predictions</Link>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default League;