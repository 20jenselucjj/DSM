import { useEffect, useRef } from "react";
import { account } from "@/lib/appwrite";
import { toast } from "sonner";

// Session timeout settings (in minutes)
const TIMEOUT_MINUTES = 30;
const WARNING_MINUTES = 25;

export const useSessionTimeout = () => {
  const lastActivityRef = useRef<number>(Date.now());
  const warnedRef = useRef<boolean>(false);

  useEffect(() => {
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ["mousemove", "keydown", "click", "touchstart"];
    events.forEach((e) => window.addEventListener(e, updateActivity));

    const interval = setInterval(async () => {
      const now = Date.now();
      const elapsedMinutes = (now - lastActivityRef.current) / (1000 * 60);
      if (!warnedRef.current && elapsedMinutes >= WARNING_MINUTES) {
        warnedRef.current = true;
        toast.message("Session will expire soon due to inactivity.");
      }
      if (elapsedMinutes >= TIMEOUT_MINUTES) {
        try {
          await account.deleteSession("current");
        } catch {}
        // Notify app to refresh auth state everywhere
        try {
          window.dispatchEvent(new Event("appwrite-session-changed"));
        } catch {}
        toast.error("You have been logged out due to inactivity.");
        warnedRef.current = false;
        lastActivityRef.current = Date.now();
      }
    }, 1000 * 30);

    return () => {
      clearInterval(interval);
      events.forEach((e) => window.removeEventListener(e, updateActivity));
    };
  }, []);
};