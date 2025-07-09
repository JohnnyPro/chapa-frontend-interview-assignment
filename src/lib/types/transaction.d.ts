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