import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import TournamentPage from './components/TournamentPage';
import VideoBackground from './components/VideoBackground';
import './App.css';
import { subscribeTournaments, saveTournament } from './firebase';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationProvider, { useNotification } from './components/NotificationProvider';
import { signInWithGoogle, signOut, onAuthChanged } from './firebase';

function App() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [user, setUser] = useState(null);
  const notif = null; // placeholder - used in Header via hook

  useEffect(() => {
    // realtime subscription to Firestore. If Firestore isn't configured,
    // subscribeTournaments returns a no-op unsubscribe.
    const unsub = subscribeTournaments((docs) => {
      setTournaments(docs);
      // If a selected tournament exists, try to update with fresh copy
      if (selectedTournament) {
        const fresh = docs.find((d) => String(d.id) === String(selectedTournament.id));
        if (fresh) setSelectedTournament(fresh);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onAuthChanged((u) => setUser(u));
    return () => unsub && unsub();
  }, []);

  const addTournament = async (name) => {
    const newTournament = {
      id: Date.now(),
      name,
      teams: [],
      pointSystem: [15, 12, 10, 8, 6, 4, 2, 1, 1, 1],
      matches: [],
    };
    // Optimistic update
    setTournaments((t) => [...t, newTournament]);
    setSelectedTournament(newTournament);
    // Persist to Firestore and return the promise so callers can await
    try {
      await saveTournament(newTournament);
    } catch (err) {
      console.warn('save tournament failed', err);
      throw err;
    }
  };

  const updateTournament = async (updatedTournament) => {
    setTournaments((prev) => prev.map((t) => (t.id === updatedTournament.id ? updatedTournament : t)));
    setSelectedTournament(updatedTournament);
    try {
      await saveTournament(updatedTournament);
    } catch (err) {
      console.warn('save tournament failed', err);
      throw err;
    }
  };

  const goHome = () => {
    setSelectedTournament(null);
  };

  const Header = () => {
    const { showToast, setLoading } = useNotification();
    const handleSignIn = async () => {
      try {
        setLoading(true);
        await signInWithGoogle();
        showToast('Signed in', 'success');
      } catch (err) {
        showToast('Sign-in failed', 'error');
      } finally {
        setLoading(false);
      }
    };
    const handleSignOut = async () => {
      try {
        setLoading(true);
        await signOut();
        showToast('Signed out', 'success');
      } catch (err) {
        showToast('Sign-out failed', 'error');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="app-header">
        <div className="left">
          <strong>BGMI Tournament Hub</strong>
        </div>
        <div className="right">
          {user ? (
            <>
              <span style={{ marginRight: 8 }}>{user.displayName || user.email}</span>
              <button onClick={handleSignOut}>Sign out</button>
            </>
          ) : (
            <button onClick={handleSignIn}>Sign in</button>
          )}
        </div>
      </div>
    );
  };

  const videoSrc = selectedTournament
    ? '/assets/Video_Gun_and_Ice_Glow.mp4'
    : '/assets/Animated_Video_Request_and_Rambling.mp4';

  return (
    <NotificationProvider>
      <div className="App">
        <VideoBackground videoSrc={videoSrc} />
        <Header />
        <div className="global-warning">
          Data is not saved online. Closing the tab will erase everything unless you configure Firebase (see .env.example).
        </div>
        <div className="content-overlay">
          {selectedTournament ? (
            <TournamentPage
              tournament={selectedTournament}
              updateTournament={updateTournament}
              goHome={goHome}
            />
          ) : (
            // Use a small animation for the list container
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <HomePage tournaments={tournaments} addTournament={addTournament} setSelectedTournament={setSelectedTournament} />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </NotificationProvider>
  );
}

export default App;