'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as api from './api';

interface User {
  username: string;
  role: 'admin' | 'guru' | 'siswa';
  related_id: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ nama: string; role: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { setLoading(false); return; }
      const userData = await api.getMe();
      setUser(userData as User);
    } catch {
      setUser(null);
      api.logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const login = async (username: string, password: string) => {
    const res = await api.login(username, password);
    setUser(res.user as User);
    return { nama: res.user.username, role: res.user.role };
  };

  const logout = () => { api.logout(); setUser(null); };
  const hasRole = (role: string) => user?.role === role;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
