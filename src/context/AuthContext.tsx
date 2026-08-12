import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { getCurrentUser, saveCurrentUser, clearSession } from '../services/storage';
import { MOCK_CITIZEN_USER, MOCK_ADMIN_USER } from '../data/mockUsers';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCitizen: boolean;
  loginAsCitizen: () => void;
  loginAsAdmin: () => void;
  loginCustom: (user: User) => void;
  logout: () => void;
  switchRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());

  useEffect(() => {
    saveCurrentUser(user);
  }, [user]);

  const loginAsCitizen = () => {
    setUser(MOCK_CITIZEN_USER);
  };

  const loginAsAdmin = () => {
    setUser(MOCK_ADMIN_USER);
  };

  const loginCustom = (newUser: User) => {
    setUser(newUser);
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const switchRole = () => {
    if (user?.role === 'admin') {
      setUser(MOCK_CITIZEN_USER);
    } else {
      setUser(MOCK_ADMIN_USER);
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
