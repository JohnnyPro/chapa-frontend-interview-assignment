import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRole } from "../../constants";

import { Profile } from "@/lib/types/profile";

interface InitialState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: InitialState = {
  profile: null,
  loading: false,
  error: null,
};

export const getProfile = createAsyncThunk("profile/fetchProfile", async () => {
    
  const response = await fetch(`/api/profile`);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Failed to fetch profile");
  }

  return data.profile;
});


const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.profile = null;
      });
  },
});

export const { clearProfile } = profileSlice.actions;

export default profileSlice.reducer;
