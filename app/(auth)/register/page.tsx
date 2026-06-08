import Link from "next/link";
import AuthHeader from "../components/AuthHeader";
import GoogleAuthButton from "../components/GoogleAuthButton";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-xl rounded-2xl border bg-app-card p-6 md:p-8">
      <AuthHeader
        title="Create Account"
        description="Join BondhOn and start helping your community."
      />

      <RegisterForm />

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <GoogleAuthButton />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-app-primary hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
