import { useEffect, useState, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PortalLayout } from "@/components/portal";
import { toast } from "sonner";
import { account } from "@/lib/appwrite";

const strong = (pwd: string) => pwd.length >= 8 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd);

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const uid = params.get("userId") || params.get("user_id");
    const sec = params.get("secret");
    setUserId(uid);
    setSecret(sec);
  }, [params]);

  const handleUpdate = async () => {
    setError(null);
    if (!userId || !secret) {
      setError("Missing reset data. Use the link from your email.");
      return;
    }
    if (!password || !confirm) {
      setError("Please enter and confirm your new password.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!strong(password)) {
      setError("Password does not meet strength requirements.");
      return;
    }
    setLoading(true);
    try {
      await account.updateRecovery(userId, secret, password, confirm);
      toast.success("Password updated. You may now sign in.");
      navigate("/trainer/login");
    } catch (err: any) {
      setError(err?.message || "Unable to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!loading) {
      void handleUpdate();
    }
  };

  return (
    <PortalLayout title="Reset Password" description="Choose a strong new password for your account." showHero heroHeight="sm" maxWidth="md">
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Temporary reset links expire for your security.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-muted px-3 py-2 text-sm text-foreground" role="alert" aria-live="polite">{error}</div>}
          <div className="grid gap-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Strong password"
                className="pr-10"
                aria-invalid={!strong(password)}
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
            <div className="text-xs text-muted-foreground">8+ chars, uppercase, lowercase, number, special character.</div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat password"
                className="pr-10"
                aria-invalid={!!confirm && password !== confirm}
              />
              <button
                type="button"
                aria-label={showConfirm ? "Hide password" : "Show password"}
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button className="w-full" type="submit" disabled={loading || !strong(password)}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
          <div className="text-sm text-center">
            <Button variant="link" asChild>
              <Link to="/trainer/login">Back to Login</Link>
            </Button>
          </div>
          </form>
        </CardContent>
      </Card>
    </PortalLayout>
  );
};

export default ResetPassword;