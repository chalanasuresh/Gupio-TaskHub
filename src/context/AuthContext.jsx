import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  getCurrentUserFromStorage,
  saveCurrentUserToStorage,
  registerUser,
  authenticateUser,
  loadUsersFromStorage,
  saveUsersToStorage,
  getInitials,
} from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUserFromStorage());
  const [authLoading, setAuthLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setAuthLoading(true);
    // Brief artificial delay for realistic SaaS loading feel
    await new Promise((res) => setTimeout(res, 250));
    const result = authenticateUser(email, password);
    setAuthLoading(false);
    if (result.success) {
      setCurrentUser(result.user);
    }
    return result;
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    setAuthLoading(true);
    await new Promise((res) => setTimeout(res, 300));
    const result = registerUser({ name, email, password });
    setAuthLoading(false);
    if (result.success) {
      setCurrentUser(result.user);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    saveCurrentUserToStorage(null);
    setCurrentUser(null);
  }, []);

  const updateProfile = useCallback(({ name, avatarColor }) => {
    if (!currentUser) return false;

    const updatedUser = {
      ...currentUser,
      name: name.trim(),
      avatarInitials: getInitials(name),
      avatarColor: avatarColor || currentUser.avatarColor,
    };

    // Update in users array
    const users = loadUsersFromStorage();
    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
    saveUsersToStorage(updatedUsers);

    // Update current user
    saveCurrentUserToStorage(updatedUser);
    setCurrentUser(updatedUser);
    return true;
  }, [currentUser]);

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    authLoading,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
