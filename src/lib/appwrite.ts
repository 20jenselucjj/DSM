import { Client, Account, ID } from "appwrite";

// Appwrite client configuration
// Uses env vars if available; otherwise falls back to provided defaults
const client = new Client();
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT ?? "https://sfo.cloud.appwrite.io/v1";
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID ?? "68efa91c002473ac048a";
client.setEndpoint(endpoint).setProject(projectId);

export const account = new Account(client);
export { ID };