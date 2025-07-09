"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchTransactions } from "@/lib/store/slices/transactionsSlice";

export function TransactionList() {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.profile);
  const { transactions, isLoading } = useAppSelector(
    (state) => state.transactions
  );

  useEffect(() => {
    if (profile) {
      dispatch(fetchTransactions());
    }
  }, [dispatch, profile]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[50vh] px-4 overflow-y-auto">
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No transactions found
            </p>
          ) : (
            transactions.map((transaction) => {
              const isReceived = transaction.receiverId === profile?.id;
              const otherParty = isReceived
                ? transaction.senderName
                : transaction.receiverName;

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        isReceived ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {isReceived ? (
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {isReceived
                          ? `Received from ${otherParty}`
                          : `Sent to ${otherParty}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        isReceived ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isReceived ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </p>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
