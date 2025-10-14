import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const GATE_ENABLED = import.meta.env.VITE_AT_PORTAL_GATE_ENABLED === "true";
const GATE_CODE = import.meta.env.VITE_AT_PORTAL_GATE_CODE || "demo";
const STORAGE_KEY = "at-portal-authorized";

const ATPortalGate = () => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!GATE_ENABLED) return;
    const authorized = localStorage.getItem(STORAGE_KEY) === "true";
    setOpen(!authorized);
  }, []);

  if (!GATE_ENABLED) return null;

  const handleSubmit = () => {
    if (code.trim() === GATE_CODE) {
      localStorage.setItem(STORAGE_KEY, "true");
      setOpen(false);
      toast.success("Access granted");
    } else {
      toast.error("Invalid access code");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AT Portal Access</DialogTitle>
          <DialogDescription>Enter the access code to continue.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Access code" />
          <Button onClick={handleSubmit}>Unlock</Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Hint: configurable via VITE_AT_PORTAL_GATE_CODE</p>
      </DialogContent>
    </Dialog>
  );
};

export default ATPortalGate;