import React, { useState } from 'react';
import HomePage from './components/HomePage';
import TournamentPage from './components/TournamentPage';
import VideoBackground from './components/VideoBackground';
import './App.css';

function App() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);

  const addTournament = (name) => {
    const newTournament = {
      id: Date.now(),
      name,
      teams: [],
      pointSystem: [15, 12, 10, 8, 6, 4, 2, 1, 1, 1],
      matches: [],
    };
    setTournaments([...tournaments, newTournament]);
    setSelectedTournament(newTournament);
  };

  const updateTournament = (updatedTournament) => {
    setTournaments(tournaments.map(t => t.id === updatedTournament.id ? updatedTournament : t));
    setSelectedTournament(updatedTournament);
  };

  const goHome = () => {
    setSelectedTournament(null);
  };

  const videoSrc = selectedTournament
    ? '/assets/Video_Gun_and_Ice_Glow.mp4'
    : '/assets/Animated_Video_Request_and_Rambling.mp4';

  return (
    <div className="App">
      <VideoBackground videoSrc={videoSrc} />
      <div className="global-warning">
        Data is not saved online. Closing the tab will erase everything.
      </div>
      <div className="content-overlay">
        {selectedTournament ? (
          <TournamentPage
            tournament={selectedTournament}
            updateTournament={updateTournament}
            goHome={goHome}
          />
        ) : (
          <HomePage tournaments={tournaments} addTournament={addTournament} setSelectedTournament={setSelectedTournament} />
        )}
      </div>
    </div>
  );
}

export default App;