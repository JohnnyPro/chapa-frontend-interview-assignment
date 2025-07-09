"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { TransactionForm } from "@/components/dashboard/transaction-form"
import { TransactionList } from "@/components/dashboard/transaction-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from "lucide-react"
import { useAppSelector } from "@/lib/store/hooks"

export default function UserDashboard() {
  const { profile } = useAppSelector((state) => state.profile)

  return (
    <DashboardLayout title="User Dashboard">
      <div className="space-y-6">
        {/* Wallet Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${profile?.walletBalance?.toFixed(2) || "0.00"}</div>
            <p className="text-xs text-muted-foreground">Available balance</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransactionForm />

          <TransactionList />
        </div>
      </div>
    </DashboardLayout>
  )
}
