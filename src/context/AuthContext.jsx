import { createContext, useContext, useEffect, useState } from 'react';
import { getUserProfile, onAuthChange, signOut } from '../lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuthChange = async (user) => {
      setUser(user);
      setIsLoading(false);

      if (user) {
        try {
          const userProfile = await getUserProfile(user.id);
          setProfile(userProfile);
        } catch (error) {
          console.error('Error fetching user profile: ', error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    };

    // Subscribe to auth state changes
    const { subscription } = onAuthChange(handleAuthChange);

    // Cleanup function
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const logout = async () => {
    try {
      await signOut();
      // Explicitly clear state
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error; // Re-throw to handle in UI if needed
    }
  };

  const value = {
    user,
    profile,
    isLoading,
    isLoggedIn: !!user,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
