import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  selectedRole: UserRole | null;
  login: (user: User, role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users - in a real app, this would come from an API
const MOCK_USERS: Record<UserRole, User> = {
  [UserRole.CANDIDATE]: { id: 'cand1', name: 'Alex Candidate', email: 'alex@example.com', role: UserRole.CANDIDATE },
  [UserRole.RECRUITER]: { id: 'rec1', name: 'Riley Recruiter', email: 'riley@example.com', role: UserRole.RECRUITER },
  [UserRole.HIRING_MANAGER]: { id: 'hm1', name: 'Casey Manager', email: 'casey@example.com', role: UserRole.HIRING_MANAGER },
};


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate checking for an existing session
    const storedUser = localStorage.getItem('currentUser');
    const storedRole = localStorage.getItem('selectedRole') as UserRole | null;
    if (storedUser && storedRole) {
      setCurrentUser(JSON.parse(storedUser));
      setSelectedRole(storedRole);
    }
    setIsLoading(false);
  }, []);

  const login = (user: User, role: UserRole) => {
    const userToLogin = MOCK_USERS[role] || user; // Use mock user for selected role
    setCurrentUser(userToLogin);
    setSelectedRole(role);
    localStorage.setItem('currentUser', JSON.stringify(userToLogin));
    localStorage.setItem('selectedRole', role);
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedRole(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('selectedRole');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-secondary text-primary">Loading application...</div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, selectedRole, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};