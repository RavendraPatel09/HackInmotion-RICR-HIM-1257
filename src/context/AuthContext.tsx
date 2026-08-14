import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { getCurrentUser, saveCurrentUser, clearSession } from '../services/storage';
import { authApi } from '../services/api';
import { showToast } from '../components/ui/Toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCitizen: boolean;
  loginAsCitizen: () => Promise<void>;
  loginAsAdmin: () => Promise<void>;
  loginCustom: (user: any) => Promise<void>;
  loginWithCredentials: (email: string, password: string) => Promise<any>;
  registerWithCredentials: (payload: any) => Promise<any>;
  logout: () => void;
  switchRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());

  useEffect(() => {
    saveCurrentUser(user);
  }, [user]);

  // Sync token expiration logout from API requests
  useEffect(() => {
    const handleLogoutEvent = () => {
      setUser(null);
      clearSession();
      showToast('Session expired. Please log in again.', 'warning');
    };
    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => window.removeEventListener('auth-logout', handleLogoutEvent);
  }, []);

  const loginAsCitizen = async () => {
    try {
      const data = await authApi.login('citizen@nagarsathi.demo', 'password123');
      setUser(data.user);
    } catch (err: any) {
      showToast(err.message || 'Demo login failed', 'error');
    }
  };

  const loginAsAdmin = async () => {
    try {
      const data = await authApi.login('admin@nagarsathi.demo', 'password123');
      setUser(data.user);
    } catch (err: any) {
      showToast(err.message || 'Demo login failed', 'error');
    }
  };

  const loginCustom = async (newUser: any) => {
    try {
      // Try logging in first
      const data = await authApi.login(newUser.email, 'password123');
      setUser(data.user);
    } catch {
      // If user doesn't exist in PostgreSQL, register them on the fly
      try {
        const regData = await authApi.register({
          name: newUser.name,
          email: newUser.email,
          password: 'password123',
          role: newUser.role,
          phone: newUser.phone || '',
          avatar: newUser.avatar || '',
          ward_id: newUser.wardId || 'bpl-ward-01',
        });
        setUser(regData.user);
      } catch (err: any) {
        showToast(err.message || 'Custom authentication failed', 'error');
      }
    }
  };

  const loginWithCredentials = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    setUser(data.user);
    return data;
  };

  const registerWithCredentials = async (payload: any) => {
    const data = await authApi.register(payload);
    return data;
  };

  const logout = () => {
    clearSession();
    localStorage.removeItem('cityfix_token');
    localStorage.removeItem('cityfix_refresh_token');
    setUser(null);
  };

  const switchRole = async () => {
    if (user?.role === 'admin') {
      await loginAsCitizen();
    } else {
      await loginAsAdmin();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isCitizen: user?.role === 'citizen',
        loginAsCitizen,
        loginAsAdmin,
        loginCustom,
        loginWithCredentials,
        registerWithCredentials,
        logout,
        switchRole,
      }}
    >
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
