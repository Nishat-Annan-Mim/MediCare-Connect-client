"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export function useRequireAuth(allowedRoles = null) {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isLoggedIn) {
      router.replace("/login?redirect=/dashboard");
      return;
    }

    if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
      router.replace("/dashboard");
    }
  }, [isLoading, isLoggedIn, user?.role, allowedRoles, router]);

  return { user, isLoggedIn, isLoading };
}
