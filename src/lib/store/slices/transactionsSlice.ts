import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { Transaction } from "@/lib/types/transaction";
import { getProfile } from "./profileSlice";

interface TransactionsState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  isLoading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async () => {
    const response = await fetch(`/api/transactions`);
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to fetch transactions");
    }

    return data.transactions;
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (
    transactionData: {
      senderId: string;
      senderName: string;
      receiverId: string;
      receiverName: string;
      amount: number;
      description: string;
    },
    { dispatch }
  ) => {
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to create transaction");
    }

    dispatch(getProfile());
    return data.transaction;
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch transactions";
      })
      .addCase(createTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions.unshift(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create transaction";
      });
  },
});

export default transactionsSlice.reducer;
