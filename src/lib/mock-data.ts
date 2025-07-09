import { hashPassword } from "@/lib/auth/auth";
import { ROLES, UserRole } from "./constants";
export interface Transaction {
  id: string
  senderId: string
  senderName: string
  receiverId: string
  receiverName: string
  amount: number
  description: string
  date: string
  status: "completed" | "pending" | "failed"
}

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

export const mockUsers: MockUser[] = [
  {
    id: "1",
    name: "John User",
    password: await hashPassword("password"),
    email: "user@chapa.co",
    role: "user",
    isActive: true,
    walletBalance: 2500.0,
    totalPayments: 15000.0,
  },
  {
    id: "2",
    name: "Solomon Admin",
    password: await hashPassword("password"),
    email: "admin@chapa.co",
    role: "admin",
    isActive: true,
    walletBalance: 1500.0,
    totalPayments: 8500.0,
  },
  {
    id: "3",
    name: "Mike SuperAdmin",
    password: await hashPassword("password"),
    email: "super@chapa.co",
    role: ROLES.SUPERADMIN,
    isActive: true,
    walletBalance: 5000.0,
    totalPayments: 25000.0,
  }
]

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    senderId: "1",
    senderName: "John User",
    receiverId: "3",
    receiverName: "Mike SuperAdmin",
    amount: 250.0,
    description: "Transfer to Mike",
    date: "2024-01-14T15:45:00Z",
    status: "completed",
  },
  {
    id: "2",
    senderId: "2",
    senderName: "Solomon Admin",
    receiverId: "1",
    receiverName: "John User",
    amount: 750.0,
    description: "Refund processed",
    date: "2024-01-13T09:15:00Z",
    status: "pending",
  },
]

export const systemStats = {
  totalPayments: 50500.0,
  activeUsers: 156,
  totalTransactions: 1247,
  monthlyGrowth: 12.5,
}
