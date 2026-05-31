import { Bell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function NotificationButton() {
  return (
    <Button variant="ghost" size="icon" className="relative rounded-xl">
      <Bell size={18} />
      <Badge className="absolute -top-0.5 -right-0.5 h-2 w-2 p-0 bg-red-500" />
    </Button>
  );
}
