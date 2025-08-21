
// src/components/MatchManager.jsx
// ** UPDATED FILE **
// A new tab-specific warning has been added.

import React, { useState, useEffect } from 'react';
// use CSS transitions instead of framer-motion
import { useNotification } from './NotificationProvider';

const POINT_PER_KILL = 1;
import { calculateTotalPoints as calcPoints } from '../utils/scoring';

function MatchManager({ tournament, updateTournament }) {
  const [matchResults, setMatchResults] = useState([]);
  const [pointSystem, setPointSystem] = useState(tournament.pointSystem);
  const { showToast, setLoading } = useNotification();

  useEffect(() => {
    setMatchResults(
      tournament.teams.map(team => ({
        teamId: team.id,
        teamName: team.name,
        rank: 0,
        kills: 0,
      }))
    );
  }, [tournament.teams]);

  const handleResultChange = (teamId, field, value) => {
    setMatchResults(
      matchResults.map(r =>
        r.teamId === teamId ? { ...r, [field]: parseInt(value, 10) || 0 } : r
      )
    );
  };

  const handlePointChange = (index, value) => {
    const newPointSystem = [...pointSystem];
    newPointSystem[index] = parseInt(value, 10) || 0;
    setPointSystem(newPointSystem);
  };
  
  const handleSavePoints = () => {
      const updatedTournament = {
          ...tournament,
          pointSystem: pointSystem
      };
      setLoading(true);
      updateTournament(updatedTournament)
        .then(() => showToast('Point system saved!', 'success'))
        .catch((err) => {
          showToast('Failed to save point system', 'error');
          console.error(err);
        })
        .finally(() => setLoading(false));
  }

  const calculateTotalPoints = (rank, kills) => calcPoints(rank, kills, pointSystem, POINT_PER_KILL);

  const leaderboard = matchResults
    .map(r => ({
      ...r,
      totalPoints: calculateTotalPoints(r.rank, r.kills),
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div>
      <div className="tab-warning">
        Heads up: Switching tabs will reset any unsaved rank and kill data below.
      </div>
      <div className="card">
        <h2>Customize Placement Points</h2>
        <div className="points-grid">
          {pointSystem.map((points, index) => (
            <div key={index} className="point-input">
              <label>Rank {index + 1}</label>
              <input
                type="number"
                value={points}
                onChange={(e) => handlePointChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>
        <button onClick={handleSavePoints}>Fix & Save Point Table</button>
      </div>

      <div className="card">
        <h2>Match 1 Results</h2>
        <div className="match-inputs">
          {matchResults.map(result => (
            <div key={result.teamId} className="match-team-row">
              <span className="team-name">{result.teamName}</span>
              <div className="form-group-inline">
                <label>Rank</label>
                <input
                  type="number"
                  value={result.rank}
                  onChange={(e) => handleResultChange(result.teamId, 'rank', e.target.value)}
                />
              </div>
              <div className="form-group-inline">
                <label>Kills</label>
                <input
                  type="number"
                  value={result.kills}
                  onChange={(e) => handleResultChange(result.teamId, 'kills', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Live Leaderboard</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Team Name</th>
              <th>Kills</th>
              <th>Total Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((team, index) => (
              <tr key={team.teamId} className="row-fade">
                <td>{index + 1}</td>
                <td>{team.teamName}</td>
                <td>{team.kills}</td>
                <td>{team.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
  {/* Notifications are handled globally by NotificationProvider */}
      </div>
    </div>
  );
}

export default MatchManager;
