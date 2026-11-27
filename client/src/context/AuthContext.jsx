import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState([]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setSavedJobIds([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const refreshSavedJobs = useCallback(async (activeToken, activeRole) => {
    if (!activeToken || activeRole !== 'student') {
      setSavedJobIds([]);
      return;
    }
    try {
      const res = await api.get('/saved-jobs');
      if (res.data.success) {
        setSavedJobIds((res.data.savedJobs || []).map((job) => job._id));
      }
    } catch {
      // Non-blocking
    }
  }, []);

  // Fetch current user details on boot or token change
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            await refreshSavedJobs(token, res.data.user.role);
          }
        } catch (err) {
          console.error('Session validation error:', err.message);
          logout();
        }
      } else {
        setSavedJobIds([]);
      }
      setLoading(false);
    };

    fetchUser();

    const handleAutoLogout = () => {
      setUser(null);
      setToken(null);
      setSavedJobIds([]);
    };
    window.addEventListener('auth-logout', handleAutoLogout);
    return () => window.removeEventListener('auth-logout', handleAutoLogout);
  }, [token, logout, refreshSavedJobs]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      await refreshSavedJobs(res.data.token, res.data.user.role);
      return res.data;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      await refreshSavedJobs(res.data.token, res.data.user.role);
      return res.data;
    }
  };

  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      return res.data;
    }
  };

  const changePassword = async (payload) => {
    const res = await api.put('/auth/change-password', payload);
    return res.data;
  };

  const isJobSaved = useCallback(
    (jobId) => savedJobIds.includes(jobId),
    [savedJobIds]
  );

  const toggleSaveJob = useCallback(
    async (jobId) => {
      if (!token || user?.role !== 'student') {
        throw new Error('AUTH_REQUIRED');
      }
      const currentlySaved = savedJobIds.includes(jobId);
      if (currentlySaved) {
        await api.delete(`/saved-jobs/${jobId}`);
        setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
        return false;
      } else {
        await api.post(`/saved-jobs/${jobId}`);
        setSavedJobIds((prev) => [...new Set([...prev, jobId])]);
        return true;
      }
    },
    [token, user?.role, savedJobIds]
  );

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: !!token && !!user,
      isStudent: user?.role === 'student',
      isRecruiter: user?.role === 'recruiter',
      isAdmin: user?.role === 'admin',
      savedJobIds,
      isJobSaved,
      toggleSaveJob,
      refreshSavedJobs: () => refreshSavedJobs(token, user?.role),
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
