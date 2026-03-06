// Central configuration validator. This module throws an error at startup if
// required environment variables are missing, preventing the app from running
// with an invalid configuration.

function getEnvVar(name: string, required = true): string {
  const val = import.meta.env[name] as string | undefined;
  if (!val || val === "") {
    if (required && !import.meta.env.DEV) {
      // in production builds we crash hard; in dev we just warn so the
      // developer can continue working without setting every variable.
      throw new Error(`Missing required environment variable: ${name}`);
    }
    console.warn(`Environment variable ${name} is not set${import.meta.env.DEV ? ' (development)' : ''}.`);
    return "";
  }
  return val;
}

// --- exported values -------------------------------------------------------
export const FORM_WORKER_URL = getEnvVar("VITE_FORM_WORKER_URL");


// you can add more exports here (e.g. APPWRITE_PROJECT_ID) and validate them
// with getEnvVar. keeping all validation in one place makes it easy to write
// tests against the config later.
