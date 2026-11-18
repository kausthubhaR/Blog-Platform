import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          setUser(res.data.data || res.data.user || res.data);
          setIsAuthenticated(true);
          setToken(storedToken);
        } catch {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials);
    const { token: newToken, user: userData, data } = res.data;
    const resolvedToken = newToken || res.data.token;
    const resolvedUser = userData || data?.user || data;
    localStorage.setItem('token', resolvedToken);
    setToken(resolvedToken);
    setUser(resolvedUser);
    setIsAuthenticated(true);
    return res;
  }, []);

  const register = useCallback(async (data) => {
    const res = await authService.register(data);
    const { token: newToken, user: userData, data: resData } = res.data;
    const resolvedToken = newToken || res.data.token;
    const resolvedUser = userData || resData?.user || resData;
    localStorage.setItem('token', resolvedToken);
    setToken(resolvedToken);
    setUser(resolvedUser);
    setIsAuthenticated(true);
    return res;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateUser = useCallback((data) => {
    setUser((prev) => ({ ...prev, ...data }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;

