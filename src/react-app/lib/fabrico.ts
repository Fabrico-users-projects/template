import { createClient } from "@fabrico/sdk";

export const fabrico = createClient({
  publishableKey: import.meta.env.VITE_FABRICO_PUBLISHABLE_KEY,
  authUrl: "/api/auth"
});