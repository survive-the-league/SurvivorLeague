import React from 'react';
import './LeagueTable.css';

const LeagueTable = ({ predictions }) => {

    // Group predictions by user and matchday
    const groupedPredictions = predictions.reduce((acc, prediction) => {
        const { username, matchday } = prediction;
        if (!acc[username]) {
            acc[username] = { username, predictionsByMatchday: {} };
        }

        // If the matchday does not exist, create an empty array
        if (!acc[username].predictionsByMatchday[matchday]) {
            acc[username].predictionsByMatchday[matchday] = [];
        }

        // Add the prediction to the array
        acc[username].predictionsByMatchday[matchday].push(prediction);
        return acc;
    }, {});

    // Convert the object to an array
    const users = Object.values(groupedPredictions);

    return (
        <div className="league-table-scrollable-wrapper">
                <table className="league-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            {Array.from({ length: 38 }, (_, i) => (
                                <th key={i + 1}>MD{i + 1}</th>
                            ))}
                        </tr>
                    </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                        <td>{user.username}</td>
                            {Array.from({ length: 38 }, (_, i) => {
                                const matchday = i + 1;
                                return (
                                    <td key={matchday} className={`prediction-outcome-${user.predictionsByMatchday[matchday]?.[0]?.predictionOutcome || 'no-prediction'}`}>
                                        {user.predictionsByMatchday[matchday]?.[0]?.teamId || '-'}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LeagueTable;