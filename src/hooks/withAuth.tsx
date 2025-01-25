"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { ComponentType } from "react";

export function withAuth(WrappedComponent: ComponentType) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("userData");
      if (!token) {
        router.push("/login");
      }
    }, []);

    useEffect(() => {
      const storedUserData = localStorage.getItem("userData");
      const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;

      if (parsedUserData && parsedUserData.roles.length < 0) {
        router.push("/welcome");
      }
    }, []);

    const token =
      typeof window !== "undefined" && localStorage.getItem("userData");

    return token ? <WrappedComponent {...props} /> : null;
  };
}
