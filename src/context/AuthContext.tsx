import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - in a real app, this would come from an API
const mockUser: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@triosart.com'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  const login = async (email: string, password: string) => {
    // This is a mock login - in a real app, this would make an API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          setAuthState({
            user: mockUser,
            isAuthenticated: true
          });
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    // This is a mock signup - in a real app, this would make an API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password) {
          setAuthState({
            user: { ...mockUser, name, email },
            isAuthenticated: true
          });
          resolve();
        } else {
          reject(new Error('Invalid information'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}