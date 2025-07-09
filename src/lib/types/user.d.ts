import { UserRole } from "../constants"

export interface MockUser {
  id: string
  name: string
  password: string
  email: string
  role: UserRole
  isActive: boolean
  walletBalance: number
  totalPayments: number
}