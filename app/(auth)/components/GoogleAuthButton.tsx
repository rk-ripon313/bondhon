import { Button } from "@/components/ui/button";

export default function GoogleAuthButton() {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full cursor-pointer py-2 rounded-md bg-app-background"
    >
      Continue with Google
    </Button>
  );
}
