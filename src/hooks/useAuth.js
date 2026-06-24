"use client";

import { useSession } from "@/lib/auth-client";

/**
 * Convenience hook for accessing the current session anywhere in the app.
 * Returns: { user, isLoading, isLoggedIn }
 */
export function useAuth() {
  const { data, isPending } = useSession();

  return {
    user: data?.user || null,
    session: data?.session || null,
    isLoading: isPending,
    isLoggedIn: !!data?.user,
  };
}
