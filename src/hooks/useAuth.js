"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import api from "@/lib/api";

/**
 * Better Auth's session gives identity (id, name, email, image) instantly.
 * Role/status are owned by the Express API's Users collection, so we fetch
 * that once per session and merge it in — keeping Express as the source
 * of truth for role-based access.
 */
export function useAuth() {
  const { data, isPending } = useSession();
  const [profile, setProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;

    if (!data?.user) {
      setProfile(null);
      setIsProfileLoading(false);
      return;
    }

    let isCurrent = true;
    setIsProfileLoading(true);

    api
      .get("/users/me")
      .then(({ data: res }) => {
        if (isCurrent) setProfile(res.data);
      })
      .catch(() => {
        if (isCurrent) setProfile(null);
      })
      .finally(() => {
        if (isCurrent) setIsProfileLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [isPending, data?.user?.email]);

  const sessionUser = data?.user || null;
  const mergedUser = sessionUser
    ? {
        ...sessionUser,
        role: profile?.role || sessionUser.role || "patient",
        status: profile?.status || "active",
        phone: profile?.phone || "",
        gender: profile?.gender || "",
      }
    : null;

  return {
    user: mergedUser,
    session: data?.session || null,
    isLoading: isPending || (!!sessionUser && isProfileLoading),
    isLoggedIn: !!sessionUser,
  };
}
