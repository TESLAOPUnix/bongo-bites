import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  verifyPasscode: (passcode: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_PASSCODE = 'bongo2024'; // Simple passcode - change this

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });

  const verifyPasscode = (passcode: string): boolean => {
    if (passcode === ADMIN_PASSCODE) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, verifyPasscode, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
