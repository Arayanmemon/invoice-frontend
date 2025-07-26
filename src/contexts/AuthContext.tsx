'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, api } from '@/services/api';
import { clearSessionData, validateSession } from '@/utils/sessionUtils';

export interface User {
  id: string;
  email: string;
  name: string;
  provider?: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  handleOAuthCallback: (accessToken: string, refreshToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  const clearApplicationData = () => {
    clearSessionData();
  };

  const clearUserBackendData = async () => {
    try {
      // Clear all contracts and invoices from backend to ensure fresh start
      console.log('Clearing user data from backend for fresh session...');
      
      // Call each endpoint separately to identify which one is failing
      try {
        console.log('Clearing contracts...');
        await api.contracts.clearAll();
        console.log('Contracts cleared successfully');
      } catch (contractError) {
        console.error('Error clearing contracts:', contractError);
      }
      
      try {
        console.log('Clearing invoices...');
        await api.invoices.clearAll();
        console.log('Invoices cleared successfully');
      } catch (invoiceError) {
        console.error('Error clearing invoices:', invoiceError);
      }
      
      console.log('Backend user data clearing completed');
    } catch (error) {
      console.error('Error clearing backend user data:', error);
      // Don't throw error here as login should still proceed
    }
  };

  const initializeAuth = async () => {
    try {
      // Validate session before attempting to get user data
      if (!validateSession()) {
        console.log('Session validation failed, clearing auth state');
        setIsLoading(false);
        return;
      }
      
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        // Verify token and get user info
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      // Token is invalid, clear it and application data
      console.log('Authentication initialization failed, clearing session');
      clearApplicationData();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      // Clear any existing application data before login
      clearApplicationData();
      
      const response = await authAPI.login(email, password);
      
      // Store tokens
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      // Don't clear backend data automatically - let user manage their data
      // await clearUserBackendData();
      
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      // Clear any existing application data before registration
      clearApplicationData();
      
      const response = await authAPI.register(email, name, password);
      
      // Store tokens
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      // Don't clear backend data automatically - let user manage their data
      // await clearUserBackendData();
      
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authAPI.logout();
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error('Logout error:', error);
    } finally {
      // Clear local state and application data
      clearApplicationData();
      setUser(null);
      setIsLoading(false);
      // Use window.location for navigation to avoid router issues
      window.location.href = '/';
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const refreshTokenValue = localStorage.getItem('refresh_token');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const response = await authAPI.refreshToken(refreshTokenValue);
      localStorage.setItem('access_token', response.access_token);
    } catch (error) {
      // Refresh failed, logout user
      await logout();
      throw error;
    }
  };

  const handleOAuthCallback = async (accessToken: string, refreshToken: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Clear any existing application data before OAuth login
      clearApplicationData();
      
      // Store tokens
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      
      // Get user info
      const userData = await authAPI.getCurrentUser();
      
      // Clear backend data for fresh session before setting user
      await clearUserBackendData();
      
      setUser(userData);
      
      // Don't redirect here - let the main page handle it based on authentication state
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshToken,
    handleOAuthCallback,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};