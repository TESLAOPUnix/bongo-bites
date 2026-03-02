import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'bongohridoy_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedAuth) {
      try {
        setUser(JSON.parse(savedAuth));
      } catch (e) {
        console.error('Failed to parse auth from localStorage');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (email && password.length >= 6) {
        const mockUser = {
          id: '1',
          name: email.split('@')[0],
          email,
        };
        setUser(mockUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (name && email && password.length >= 6) {
        const mockUser = {
          id: '1',
          name,
          email,
        };
        setUser(mockUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
        return { success: true };
      }
      return { success: false, error: 'Please fill all fields correctly' };
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
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
