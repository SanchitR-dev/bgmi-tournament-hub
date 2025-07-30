// src/components/TeamManager.jsx

import React, { useState } from 'react';

function TeamManager({ tournament, updateTournament }) {
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState(['', '', '', '']);

  const handlePlayerChange = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const handleAddTeam = (e) => {
    e.preventDefault();
    if (!teamName.trim() || players.some(p => !p.trim())) {
      alert('Please fill in the team name and all four player names.');
      return;
    }

    const newTeam = {
      id: Date.now(),
      name: teamName,
      players: players,
    };

    const updatedTournament = {
      ...tournament,
      teams: [...tournament.teams, newTeam],
    };
    updateTournament(updatedTournament);

    // Reset form
    setTeamName('');
    setPlayers(['', '', '', '']);
  };

  return (
    <div>
      <div className="card">
        <h2>Add New Team</h2>
        <form onSubmit={handleAddTeam}>
          <div className="form-group">
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team Name"
            />
          </div>
          <div className="player-inputs">
            {players.map((player, index) => (
              <input
                key={index}
                type="text"
                value={player}
                onChange={(e) => handlePlayerChange(index, e.target.value)}
                placeholder={`Player ${index + 1} Name`}
              />
            ))}
          </div>
          <button type="submit">Add Team</button>
        </form>
      </div>

      {tournament.teams.length > 0 && (
        <div className="card">
          <h2>Registered Teams</h2>
          {tournament.teams.map(team => (
            <div key={team.id} className="team-details">
              <h3>{team.name}</h3>
              <ul>
                {team.players.map((player, i) => (
                  <li key={i}>{player}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TeamManager;