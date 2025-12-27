"use client";
import Header from "@/components/landing/Header";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const user = {
    type: "patient",
  };
  const router = useRouter();

  useEffect(() => {
    if (user.type === "doctor") {
      router.push("/doctor/dashboard");
    }
  }, []);

  if (user.type == "doctor") {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header showDashboardNav={false} />
      <main className="pt-16"></main>
    </div>
  );
}
