"use client";

import { useState } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, HandCoins, User, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { getProfile } from "@/lib/store/slices/profileSlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        const role = data.user.role;
        dispatch(getProfile());
        if (role === "superadmin") {
          router.push("/superadmin/dashboard");
        } else if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/user/dashboard");
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    }
  };
  const quickLogin = (email: string) => {
    setEmail(email)
    setPassword("password")
  }
  return (
    <div className="flex h-screen w-full">
      <div className="hidden w-1/2 flex-col justify-between bg-primary p-12 md:flex">
        <div className="flex items-center gap-2 text-primary-foreground">
          <HandCoins className="h-8 w-8" />
          <span className="text-2xl font-bold">
            Fictional Payment Service Provider
          </span>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative h-[400px] w-[400px]">
            <Image
              src="/login_asset.png"
              alt="Financial illustration"
              sizes="(max-width: 768px) 50vw, 25vw"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="text-primary-foreground w-10/12 mx-auto">
          <h2 className="text-xl font-bold text-center">
            Welcome to Fictional Payment Service – the modern payment platform
            built for Africa. Empower your business with seamless, secure, and
            developer-friendly payment solutions made for the local market.
          </h2>
        </div>

        <div />
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-background p-8 md:w-1/2">
        <div className="mt-15"></div>
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Welcome Back!</h1>
            <p className="mt-2 text-muted-foreground">
              Enter your credentials to access your dashboard.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                placeholder="admin@email.com"
                className="pl-10"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                className="pl-10 pr-10"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-3">
              Demo Accounts (Password is password):
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-left bg-transparent"
                onClick={() => quickLogin("user@chapa.co")}
              >
                <div>
                  <p className="font-medium">John User</p>
                  <p className="text-xs text-gray-500">
                    user@chapa.co - Regular User
                  </p>
                </div>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-left bg-transparent"
                onClick={() => quickLogin("admin@chapa.co")}
              >
                <div>
                  <p className="font-medium">Solomon Admin</p>
                  <p className="text-xs text-gray-500">
                    admin@chapa.co - Admin
                  </p>
                </div>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-left bg-transparent"
                onClick={() => quickLogin("super@chapa.co")}
              >
                <div>
                  <p className="font-medium">Mickey SuperAdmin</p>
                  <p className="text-xs text-gray-500">
                    super@chapa.co - Super Admin
                  </p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
