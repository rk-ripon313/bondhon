import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export default function GoogleAuthButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button
        type="submit"
        variant="outline"
        className="w-full cursor-pointer py-2 rounded-md bg-app-background"
      >
        Continue with Google
      </Button>
    </form>
  );
}
