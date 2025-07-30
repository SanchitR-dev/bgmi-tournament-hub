import React, { useState } from 'react';

function HomePage({ tournaments, addTournament, setSelectedTournament }) {
  const [tournamentName, setTournamentName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tournamentName.trim()) {
      addTournament(tournamentName);
      setTournamentName('');
    }
  };

  const isInputEmpty = !tournamentName.trim();

  return (
    <div className="container">
      <h1>BGMI Tournament Hub</h1>
      <div className="card">
        <h2>Create New Tournament</h2>
        <form onSubmit={handleSubmit} className="form-group">
          <input
            type="text"
            value={tournamentName}
            onChange={(e) => setTournamentName(e.target.value)}
            placeholder="Enter Tournament Name"
          />
          {/* The button is now disabled when the input is empty */}
          <button type="submit" disabled={isInputEmpty}>
            Create
          </button>
        </form>
      </div>

      {tournaments.length > 0 && (
        <div className="card">
          <h2>Existing Tournaments</h2>
          <ul className="tournament-list">
            {tournaments.map(t => (
              <li key={t.id} onClick={() => setSelectedTournament(t)}>
                {t.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default HomePage;