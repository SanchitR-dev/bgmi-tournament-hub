// src/components/TeamManager.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from './NotificationProvider';

function TeamManager({ tournament, updateTournament }) {
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState(['', '', '', '']);
  const { showToast, setLoading } = useNotification();

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

    setLoading(true);
    updateTournament(updatedTournament)
      .then(() => {
        showToast('Team saved', 'success');
        // Reset form
        setTeamName('');
        setPlayers(['', '', '', '']);
      })
      .catch((err) => {
        showToast('Failed to save team', 'error');
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteTeam = (teamId) => {
    const remaining = tournament.teams.filter((t) => t.id !== teamId);
    const updatedTournament = { ...tournament, teams: remaining };
    // Prepare undo
    const undo = () => updateTournament(tournament);
    setLoading(true);
    updateTournament(updatedTournament)
      .then(() => {
        showToast({ message: 'Team deleted', type: 'info', ttl: 5000, undo });
      })
      .catch((err) => {
        showToast('Failed to delete team', 'error');
        console.error(err);
      })
      .finally(() => setLoading(false));
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
          <AnimatePresence>
            {tournament.teams.map(team => (
              <motion.div
                key={team.id}
                className="team-details"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                layout
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0 }}>{team.name}</h3>
                  <div>
                    <button onClick={() => handleDeleteTeam(team.id)} style={{ marginLeft: 8 }}>Delete</button>
                  </div>
                </div>
                <ul>
                  {team.players.map((player, i) => (
                    <li key={i}>{player}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

  {/* Notifications are handled globally by NotificationProvider */}
    </div>
  );
}

export default TeamManager;