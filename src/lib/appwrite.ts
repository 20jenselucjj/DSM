import { Client, Account, ID } from "appwrite";

// Appwrite client configuration
// Uses env vars if available; otherwise falls back to provided defaults
const client = new Client();
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT ?? "https://sfo.cloud.appwrite.io/v1";
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID ?? "68efa91c002473ac048a";
client.setEndpoint(endpoint).setProject(projectId);

// Optional: bypass client-side rate limits during local development using a Dev Key
// Do NOT set VITE_APPWRITE_DEV_KEY in production builds.
const devKey = import.meta.env.VITE_APPWRITE_DEV_KEY as string | undefined;
if (devKey && import.meta.env.DEV) {
  try {
    // Available in recent Appwrite Web SDKs
    // https://appwrite.io/blog/post/improve-devex-dev-keys
    (client as any).setDevKey?.(devKey);
  } catch {}
}

export const account = new Account(client);
export { ID };

// Lightweight shared cache for current user to reduce duplicate account.get() calls
let cachedUser: any | null = null;
let lastUserFetch = 0;
let inFlightUser: Promise<any> | null = null;
const USER_COOLDOWN_MS = 30000; // 30s cooldown across app to avoid rate limits

export const getCurrentUserCached = async (force = false): Promise<any | null> => {
  if (!force && cachedUser && Date.now() - lastUserFetch < USER_COOLDOWN_MS) {
    return cachedUser;
  }
  if (inFlightUser) return inFlightUser;
  const p = (async () => {
    try {
      const u = await account.get();
      cachedUser = u;
      return u;
    } catch (e) {
      cachedUser = null;
      throw e;
    } finally {
      lastUserFetch = Date.now();
      inFlightUser = null;
    }
  })();
  inFlightUser = p;
  return p;
};

export const clearUserCache = () => {
  cachedUser = null;
  lastUserFetch = 0;
};