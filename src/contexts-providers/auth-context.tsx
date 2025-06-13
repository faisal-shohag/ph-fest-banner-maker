import { createContext } from 'react';

 export interface AuthContextType {
  user: string | null;
  loading: boolean;
  signup: (displayName: string, email: string, password: string, photoURL: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  logoutAll: () => Promise<any>;
  getSessions: () => Promise<any>;
  revokeSession: (sessionId: number) => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | null>(null);