import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PortalLayout } from "@/components/portal";
import { toast } from "sonner";
import { account, ID } from "@/lib/appwrite";

const passwordStrength = (pwd: string) => {
  const checks = {
    length: pwd.length >= 12,
    upper: /[A-Z]/.test(pwd),
    lower: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    special: /[^A-Za-z0-9]/.test(pwd),
  };
  const score = Object.values(checks).filter(Boolean).length;
  return { checks, score };
};

const TrainerRegister = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { checks, score } = passwordStrength(password);
  const strongEnough = score === 5;

  const handleRegister = async () => {
    setError(null);
    if (!name || !email || !password || !confirm) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!strongEnough) {
      setError("Password does not meet strength requirements.");
      return;
    }
    setLoading(true);
    try {
      await account.create(ID.unique(), email.trim(), password, name.trim());
      await account.createVerification(`${window.location.origin}/verify-email`);
      toast.success("Account created. Check your email to verify.");
      navigate("/trainer/login");
    } catch (err: any) {
      setError(err?.message || "Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalLayout
      title="Create Trainer Account"
      description="Register to access secure tools for Athletic Trainers."
      showHero
      heroHeight="md"
      maxWidth="md"
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle>Registration</CardTitle>
          <CardDescription>Verification is required before you can sign in.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-muted px-3 py-2 text-sm text-foreground">{error}</div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Trainer" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="trainer@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Strong password" />
            <div className="text-xs text-muted-foreground">
              Requirements: 12+ chars, uppercase, lowercase, number, special character.
            </div>
            <div className="flex gap-2">
              {Object.entries(checks).map(([key, ok]) => (
                <span key={key} className={`px-2 py-1 rounded text-[11px] ${ok ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {key}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" />
          </div>
          <Button className="w-full" onClick={handleRegister} disabled={loading || !strongEnough}>
            {loading ? "Creating..." : "Create Account"}
          </Button>
          <div className="text-sm text-center">
            Already have an account? <Link to="/trainer/login" className="text-primary hover:underline">Login</Link>
          </div>
        </CardContent>
      </Card>
    </PortalLayout>
  );
};

export default TrainerRegister;