// lib/env.ts

interface Env {
  NEXT_PUBLIC_API_KEY: string | undefined;
  NEXT_PUBLIC_API_BASE_URL: string | undefined;
}

// Define the environment variables individually
export const apiKey: Env["NEXT_PUBLIC_API_KEY"] =
  process.env.NEXT_PUBLIC_API_KEY;
export const apiUrl: Env["NEXT_PUBLIC_API_BASE_URL"] =
  process.env.NEXT_PUBLIC_API_BASE_URL;
