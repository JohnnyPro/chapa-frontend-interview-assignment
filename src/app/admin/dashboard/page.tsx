"use client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  async function logout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
  return (
    <>
      <h1> Admin Dashboard </h1>
      <button onClick={logout}>Logout</button>
    </>
  );
}
