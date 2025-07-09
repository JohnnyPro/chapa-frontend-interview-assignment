import { MockUser } from "@/lib/types/user";
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface UsersState {
  users: MockUser[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  isLoading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch("/api/users");
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Failed to fetch users");
  }
  console.log(data.users);
  return data.users;
});

export const toggleUserStatus = createAsyncThunk(
  "users/toggleUserStatus",
  async (userId: string) => {
    const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
      method: "PATCH",
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to toggle user status");
    }

    return data.user;
  }
);

export const updateUserBalance = createAsyncThunk(
  "users/updateUserBalance",
  async ({ userId, newBalance }: { userId: string; newBalance: number }) => {
    const response = await fetch(`/api/admin/users/${userId}/balance`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newBalance }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to update balance");
    }

    return data.user;
  }
);

export const addUser = createAsyncThunk(
  "users/addUser",
  async (userData: { name: string; email: string; password: string; role: string }) => {
    const response = await fetch("/api/superadmin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to add admin");
    }

    return data.user;
  }
);

export const removeUser = createAsyncThunk(
  "users/removeUser",
  async (userId: string) => {
    const response = await fetch(`/api/superadmin/users/${userId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to remove admin");
    }

    return userId;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateUserPayments: (
      state,
      action: PayloadAction<{ userId: string; amount: number }>
    ) => {
      const user = state.users.find((u) => u.id === action.payload.userId);
      if (user) {
        user.totalPayments += action.payload.amount;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const userIndex = state.users.findIndex(
          (u) => u.id === action.payload.id
        );
        if (userIndex !== -1) {
          state.users[userIndex] = action.payload;
        }
      })
      .addCase(updateUserBalance.fulfilled, (state, action) => {
        const userIndex = state.users.findIndex(
          (u) => u.id === action.payload.id
        );
        if (userIndex !== -1) {
          state.users[userIndex] = action.payload;
        }
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

export const { updateUserPayments } = usersSlice.actions;
export default usersSlice.reducer;
