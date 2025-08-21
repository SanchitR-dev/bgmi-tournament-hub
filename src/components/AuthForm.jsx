import React, { useState } from 'react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../firebase';
import { useNotification } from './NotificationProvider';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { showToast, setLoading } = useNotification();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUpWithEmail(email, password);
      showToast('Account created', 'success');
    } catch (err) {
      console.error(err);
      showToast('Sign-up failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      showToast('Signed in', 'success');
    } catch (err) {
      console.error(err);
      showToast('Sign-in failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      showToast('Signed in with Google', 'success');
    } catch (err) {
      console.error(err);
      showToast('Google sign-in failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <form onSubmit={handleSignIn} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
        <button type="submit">Sign in</button>
        <button type="button" onClick={handleSignUp}>Sign up</button>
      </form>
      <button onClick={handleGoogle}>Sign in with Google</button>
    </div>
  );
}
