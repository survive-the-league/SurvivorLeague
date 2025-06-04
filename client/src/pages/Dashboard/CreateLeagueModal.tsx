import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./CreateLeagueModal.css";

interface CreateLeagueModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

const leagueOptions = [
  { value: "premier", label: "Premier League" },
  { value: "laliga", label: "La Liga" },
  { value: "seriea", label: "Serie A" },
];

const matchWeeks = [
  { value: "MW1", label: "MW1" },
  { value: "MW2", label: "MW2" },
  { value: "MW3", label: "MW3" },
];

const penaltyOptions = [
  { value: "loss", label: "Loss of life" },
  { value: "none", label: "No penalty" },
];

const tieOptions = [
  { value: "wins", label: "Wins" },
  { value: "losses", label: "Losses" },
];

export const CreateLeagueModal: React.FC<CreateLeagueModalProps> = ({ open, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [league, setLeague] = useState(leagueOptions[0].value);
  const [matchWeek, setMatchWeek] = useState(matchWeeks[0].value);
  const [lives, setLives] = useState(3);
  const [penalty, setPenalty] = useState(penaltyOptions[0].value);
  const [allowReentries, setAllowReentries] = useState(true);
  const [tiesCount, setTiesCount] = useState(tieOptions[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ name, league, matchWeek, lives, penalty, allowReentries, tiesCount });
    }
  };

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header-bar">
          <div className="modal-header">Create League</div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-section-title">League Details</div>
          <div className="modal-group">
            <label htmlFor="league-name" className="modal-label">Name of the league</label>
            <input id="league-name" className="modal-input" value={name} onChange={e => setName(e.target.value)} placeholder="League 1" required />
          </div>
          <div className="modal-group">
            <label htmlFor="league-select" className="modal-label">Select a League</label>
            <select id="league-select" className="modal-input" value={league} onChange={e => setLeague(e.target.value)}>
              {leagueOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="modal-group">
            <label htmlFor="matchweek-select" className="modal-label">Select Match Week</label>
            <select id="matchweek-select" className="modal-input" value={matchWeek} onChange={e => setMatchWeek(e.target.value)}>
              {matchWeeks.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <input className="modal-input modal-input-disabled" value="After finishing the match week, no user will be able to join" disabled />

          <div className="modal-section-title">Advanced league settings</div>
          <div className="modal-group">
            <label htmlFor="lives" className="modal-label">Number of lives</label>
            <input id="lives" type="number" min={1} className="modal-input" value={lives} onChange={e => setLives(Number(e.target.value))} />
            <span className="modal-help">How many lives each player will have in the league.</span>
          </div>
          <div className="modal-group">
            <label htmlFor="penalty-select" className="modal-label">If a player forgets to pick</label>
            <select id="penalty-select" className="modal-input" value={penalty} onChange={e => setPenalty(e.target.value)}>
              {penaltyOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="modal-group modal-group-row">
            <div>
              <label htmlFor="reentries-switch" className="modal-label">Allow re-entries</label>
              <span className="modal-help">Allow players to re-enter the league after losing all their lives.</span>
            </div>
            <label className="switch">
              <input id="reentries-switch" type="checkbox" checked={allowReentries} onChange={e => setAllowReentries(e.target.checked)} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="modal-group">
            <label htmlFor="ties-select" className="modal-label">Ties count as</label>
            <select id="ties-select" className="modal-input" value={tiesCount} onChange={e => setTiesCount(e.target.value)}>
              {tieOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className="modal-help">How ties are counted in predictions.</span>
          </div>
          <button type="submit" className="modal-btn">Generate Invite Link</button>
        </form>
      </div>
    </div>,
    document.body
  );
}; 