import { useState, FormEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PortalLayout } from "@/components/portal";
import { toast } from "sonner";
import { account } from "@/lib/appwrite";

const TrainerForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setError(null);
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      await account.createRecovery(email.trim(), `${window.location.origin}/reset-password`);
      setSent(true);
      toast.success("Password reset link sent. Check your email.");
    } catch (err: any) {
      setError(err?.message || "Unable to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!loading && !sent) {
      void handleSend();
    }
  };

  return (
    <PortalLayout
      title="Forgot Password"
      description="We will email you a secure reset link."
      showHero
      heroHeight="md"
      maxWidth="md"
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle>Password Recovery</CardTitle>
          <CardDescription>Enter your email to receive a reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-muted px-3 py-2 text-sm text-foreground" role="alert" aria-live="polite">{error}</div>
          )}
          {sent ? (
            <div className="text-sm">If the email is registered, a reset link has been sent.</div>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="trainer@example.com" className="placeholder:opacity-30" />
              </div>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </>
          )}
          </form>
        </CardContent>
      </Card>
    </PortalLayout>
  );
};

export default TrainerForgotPassword;