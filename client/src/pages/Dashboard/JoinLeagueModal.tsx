import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import "./CreateLeagueModal.css";
import { toast } from "react-toastify";
import { joinLeague } from "../../services/league.service";
import { AuthContext } from "@/context/Auth/AuthContext";

interface JoinLeagueModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (leagueCode: string) => void;
}

export const JoinLeagueModal: React.FC<JoinLeagueModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [leagueCode, setLeagueCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await joinLeague(leagueCode, currentUser?.id || "");
      toast.success("Request sent to join the league!");
      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Error sending request to join the league"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header-bar">
          <div className="modal-header">Join League</div>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-group">
            <label htmlFor="league-code" className="modal-label">
              League code
            </label>
            <input
              id="league-code"
              className="modal-input"
              value={leagueCode}
              onChange={(e) => setLeagueCode(e.target.value)}
              placeholder="Enter the league code"
              required
            />
          </div>
          <button type="submit" className="modal-btn" disabled={isLoading}>
            {isLoading ? "Joining..." : "Join League"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};
