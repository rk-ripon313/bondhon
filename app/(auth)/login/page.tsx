import Link from "next/link";
import AuthHeader from "../components/AuthHeader";
import GoogleAuthButton from "../components/GoogleAuthButton";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md rounded-2xl border bg-app-card p-6 md:p-8">
      <AuthHeader
        title="Welcome Back"
        description="Login to continue using BondhOn"
      />

      <LoginForm />

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <GoogleAuthButton />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {"Don't have an account?"}{" "}
        <Link href="/register" className="text-app-primary font-medium">
          Register
        </Link>
      </p>
    </div>
  );
}
