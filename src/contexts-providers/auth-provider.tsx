
import { useState, useEffect } from 'react';
import api from '../lib/api';
import { AuthContext } from './auth-context';


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get('/sessions');
        if (data.success) setUser(data.sessions.length > 0 ? data.sessions[0].user : null);
      } catch (err) {
        setUser(null)
        console.error('Auth check failed:', err);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);



  const signup = async (displayName, email, password, photoURL) => {
    const { data } = await api.post('/signup', { displayName, email, password, photoURL });
    if (data.success) setUser(data.user);
    return data;
  };

  const login = async (email, password) => {
    const { data } = await api.post('/login', { email, password });
    if (data.success) setUser(data.user);
    return data;
  };

  const logout = async () => {
    const { data } = await api.post('/logout');
    if (data.success) setUser(null);
    return data;
  };

  const logoutAll = async () => {
    const { data } = await api.post('/logout-all');
    if (data.success) setUser(null);
    return data;
  };

  const getSessions = async () => {
    const { data } = await api.get('/sessions');
    return data;
  };

  const revokeSession = async (sessionId) => {
    const { data } = await api.post('/revoke-session', { sessionId });
    return data;
  };


  return (
    <AuthContext value={{ user, loading, signup, login, logout, logoutAll, getSessions, revokeSession }}>
      {children}
    </AuthContext>
  );
};