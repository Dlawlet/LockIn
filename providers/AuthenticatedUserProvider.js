
import { auth } from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';


// Type for context
/**
 * @typedef {Object} AuthContextType
 * @property {any} user
 * @property {(user: any) => void} setUser
 * @property {boolean} isLoading
 * @property {string | null} error
 * @property {string | null} seenWalkthrough
 * @property {(val: string | null) => void} setSeenWalkthrough
 */

/** @type {React.Context<AuthContextType>} */
export const AuthenticatedUserContext = createContext({
  user: null,
  setUser: () => {},
  isLoading: true,
  error: null,
  seenWalkthrough: null,
  setSeenWalkthrough: () => {},
});

export const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seenWalkthrough, setSeenWalkthrough] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!isMounted) return;
        setUser(firebaseUser);
        const walkthrough = await AsyncStorage.getItem('hasSeenWalkthrough');
        setSeenWalkthrough(walkthrough);
      } catch (e) {
        if (isMounted) setError(e.message || 'Initialization error');
      } finally {
        if (isMounted) setIsLoading(false);
        console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');
      }
    });
    return () => { isMounted = false; unsubscribe(); };
  }, []);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser, isLoading, error, seenWalkthrough, setSeenWalkthrough }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
