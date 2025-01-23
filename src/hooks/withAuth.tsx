import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function withAuth(WrappedComponent) {
  return function ProtectedRoute(props) {
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

      if (parsedUserData && !parsedUserData.role) {
        router.push("/welcome");
      }
    }, []);

    const token =
      typeof window !== "undefined" && localStorage.getItem("userData");

    return token ? <WrappedComponent {...props} /> : null;
  };
}
