import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, setStoredToken, getStoredToken } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [influencerProfile, setInfluencerProfile] = useState(null);
  const [token, setToken] = useState(getStoredToken());
  const [isLoading, setIsLoading] = useState(true);

  // Check persistent session on mount
  useEffect(() => {
    async function initSession() {
      const stored = getStoredToken();
      if (stored) {
        try {
          const res = await authApi.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            setInfluencerProfile(res.influencerProfile || null);
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    }
    initSession();
  }, []);

  async function login(email, password) {
    const res = await authApi.login({ email, password });
    if (res.success && res.token) {
      setStoredToken(res.token);
      setToken(res.token);
      setUser(res.user);
      setInfluencerProfile(res.influencerProfile || null);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  }

  async function register(payload) {
    const res = await authApi.register(payload);
    if (res.success && res.token) {
      setStoredToken(res.token);
      setToken(res.token);
      setUser(res.user);
      setInfluencerProfile(res.influencerProfile || null);
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  }

  function logout() {
    setStoredToken(null);
    setToken(null);
    setUser(null);
    setInfluencerProfile(null);
  }

  async function refreshUser() {
    try {
      const res = await authApi.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        setInfluencerProfile(res.influencerProfile || null);
      }
    } catch {
      // Ignore refresh error
    }
  }

  function updateInfluencerProfileState(profile) {
    setInfluencerProfile(profile);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        influencerProfile,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        updateInfluencerProfileState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
