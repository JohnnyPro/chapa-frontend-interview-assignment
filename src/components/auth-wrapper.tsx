"use client";

import { useEffect, ReactNode } from "react";
import { getProfile } from "@/lib/store/slices/profileSlice";
import { RootState } from "@/lib/store/store";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import Loader from "./loader";
interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector(
    (state: RootState) => state.profile
  );

  useEffect(() => {
    if (!profile && !loading && !error) {
      dispatch(getProfile());
    }
    // eslint-disable-next-line
  }, []);

  if (loading && !profile) {
    return <Loader />;
  }

  return <>{children}</>;
}
