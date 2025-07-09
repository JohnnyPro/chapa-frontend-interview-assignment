export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  walletBalance: number;
  totalPayments: number;
}
