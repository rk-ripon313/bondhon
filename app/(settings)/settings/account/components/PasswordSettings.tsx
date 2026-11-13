"use client";

import { Button } from "@/components/ui/button";
import { KeyRound, ShieldCheck } from "lucide-react";
import { useState } from "react";
import PasswordDialog from "./PasswordDialog";

export default function PasswordSettings({
  hasPassword,
}: {
  hasPassword: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-xl border border-border bg-app-card p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-app-primary/10 text-app-primary">
          <KeyRound className="size-4.5" />
        </div>

        <div>
          <h2 className="text-sm font-semibold">Password & Authentication</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Manage your password and sign-in security.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-lg bg-app-background/60 p-3.5">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

        <div className="min-w-0">
          <p className="text-sm font-medium">
            {hasPassword ? "Password is set" : "No password set"}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {hasPassword
              ? "Your account has a password. You can update it anytime."
              : "Set a password to sign in using your email and password."}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Button
          variant="default"
          onClick={() => setOpen(true)}
          className="h-9 cursor-pointer gap-2 rounded-lg bg-app-primary px-4 text-sm text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-app-primary/90 hover:shadow-md active:translate-y-0"
        >
          <KeyRound className="size-3.5" />
          {hasPassword ? "Change Password" : "Set Password"}
        </Button>
      </div>

      <PasswordDialog
        open={open}
        onOpenChange={setOpen}
        hasPassword={hasPassword}
      />
    </section>
  );
}
