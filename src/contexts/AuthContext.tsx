import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/expense';
import { 
  findUserByEmail, 
  createUser, 
  validatePassword, 
  getStoredAuth, 
  saveAuth, 
  clearAuth,
  generateToken,
  getUsers
} from '@/lib/storage';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, name: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const storedAuth = getStoredAuth();
    if (storedAuth) {
      const users = getUsers();
      const user = users.find(u => u.id === storedAuth.userId);
      if (user) {
        setAuthState({
          user,
          token: storedAuth.token,
          isAuthenticated: true,
        });
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const user = findUserByEmail(email);
    
    if (!user) {
      return { success: false, error: 'User not found. Please sign up first.' };
    }
    
    if (!validatePassword(user.id, password)) {
      return { success: false, error: 'Invalid password. Please try again.' };
    }
    
    const token = generateToken(user.id);
    saveAuth(user.id, token);
    
    setAuthState({
      user,
      token,
      isAuthenticated: true,
    });
    
    return { success: true };
  };

  const signup = async (email: string, name: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const existingUser = findUserByEmail(email);
    
    if (existingUser) {
      return { success: false, error: 'Email already registered. Please login instead.' };
    }
    
    const user = createUser(email, name, password);
    const token = generateToken(user.id);
    saveAuth(user.id, token);
    
    setAuthState({
      user,
      token,
      isAuthenticated: true,
    });
    
    return { success: true };
  };

  const logout = () => {
    clearAuth();
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
