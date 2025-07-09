import { UserRole } from '@/lib/constants';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}