"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-toastify"
import { Loader2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { fetchUsers, updateUserBalance, updateUserPayments } from "@/lib/store/slices/usersSlice"
import { createTransaction } from "@/lib/store/slices/transactionsSlice"

export function TransactionForm() {
  const dispatch = useAppDispatch()
  const { profile } = useAppSelector((state) => state.profile)
  const { users, isLoading: usersLoading } = useAppSelector((state) => state.users)
  const { isLoading: transactionLoading } = useAppSelector((state) => state.transactions)

  const [formData, setFormData] = useState({
    amount: "",
    receiverId: "",
    description: "",
  })

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const availableRecipients = users.filter((user) => user.id !== profile?.id && user.isActive)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || !formData.receiverId || !formData.description) {
      toast.error("Please fill in all fields")
      return
    }

    const amount = Number.parseFloat(formData.amount)

    if (amount <= 0) {
      toast.error("Amount must be greater than 0")
      return
    }

    if (!profile || profile.walletBalance < amount) {
      toast.error("Insufficient balance")
      return
    }

    const receiver = users.find((u) => u.id === formData.receiverId)
    if (!receiver) {
      toast.error("Invalid recipient")
      return
    }

    try {
      await dispatch(
        createTransaction({
          senderId: profile.id,
          senderName: profile.name,
          receiverId: receiver.id,
          receiverName: receiver.name,
          amount,
          description: formData.description,
        }),
      ).unwrap()

      const newSenderBalance = profile.walletBalance - amount
      const newReceiverBalance = receiver.walletBalance + amount

      dispatch(
        updateUserBalance({
          userId: profile.id,
          newBalance: newSenderBalance,
        }),
      )

      await dispatch(
        updateUserBalance({
          userId: profile.id,
          newBalance: newSenderBalance,
        }),
      )

      await dispatch(
        updateUserBalance({
          userId: receiver.id,
          newBalance: newReceiverBalance,
        }),
      )

      dispatch(
        updateUserPayments({
          userId: profile.id,
          amount,
        }),
      )

      toast.success(`Successfully sent $${amount.toFixed(2)} to ${receiver.name}`)

      setFormData({ amount: "", receiverId: "", description: "" })
    } catch (error) {
      toast.error("Failed to process transaction")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Money</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="recipient">Recipient</Label>
            <Select
              value={formData.receiverId}
              onValueChange={(value) => setFormData({ ...formData, receiverId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
                {availableRecipients.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{user.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({user.email})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
            {profile && (
              <p className="text-sm text-gray-500 mt-1">Available balance: ${profile.walletBalance.toFixed(2)}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter transaction description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <Button type="submit" disabled={transactionLoading || usersLoading} className="w-full">
            {transactionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Money
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
