import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PortalLayout } from "@/components/portal";
import { toast } from "sonner";
import { account } from "@/lib/appwrite";

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState<string>("Verifying your email...");

  useEffect(() => {
    const userId = params.get("userId") || params.get("user_id");
    const secret = params.get("secret");
    if (!userId || !secret) {
      setStatus("error");
      setMessage("Missing verification data. Please use the link from your email.");
      return;
    }
    account
      .updateVerification(userId, secret)
      .then(() => {
        setStatus("success");
        setMessage("Email verified successfully. You may now sign in.");
        toast.success("Email verified");
      })
      .catch((err: any) => {
        setStatus("error");
        setMessage(err?.message || "Verification failed.");
      });
  }, [params]);

  return (
    <PortalLayout title="Email Verification" description="Confirm your email to access the AT Portal." showHero heroHeight="sm" maxWidth="md">
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle>Verify Email</CardTitle>
          <CardDescription>Completing verification for your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`rounded-md px-3 py-2 text-sm ${status === "success" ? "bg-primary text-primary-foreground" : status === "error" ? "bg-destructive/10 text-destructive" : "bg-muted text-foreground"}`}>
            {message}
          </div>
          <div className="flex justify-center">
            <Button asChild>
              <Link to="/trainer/login">Go to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PortalLayout>
  );
};

export default VerifyEmail;