import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Admin } from '../types/api';
import { tokenService } from '../services/api';

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  setAdmin: (admin: Admin | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdminState] = useState<Admin | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Decode JWT token to extract admin info
  const decodeToken = (token: string): Admin | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      
      // Extract admin info from token (adjust based on your JWT structure)
      return {
        id: decoded.id || decoded.sub || decoded.userId || '',
        name: decoded.name || decoded.username || 'Admin',
        email: decoded.email || '',
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Load admin from token on mount
  useEffect(() => {
    const token = tokenService.getToken();
    if (token) {
      const adminData = decodeToken(token);
      if (adminData) {
        setAdminState(adminData);
        setIsAuthenticated(true);
      } else {
        // If token is invalid, remove it
        tokenService.removeToken();
      }
    }
  }, []);

  const setAdmin = (adminData: Admin | null) => {
    setAdminState(adminData);
    setIsAuthenticated(!!adminData);
  };

  const logout = () => {
    tokenService.removeToken();
    setAdminState(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated, setAdmin, logout }}>
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

