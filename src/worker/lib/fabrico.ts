import { createClient } from "@fabrico/sdk";

export const getFabrico = (env: Env) => createClient({
  publishableKey: env.FABRICO_PUBLISHABLE_KEY,
  apiKey: env.FABRICO_API_KEY,
});
