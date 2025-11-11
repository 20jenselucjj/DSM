import { useEffect, useMemo, useState, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PortalLayout } from "@/components/portal";
import { toast } from "sonner";
import { account } from "@/lib/appwrite";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const ATTEMPTS_KEY = "trainer-login-attempts";
const LOCKOUT_KEY = "trainer-login-lockout-until";

const getLockoutRemaining = () => {
  const until = Number(localStorage.getItem(LOCKOUT_KEY) || 0);
  const now = Date.now();
  return until > now ? until - now : 0;
};

const TrainerLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lockRemaining, setLockRemaining] = useState(getLockoutRemaining());

  useEffect(() => {
    const interval = setInterval(() => setLockRemaining(getLockoutRemaining()), 1000);
    return () => clearInterval(interval);
  }, []);

  const attempts = useMemo(() => Number(localStorage.getItem(ATTEMPTS_KEY) || 0), []);
  const locked = lockRemaining > 0;

  const handleLogin = async () => {
    setError(null);
    if (locked) return;
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      await account.createEmailSession(email.trim(), password);
      // Check email verification status immediately after creating session
      const user = await account.get();
      if (!user.emailVerification) {
        try {
          await account.createVerification(`${window.location.origin}/verify-email`);
        } catch (_) {}
        // Log out the unverified session and inform the user
        try {
          await account.deleteSession("current");
        } catch (_) {}
        setError("Please verify your email before signing in. A new verification link has been sent.");
        toast.info("Email verification required. Check your inbox.");
        navigate("/verify-email");
        return;
      }
      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_KEY);
      try {
        window.dispatchEvent(new Event("appwrite-session-changed"));
      } catch {}
      toast.success("Login successful");
      navigate("/at-portal");
    } catch (err: any) {
      const nextAttempts = attempts + 1;
      localStorage.setItem(ATTEMPTS_KEY, String(nextAttempts));
      if (nextAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_MINUTES * 60 * 1000;
        localStorage.setItem(LOCKOUT_KEY, String(until));
        toast.error("Too many failed attempts. Login locked temporarily.");
      }
      const message = err?.message || "Invalid credentials. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  const formatRemaining = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <PortalLayout
      title="TRAINER LOGIN"
      description="Sign in to access AT Portal tools and resources."
      showHero
      heroHeight="md"
      maxWidth="md"
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="font-bold">Secure Login</CardTitle>
          <CardDescription className="font-bold">Only verified Athletic Trainers may sign in.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 font-bold">
          {locked && (
            <div className="rounded-md bg-destructive/10 text-destructive px-3 py-2 text-sm" role="alert" aria-live="polite">
              Account temporarily locked due to failed attempts. Try again in {formatRemaining(lockRemaining)}.
            </div>
          )}
          {error && (
            <div className="rounded-md bg-muted px-3 py-2 text-sm text-foreground" role="alert" aria-live="polite">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="trainer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={locked}
                className="placeholder:opacity-30"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={locked}
                  className="pr-10 placeholder:opacity-30"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button className="w-full" type="submit" disabled={loading || locked}>
              {loading ? "Signing in..." : "Login"}
            </Button>
            <div className="flex items-center justify-center text-sm">
              <Link to="/trainer/forgot" className="text-primary hover:underline">Forgot Password</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </PortalLayout>
  );
};

export default TrainerLogin;