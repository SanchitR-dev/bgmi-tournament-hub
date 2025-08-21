// Simple Firebase + Firestore helper for the app.
// Put your Firebase config into a .env file (see .env.example).
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  setDoc,
  query,
  orderBy,
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
export function initFirebase() {
  if (db) return db;
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    return db;
  } catch (err) {
    console.warn('Firebase init failed (check .env):', err.message || err);
    return null;
  }
}

      auth = getAuth(app);
// Subscribe to tournaments collection in realtime
export function subscribeTournaments(onUpdate) {
  const database = initFirebase();
  if (!database) return () => {};
  const col = collection(database, 'tournaments');
  const q = query(col, orderBy('createdAt'));
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      onUpdate(docs);
    },
    (err) => {
      console.error('tournaments snapshot error', err);
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
