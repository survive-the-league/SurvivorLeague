import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./middleware/ProtectedRoute";
import JoinLeague from "./pages/JoinLeague";
import { CreateLeaguePage } from "./pages/CreateLeague/CreateLeaguePage";
import { AuthProvider } from "./context/Auth/AuthProvider";
import MakePredictions from "./pages/MakePredictions";
import League from "./pages/League";
import Dashboard from "./pages/Dashboard";
import { LoginPage } from "./pages/Auth/Login/LoginPage";
import { SignUpPage } from "./pages/Auth/SignUp/SignUpPage";
import { ForgotPasswordPage } from "./pages/Auth/ForgotPassword/ForgotPassword";
import { useContext } from "react";
import { AuthContext } from "./context/Auth/AuthContext";
import Layout from "./components/Layout/Layout";

const RootRedirect = () => {
  const { currentUser } = useContext(AuthContext);
  return <Navigate to={currentUser ? "/dashboard" : "/login"} replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/join-league"
            element={
              <ProtectedRoute>
                <Layout>
                  <JoinLeague />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-league"
            element={
              <ProtectedRoute>
                <Layout>
                  <CreateLeaguePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/league/:leagueId"
            element={
              <ProtectedRoute>
                <Layout>
                  <League />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/makePredictions/:leagueId"
            element={
              <ProtectedRoute>
                <Layout>
                  <MakePredictions />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
