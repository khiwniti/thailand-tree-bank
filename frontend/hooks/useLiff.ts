import { useState, useEffect } from 'react';
import liff from '@line/liff';

interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

interface UseLiffReturn {
  isLoggedIn: boolean;
  profile: LiffProfile | null;
  error: Error | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

/**
 * Custom hook for LINE LIFF integration
 * Handles LIFF initialization, authentication, and user profile
 */
export const useLiff = (): UseLiffReturn => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initLiff = async () => {
      try {
        const liffId = import.meta.env.VITE_LIFF_ID;

        if (!liffId) {
          throw new Error('LIFF ID not found. Please set VITE_LIFF_ID in .env.local');
        }

        console.log('Initializing LIFF with ID:', liffId);
        await liff.init({ liffId });

        if (liff.isLoggedIn()) {
          console.log('User is already logged in');
          setIsLoggedIn(true);
          const profileData = await liff.getProfile();
          console.log('Profile loaded:', profileData);
          setProfile(profileData);
        } else {
          console.log('User is not logged in');
        }

        setIsLoading(false);
      } catch (err) {
        console.error('LIFF initialization failed', err);
        setError(err as Error);
        setIsLoading(false);
      }
    };

    initLiff();
  }, []);

  const login = () => {
    liff.login();
  };

  const logout = () => {
    liff.logout();
    setIsLoggedIn(false);
    setProfile(null);
  };

  return { isLoggedIn, profile, error, isLoading, login, logout };
};
