import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { AuthContext } from "@/context/Auth/AuthContext";
import { CreateLeagueModal } from "./CreateLeagueModal";
import { JoinLeagueModal } from "./JoinLeagueModal";
import axios from "axios";
import { League } from "@/types/league.types";

const Dashboard = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [myLeagues, setMyLeagues] = useState<League[]>([]);
  const [createdLeagues, setCreatedLeagues] = useState<League[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      setIsLoading(true);
      setError(null);

      try {
        const token = currentUser.token;
        
        // Fetch both leagues in parallel
        const [myLeaguesResponse, createdLeaguesResponse] = await Promise.all([
          // Fetch leagues where user is a participant
          axios.get(
            `${import.meta.env.VITE_APP_API_BASE_URL}/leagues/my-leagues/${currentUser.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          ),
          // Fetch leagues created by the user
          axios.get(
            `${import.meta.env.VITE_APP_API_BASE_URL}/leagues/${currentUser.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
        ]);
        
        if (myLeaguesResponse.data.success) {
          setMyLeagues(myLeaguesResponse.data.data);
        }

        if (createdLeaguesResponse.data.success) {
          setCreatedLeagues(createdLeaguesResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error loading dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // --- Función para formatear la fecha ---
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "No end date";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const LeagueCard: React.FC<{ league: League }> = ({ league }) => {
    const pending = Array.isArray((league as any).pendingRequests) && currentUser && (league as any).pendingRequests.includes(currentUser.id);
    return (
      <div className="league-card">
        <Link to={`/league/${league.id}`} className="league-link">
          {league.name}
        </Link>
        <div className="league-info-row">
          <span className="league-date">
            <i className="fa-regular fa-calendar" style={{ marginRight: 4 }} />
            Ends {formatDate(league.endDate)}
          </span>
          {pending ? (
            <span className="pending-chip">Pending approval</span>
          ) : (
            <span className="league-alert">
              <i
                className="fa-regular fa-circle-exclamation"
                style={{ marginRight: 4 }}
              />
              Make your MW pick
            </span>
          )}
          <span className="league-users">
            <img
              src="/assets/participants-icon.svg"
              alt="Participants"
              className="league-users-icon"
              style={{ marginRight: 6 }}
            />
            {league.participants.length}
          </span>
        </div>
      </div>
    );
  };

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
              <button
                className="dashboard-btn"
                type="button"
                onClick={() => setShowJoinModal(true)}
              >
                Join A League
              </button>
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
        onSubmit={(data: League) => {
          setShowCreateModal(false);
          // Add the new league to the created leagues list
          setCreatedLeagues(prev => [...prev, data]);
          // Also add it to my leagues since the creator is automatically a member
          setMyLeagues(prev => [...prev, data]);
        }}
      />
      <JoinLeagueModal
        open={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSubmit={(leagueCode: string) => {
          setShowJoinModal(false);
          // Aquí puedes agregar la lógica para unirse a la liga usando el código
          // Por ahora solo cierra el modal
        }}
      />
    </div>
  );
};

export default Dashboard;
