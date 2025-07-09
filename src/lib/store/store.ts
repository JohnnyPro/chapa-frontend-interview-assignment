import { configureStore } from "@reduxjs/toolkit"
import usersSlice from "./slices/usersSlice"
import transactionsSlice from "./slices/transactionsSlice"
import profileSlice from "./slices/profileSlice"

export const store = configureStore({
  reducer: {
    profile: profileSlice,
    users: usersSlice,
    transactions: transactionsSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
