import { useState, useEffect, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../config/firebase";
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import axios from "axios";
import LeagueTable from "../../components/LeagueTable";
import "./League.css";
import { toast } from "react-toastify";
// import { useAuth } from './AuthContext';

const League = () => {
  const { leagueId } = useParams();
  const [league, setLeague] = useState(null);
  const [currentMatchday, setCurrentMatchday] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [currentLives, setCurrentLives] = useState("");
  const navigate = useNavigate();
  console.log("🚀 ~ file: index.jsx:17 ~ League ~ currentLives:", currentLives);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  /**
   * useEffect is a React Hook that lets you synchronize a component with an external system.
   */
  useEffect(() => {
    const fetchLeague = async () => {
      const leagueCollection = collection(db, "leagues");
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
      const matchdayDoc = await getDoc(doc(db, "metadata", "currentMatchday"));
      if (matchdayDoc.exists()) {
        setCurrentMatchday(matchdayDoc.data().value);
      } else {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_APP_API_BASE_URL}/fetchCurrentMatchday`
          );
          setCurrentMatchday(response.data.currentMatchday);
        } catch (error) {
          console.error("Error fetching current matchday:", error);
        }
      }
    };

    /**
     * Fetches the current lives for the user from the database
     */
    const fetchCurrentLives = async () => {
      const userRef = collection(db, "users");
      const userLeagueRef = doc(
        userRef,
        currentUser.userId,
        "leagues",
        leagueId
      );
      const userLeagueSnapshot = await getDoc(userLeagueRef);
      if (userLeagueSnapshot.exists()) {
        setCurrentLives(userLeagueSnapshot.data().lives);
      } else {
        setCurrentLives("Err");
      }
    };

    fetchLeague();
    fetchCurrentMatchdayFromDatabase();
    fetchCurrentLives();
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
      // If the matchday already happened, you can show the predictions
      if (matchday < currentMatchday) {
        return true;
      } else if (parseInt(matchday, 10) == parseInt(currentMatchday, 10)) {
        // Get the matches for the current matchday
        const matchesRef = collection(db, "matches");
        console.log(matchesRef);
        const currentMatchdayQuery = query(
          matchesRef,
          where("matchday", "==", matchday)
        );
        const currentMatchdaySnapshot = await getDocs(currentMatchdayQuery);
        console.log(currentMatchdaySnapshot.docs);
        if (currentMatchdaySnapshot.docs.length == 0) {
          return true;
        }
        // sort the matches by start time and get the first match
        const currentTime = new Date();
        const firstMatchStartTime = currentMatchdaySnapshot.docs
          .map((doc) => new Date(doc.data().utcDate))
          .sort((a, b) => a - b)[0];
        // check if the current time is greater than the first match start time
        return currentTime >= firstMatchStartTime;
      }
      return false;
    } catch (error) {
      console.error("Error checking if predictions should be locked:", error);
      return false;
    }
  };

  const fetchCurrentLives = async (userId) => {
    const userRef = collection(db, "users");
    const userLeagueRef = doc(userRef, userId, "leagues", leagueId);
    const userLeagueSnapshot = await getDoc(userLeagueRef);
    if (userLeagueSnapshot.exists()) {
      return userLeagueSnapshot.data().lives;
    } else {
      return "Err";
    }
  };

  /**
   * Fetches the predictions for the current and previous matchdays from the database
   *
   * This is a very expensive and poorly designed function. It fetches all the predictions for the league and then filters them
   */
  const fetchUsersPredictions = async () => {
    // Get the predictions collection
    const predictionsCollection = collection(db, "predictions");
    // Create a query to get the predictions for previous and current matchdays
    const q = query(
      predictionsCollection,
      where("leagueId", "==", leagueId),
      where("matchday", "<=", currentMatchday)
    );

    // Get the predictions for the current matchday
    const querySnapshot = await getDocs(q);
    // Get the data from the query snapshot
    const predictionsData = querySnapshot.docs.map(async (document) => {
      const prediction = document.data();

      // Get the username for the user
      const usernameDoc = await getDoc(doc(db, "usernames", prediction.userId));
      console.log(usernameDoc, "usernameDoc");
      // If the username exists, use it, otherwise use a default value
      const username = usernameDoc.exists()
        ? usernameDoc.data().username
        : "Unknown";

      // Check if the predictions should be shown
      const shouldShow = await shouldShowPredictions(prediction.matchday);

      const currentLives = await fetchCurrentLives(prediction.userId);
      return {
        ...prediction,
        username: username,
        shouldShow: shouldShow,
        currentLives: currentLives,
      };
    });

    const resolvedPredictions = await Promise.all(predictionsData);
    console.log(resolvedPredictions, "resolvedPredictions");
    // Filter the predictions to show the predictions for the matchday only if the matchday is locked
    const filteredPredictions = resolvedPredictions.filter(
      (userPrediction) => userPrediction.shouldShow
    );
    console.log(filteredPredictions, "filteredPredictions");

    setPredictions(resolvedPredictions);
  };

  const handleMakePrediction = () => {
    if (currentLives !== 0) {
      navigate(`/makePredictions/${leagueId}`);
    }else{
        toast.warn("You cannot make predictions because your lives are 0.")
    }
  };

  return (
    <div className="league-container">
      {league ? (
        <Fragment>
          <div className="league-title-main">
            <div>
              <h2 className="league-title">{league.name}</h2>

              <h5 className="league-code">Code: {league.code}</h5>
            </div>
            {/* <Link
              to={`/makePredictions/${leagueId}`}
              className="make-predictions-link"
            >
              Make Predictions
            </Link> */}
            <button
              className="make-predictions-link"
              onClick={handleMakePrediction}
            >
              Make Predictions
            </button>
          </div>

          <h4 className="predictions-title">League Board</h4>
          {/* <h6 className="league-code">Current Lives: {currentLives}</h6> */}
          <LeagueTable predictions={predictions} />
        </Fragment>
      ) : (
        <p className="loading-text">Loading...</p>
      )}
    </div>
  );
};

export default League;
