import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const RouterContext = createContext(null);

function getInitialPath() {
  if (typeof window === 'undefined') return '/dashboard';
  if (window.location.hash && window.location.hash.startsWith('#/')) {
    return window.location.hash.slice(1);
  }
  const path = window.location.pathname;
  if (!path || path === '/') return '/dashboard';
  return path;
}

export function RouterProvider({ children }) {
  const [currentPath, setCurrentPath] = useState(getInitialPath);
  const { isAuthenticated } = useAuth();

  const isAuthRoute = currentPath === '/login' || currentPath === '/signup';
  const effectivePath = !isAuthenticated && !isAuthRoute ? '/login' : isAuthenticated && isAuthRoute ? '/dashboard' : currentPath;

  const navigate = useCallback((toPath) => {
    let normalized = toPath;
    if (!normalized.startsWith('/')) normalized = `/${normalized}`;

    window.history.pushState({}, '', normalized);
    setCurrentPath(normalized);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Sync URL in history when effectivePath changes due to auth state
  useEffect(() => {
    if (effectivePath !== window.location.pathname) {
      window.history.replaceState({}, '', effectivePath);
    }
  }, [effectivePath]);

  // Listen to browser Back and Forward navigation
  useEffect(() => {
    function handlePopState() {
      setCurrentPath(getInitialPath());
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const value = {
    currentPath: effectivePath,
    navigate,
  };

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}
