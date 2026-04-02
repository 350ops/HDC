import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types';
import { MOCK_TEAM_REP, MOCK_CSR_ADMIN } from '@/data/mockData';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTeamRep: boolean;
  login: (teamId: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsAdmin: () => void; // dev helper for testing admin flow
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isTeamRep: false,
  login: async () => ({ success: false }),
  loginAsAdmin: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Default to team rep for development — replace with null for production
  const [user, setUser] = useState<User | null>(MOCK_TEAM_REP);

  const login = useCallback(
    async (teamId: string, _password: string): Promise<{ success: boolean; error?: string }> => {
      // TODO: replace with real authService.login(teamId, password) API call
      if (!teamId.trim()) {
        return { success: false, error: 'Team ID is required.' };
      }
      // Mock: any non-empty teamId logs in as team rep
      const mockUser: User = { ...MOCK_TEAM_REP, team: { ...MOCK_TEAM_REP.team!, id: teamId } };
      setUser(mockUser);
      return { success: true };
    },
    []
  );

  const loginAsAdmin = useCallback(() => {
    setUser(MOCK_CSR_ADMIN);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const adminRoles: UserRole[] = ['csr_admin', 'finance', 'sys_admin'];
  const isAdmin = !!user && adminRoles.includes(user.role);
  const isTeamRep = user?.role === 'team_rep';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isTeamRep,
        login,
        loginAsAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
