"use client";

import { credentialLogin } from "@/app/actions/auth/signin.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/helpers/error";
import {
  loginSchema,
  type LoginFormInput,
} from "@/lib/validations/auth/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginForm() {

  const router = useRouter();
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInput) => {
    try {
      const res = await credentialLogin(data);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);

       router.push("/");
    } catch (error) {
      console.error("Register Error:", error);
      toast.error(getErrorMessage(error));
    }
  };
  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="">
        <Input
          {...register("email")}
          type="email"
          placeholder="Email Address"
          className="w-full rounded-md border px-3 py-2"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="relative">
        <Input
          {...register("password")}
          type={showPass ? "text" : "password"}
          placeholder="Password"
        />
        <button
          type="button"
          onClick={() => setShowPass((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
        >
          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>

        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button
        className="w-full bg-app-primary hover:bg-app-primary/90 py-2 rounded-md cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
