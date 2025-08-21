// Simple Firebase + Firestore helper for the app.
// Put your Firebase config into a .env file (see .env.example).
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  getDocs,
  doc,
  setDoc,
  query,
  orderBy,
  setLogLevel,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

let db;
let auth;
let firebaseApp;
export function initFirebase() {
  if (db && firebaseApp) return db;
  try {
    firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp);
    // Make Firestore emit more detailed logs to the console during development.
    // This helps reveal server responses (400/401/403) coming from the WebChannel
    // transport so we can see the underlying error message when Listen fails.
    try {
      setLogLevel && setLogLevel('debug');
    } catch (e) {
      // non-fatal if the function isn't available in some SDK builds
      console.debug('Could not enable Firestore debug logs', e?.message || e);
    }
    auth = getAuth(firebaseApp);
    return db;
  } catch (err) {
    console.warn('Firebase init failed (check .env):', err.message || err);
    return null;
  }
}
// Subscribe to tournaments collection in realtime
export function subscribeTournaments(onUpdate) {
  const database = initFirebase();
  if (!database) return () => {};
  const col = collection(database, 'tournaments');
  const q = query(col, orderBy('createdAt'));
  // Try a realtime listener first. If the WebChannel transport fails with a
  // 400 (Bad Request) we log detailed information and fall back to a one-time
  // getDocs so the UI still gets data.
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      onUpdate(docs);
    },
    async (err) => {
      // Firestore SDK sometimes hides the server body; print known properties
      // and attempt a one-time fetch to capture any server error response.
      console.error('tournaments snapshot error (onSnapshot):', {
        message: err?.message,
        code: err?.code,
        name: err?.name,
        stack: err?.stack,
        toString: err?.toString && err.toString(),
      });

      try {
        // Try a one-time fetch to surface server response (getDocs will fail
        // with the underlying HTTP error which should be visible in the
        // browser network tab or as an exception here).
        const fallback = await getDocs(q);
        const docs = fallback.docs.map((d) => ({ id: d.id, ...d.data() }));
        onUpdate(docs);
      } catch (getErr) {
        console.error('tournaments fallback getDocs error:', getErr);
      }
    }
  );
  return unsubscribe;
}

// Save or update a tournament (uses tournament.id as document id).
export async function saveTournament(tournament) {
  const database = initFirebase();
  if (!database) throw new Error('Firestore not initialized');
  const id = tournament.id ? String(tournament.id) : String(Date.now());
  const ref = doc(database, 'tournaments', id);
  await setDoc(ref, { ...tournament, id, createdAt: tournament.createdAt || Date.now() });
}

// Optional Auth helpers
export function signInWithGoogle() {
  initFirebase();
  if (!auth) throw new Error('Firebase Auth not initialized');
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export function signUpWithEmail(email, password) {
  initFirebase();
  if (!auth) throw new Error('Firebase Auth not initialized');
  return createUserWithEmailAndPassword(auth, email, password);
}

export function signInWithEmail(email, password) {
  initFirebase();
  if (!auth) throw new Error('Firebase Auth not initialized');
  return signInWithEmailAndPassword(auth, email, password);
}

export function signOut() {
  if (!auth) return Promise.resolve();
  return fbSignOut(auth);
}

export function onAuthChanged(cb) {
  initFirebase();
  if (!auth) return () => {};
  return onAuthStateChanged(auth, cb);
}
