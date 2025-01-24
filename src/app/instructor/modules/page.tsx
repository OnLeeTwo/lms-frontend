"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const BouncePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/modules/1"); // Replace "/target-page" with your desired destination
  }, [router]);

  return null; // Don't render anything
};

export default BouncePage;
