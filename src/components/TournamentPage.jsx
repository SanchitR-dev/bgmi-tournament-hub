// src/components/TournamentPage.jsx

import React, { useState } from 'react';
import TeamManager from './TeamManager';
import MatchManager from './MatchManager';

function TournamentPage({ tournament, updateTournament, goHome }) {
  const [activeTab, setActiveTab] = useState('teams'); // 'teams' or 'matches'

  return (
    <div className="container">
      <div className="header">
        <h1>{tournament.name}</h1>
        <button onClick={goHome} className="back-button">← Back to Tournaments</button>
      </div>

      <div className="tabs">
        <button
          className={activeTab === 'teams' ? 'active' : ''}
          onClick={() => setActiveTab('teams')}
        >
          Teams & Players
        </button>
        <button
          className={activeTab === 'matches' ? 'active' : ''}
          onClick={() => setActiveTab('matches')}
        >
          Matches & Points
        </button>
      </div>

      {activeTab === 'teams' && (
        <TeamManager tournament={tournament} updateTournament={updateTournament} />
      )}

      {activeTab === 'matches' && (
        <MatchManager tournament={tournament} updateTournament={updateTournament} />
      )}
    </div>
  );
}

export default TournamentPage;