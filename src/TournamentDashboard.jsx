import React, { useState } from 'react';
import './TournamentDashboard.css';

const POINT_PER_KILL = 1;

function TournamentDashboard() {
  const [placementPoints, setPlacementPoints] = useState([15, 12, 10, 8, 6, 4, 2, 1, 1, 1]);
  const [teams, setTeams] = useState([
    { id: 1, name: 'Team SouL', rank: 1, kills: 10 },
    { id: 2, name: 'GodLike', rank: 2, kills: 8 },
    { id: 3, name: 'TSM', rank: 3, kills: 12 },
    { id: 4, name: 'Hydra', rank: 4, kills: 5 },
    { id: 5, name: 'Blind Esports', rank: 5, kills: 7 },
  ]);

  const handlePointChange = (index, value) => {
    const newPoints = [...placementPoints];
    newPoints[index] = parseInt(value, 10) || 0;
    setPlacementPoints(newPoints);
  };

  const calculateTotalPoints = (rank, kills) => {
    const placementScore = rank > 0 && rank <= placementPoints.length ? placementPoints[rank - 1] : 0;
    const killScore = kills * POINT_PER_KILL;
    return placementScore + killScore;
  };

  const sortedTeams = [...teams]
    .map(team => ({
      ...team,
      totalPoints: calculateTotalPoints(team.rank, team.kills),
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="container">
      <h1>BGMI Tournament Hub</h1>
      <div className="settings-card">
        <h2>Customize Placement Points</h2>
        <div className="points-grid">
          {placementPoints.map((points, index) => (
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
      </div>
      <div className="leaderboard-card">
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
            {sortedTeams.map((team, index) => (
              <tr key={team.id}>
                <td>{index + 1}</td>
                <td>{team.name}</td>
                <td>{team.kills}</td>
                <td>{team.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TournamentDashboard;