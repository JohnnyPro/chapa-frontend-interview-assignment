import { UserRole } from '@/lib/constants';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface JWTPayload {
  sub: string;
  email: string;
  role: UserRole;
  exp: number;
  iat: number;
}