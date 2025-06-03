import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import "./LeagueTable.css";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { MdLockOutline } from "react-icons/md";

// eslint-disable-next-line react/prop-types
const LeagueTable = ({ predictions }) => {
  const { leagueId } = useParams();

  // State to store user lives
  const [userLives, setUserLives] = useState({});

  // Memoize groupedPredictions to avoid recalculating on every render
  const groupedPredictions = useMemo(() => {
    return predictions.reduce((acc, prediction) => {
      const { username, matchday, userId } = prediction;
      if (!acc[username]) {
        acc[username] = { username, userId, predictionsByMatchday: {} };
      }

      // If the matchday does not exist, create an empty array
      if (!acc[username].predictionsByMatchday[matchday]) {
        acc[username].predictionsByMatchday[matchday] = [];
      }

      // Add the prediction to the array
      acc[username].predictionsByMatchday[matchday].push(prediction);
      return acc;
    }, {});
  }, [predictions]);

  // Function to fetch lives for a single user
  const fetchCurrentLives = async (userID) => {
    try {
      const userRef = collection(db, "users");
      const userLeagueRef = doc(userRef, userID, "leagues", leagueId);
      const userLeagueSnapshot = await getDoc(userLeagueRef);

      if (userLeagueSnapshot.exists()) {
        return userLeagueSnapshot.data().lives;
      } else {
        toast.error("User not found");
        return null;
      }
    } catch (error) {
      toast.error("Failed to fetch lives");
      return null;
    }
  };

  // Fetch lives for all users when the component mounts
  useEffect(() => {
    const fetchAllLives = async () => {
      const livesData = {};

      for (const user of Object.values(groupedPredictions)) {
        const lives = await fetchCurrentLives(user.userId);
        if (lives !== null) {
          livesData[user.userId] = lives;
        }
      }

      setUserLives(livesData);
    };

    fetchAllLives();
  }, [groupedPredictions, leagueId]);

  // Convert the object to an array and sort by lives and username
  const users = useMemo(() => {
    const userArray = Object.values(groupedPredictions).map((user) => ({
      ...user,
      lives: userLives[user.userId] ?? null, // Add lives to the user object
    }));

    // Sort users: by lives (desc), then username (asc)
    return userArray.sort((a, b) => {
      // Sort by lives in descending order
      if (b.lives !== a.lives) {
        return b.lives - a.lives;
      }
      // Sort by username in ascending order if lives are equal
      return a.username.localeCompare(b.username);
    });
  }, [groupedPredictions, userLives]);

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
          {users.map((user, index) => {
            const lives = user.lives ?? "Loading...";
            return (
              <tr key={index}>
                <td>{user.username} | {" "} {lives}</td>
                {Array.from({ length: 38 }, (_, i) => {
                  const matchday = i + 1;
                  return (
                    <td
                      key={matchday}
                      className={`prediction-outcome-${
                        user.predictionsByMatchday[matchday]?.[0]
                          ?.predictionOutcome || "no-prediction"
                      }`}
                    >
                      {user.predictionsByMatchday[matchday]?.[0]?.teamId ? user.predictionsByMatchday[matchday]?.[0]?.teamId : lives === 0 ? <MdLockOutline  className="lock-icon"/> : "-"}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeagueTable;
