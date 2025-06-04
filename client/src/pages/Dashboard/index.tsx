import { useContext, useEffect, useState } from "react";
// import { useAuth } from './AuthContext';
import { Link } from "react-router-dom";
// import { db } from './firebase';
// import { doc } from "firebase/firestore";
import "./Dashboard.css";
import { AuthContext } from "@/context/Auth/AuthContext";
// import { db } from "../../config/firebase";
import PropTypes from "prop-types";
import { CreateLeagueModal } from "./CreateLeagueModal";

const Dashboard = () => {
  const { currentUser, logout } = useContext(AuthContext);
  // const [leagues, setLeagues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      setIsLoading(true);
      setError(null);

      try {
        // const userRef = doc(db, "users", currentUser.id);
        // const leaguesRef = collection(db, "leagues");
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error loading dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // MOCK DATA
  const mockMyLeagues = [
    {
      id: "1",
      name: "League 1",
      endDate: "2025-08-05",
      users: Array(12).fill({ id: "user" }),
      createdBy: "otherUser",
    },
    {
      id: "2",
      name: "League 2",
      endDate: "2025-08-05",
      users: Array(32).fill({ id: "user" }),
      createdBy: "otherUser",
    },
  ];

  const mockCreatedLeagues = [
    {
      id: "3",
      name: "League 3",
      endDate: "2025-08-05",
      users: Array(24).fill({ id: "user" }),
      createdBy: "currentUser",
    },
    {
      id: "4",
      name: "League 4",
      endDate: "2025-08-05",
      users: Array(12).fill({ id: "user" }),
      createdBy: "currentUser",
    },
  ];

  // --- NUEVO: Filtrar ligas creadas y donde soy miembro ---
  const myLeagues = mockMyLeagues;
  const createdLeagues = mockCreatedLeagues;

  // --- Función para formatear la fecha ---
  const formatDate = (_dateStr?: string) => {
    // Placeholder temporal
    return "Aug 5, 2025";
  };

  interface League {
    id: string;
    name: string;
    endDate?: string;
    users?: { id: string }[];
    createdBy?: string;
  }

  const LeagueCard: React.FC<{ league: League }> = ({ league }) => (
    <div className="league-card">
      <Link to={`/league/${league.id}`} className="league-link">
        {league.name}
      </Link>
      <div className="league-info-row">
        <span className="league-date">
          <i className="fa-regular fa-calendar" style={{ marginRight: 4 }} />
          Ends {formatDate(league.endDate)}
        </span>
        <span className="league-alert">
          <i
            className="fa-regular fa-circle-exclamation"
            style={{ marginRight: 4 }}
          />
          Make your MW pick
        </span>
        <span className="league-users">
          <img
            src="/assets/participants-icon.svg"
            alt="Participants"
            className="league-users-icon"
            style={{ marginRight: 6 }}
          />
          {league.users ? league.users.length : 0}
        </span>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="home-bg-main">
        <div className="dashboard-container">
          <div style={{ color: "white", textAlign: "center" }}>
            Loading dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-bg-main">
        <div className="dashboard-container">
          <div style={{ color: "red", textAlign: "center" }}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-bg-main">
      <div className="dashboard-container">
        <header className="dashboard-header">
          {/* <div className="dashboard-title">Dashboard</div> */}
        </header>
        <section className="leagues-section">
          <div className="dashboard-title">Dashboard</div>
          <div className="leagues-header-row">
            <h2 className="leagues-title">My Leagues</h2>
            <div className="leagues-actions">
              <div className="dashboard-search-wrapper">
                <img
                  src="/assets/magnifying-glass.svg"
                  alt="Search"
                  className="dashboard-search-icon"
                />
                <input
                  type="text"
                  placeholder="Search"
                  className="dashboard-search"
                />
              </div>
              <Link to="/join-league" className="dashboard-btn">
                Join A League
              </Link>
            </div>
          </div>
          <div className="leagues-list">
            {myLeagues.length > 0 ? (
              myLeagues.map((league) => (
                <LeagueCard key={league.id} league={league} />
              ))
            ) : (
              <div style={{ color: "white", textAlign: "center" }}>
                No leagues found
              </div>
            )}
          </div>
        </section>
        <section className="leagues-section">
          <div className="leagues-header-row">
            <h2 className="leagues-title">Leagues created</h2>
            <button
              className="dashboard-btn"
              type="button"
              onClick={() => setShowCreateModal(true)}
            >
              Create League
            </button>
          </div>
          <div className="leagues-list">
            {createdLeagues.length > 0 ? (
              createdLeagues.map((league) => (
                <LeagueCard key={league.id} league={league} />
              ))
            ) : (
              <div style={{ color: "white", textAlign: "center" }}>
                No leagues found
              </div>
            )}
          </div>
        </section>
        <footer className="dashboard-footer">
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </footer>
      </div>
      <CreateLeagueModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={(data) => {
          setShowCreateModal(false);
          // Aquí puedes manejar la data del formulario
        }}
      />
    </div>
  );
};

export default Dashboard;
