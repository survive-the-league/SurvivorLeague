import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from './firebase';
import { useParams } from 'react-router-dom';

const MakePredictions = () => {
    const { leagueId } = useParams();
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [matchweek, setMatchweek] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {

        setTeams(['Arsenal', 'Aston Villa', 'Brentford', 'Brighton', 'Burnley', 'Chelsea', 'Crystal Palace', 'Everton', 'Fulham', 'Leeds', 'Leicester', 'Liverpool', 'Manchester City', 'Manchester United', 'Newcastle', 'Norwich', 'Southampton', 'Tottenham', 'Watford', 'West Ham', 'Wolves']);
        auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
    }, []);

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
        </div>
    );
};

export default MakePredictions;