"use client";
import { useEffect, useRef } from "react";
import { userAuthStore } from "@/store/authStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const token = userAuthStore((state) => state.token);
  const user = userAuthStore((state) => state.user); // user pan lavo
  const fetchProfile = userAuthStore((state) => state.fetchProfile);
  const hasHydrated = userAuthStore((state) => state.hasHydrated);

  // Ref no upyog kari ne track karo ke fetch thayu che ke nahi
  const hasFetched = useRef(false);

  useEffect(() => {
    // Jo token hoy, Hydration thai gayu hoy, ANE user na hoy (to j fetch karo)
    if (hasHydrated && token && !user && !hasFetched.current) {
      fetchProfile().finally(() => {
        hasFetched.current = true;
      });
    }
  }, [hasHydrated, token, user, fetchProfile]);

  if (!hasHydrated) return null;

  return <>{children}</>;
}
