import { User, Team } from '@/types';
import { MOCK_TEAM_REP, MOCK_TEAMS } from '@/data/mockData';

// Auth Service — Replace with real HDC identity API in production.

export interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface RegisterInput {
  fullName: string;
  teamId: string;
  teamName: string;
  email: string;
  phone: string;
  password: string;
}

export async function login(teamId: string, _password: string): Promise<LoginResult> {
  // TODO: POST /api/auth/login { teamId, password }
  // Validate team against HDC team registry
  if (!teamId.trim()) {
    return { success: false, error: 'Team ID is required.' };
  }
  const team = MOCK_TEAMS.find((t) => t.id === teamId) ?? { ...MOCK_TEAM_REP.team!, id: teamId };
  return { success: true, user: { ...MOCK_TEAM_REP, team } };
}

export async function register(input: RegisterInput): Promise<LoginResult> {
  // TODO: POST /api/auth/register — validate teamId against HDC registry
  const newTeam: Team = {
    id: input.teamId,
    name: input.teamName,
    sport: 'multi-purpose',
    registeredDate: new Date().toISOString().split('T')[0],
    isActive: true,
    contactEmail: input.email,
    contactPhone: input.phone,
  };
  const user: User = {
    id: `user-${Date.now()}`,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    role: 'team_rep',
    team: newTeam,
  };
  return { success: true, user };
}

export async function validateTeamId(teamId: string): Promise<{ valid: boolean; team?: Team }> {
  // TODO: GET /api/teams/:id — check HDC registry
  const team = MOCK_TEAMS.find((t) => t.id === teamId);
  return team ? { valid: true, team } : { valid: false };
}

export async function logout(): Promise<void> {
  // TODO: POST /api/auth/logout (invalidate server-side session if applicable)
}
