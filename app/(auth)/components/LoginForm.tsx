"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginForm() {
  const [showPass, setShowPass] = useState(false);
  return (
    <form className="mt-6 space-y-4">
      <Input
        type="email"
        placeholder="Email Address"
        className="w-full rounded-md border px-3 py-2"
      />

      <div className="relative">
        <Input
          type={showPass ? "text" : "password"}
          name="password"
          placeholder="Password"
        />
        <button
          type="button"
          onClick={() => setShowPass((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <Button className="w-full bg-app-primary hover:bg-app-primary/90 py-2 rounded-md cursor-pointer">
        Create Account
      </Button>
    </form>
  );
}
