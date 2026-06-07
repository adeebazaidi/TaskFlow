import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { setAuthToken } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('taskflow_token');
      const savedUser = localStorage.getItem('taskflow_user');

      if (token && savedUser) {
        setAuthToken(token);
        try {
          // Verify token is still valid
          const res = await authService.getMe();
          setUser(res.data.user);
        } catch {
          localStorage.removeItem('taskflow_token');
          localStorage.removeItem('taskflow_user');
          setAuthToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials);
    const { token, user } = res.data;

    localStorage.setItem('taskflow_token', token);
    localStorage.setItem('taskflow_user', JSON.stringify(user));
    setAuthToken(token);
    setUser(user);

    toast.success(`Welcome back, ${user.name}! 👋`);
    return res.data;
  }, []);

  const register = useCallback(async (userData) => {
    const res = await authService.register(userData);
    const { token, user } = res.data;

    localStorage.setItem('taskflow_token', token);
    localStorage.setItem('taskflow_user', JSON.stringify(user));
    setAuthToken(token);
    setUser(user);

    toast.success(`Account created! Welcome, ${user.name}! 🎉`);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setAuthToken(null);
    setUser(null);
    toast.success('Logged out successfully.');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
