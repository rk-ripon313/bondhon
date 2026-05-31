import { Button } from "@/components/ui/button";
import { ChevronDown, Sunrise } from "lucide-react";

export default function WeatherButton({ mobile }: { mobile?: boolean }) {
  return (
    <Button
      variant="outline"
      className={`gap-2 rounded-xl
      ${mobile ? "w-full justify-between" : "hidden lg:flex"}`}
    >
      <div className="flex items-center gap-2">
        <span>
          <Sunrise />
        </span>

        <span className="text-sm">26° Dhaka</span>
      </div>

      <ChevronDown size={14} className="opacity-60" />
    </Button>
  );
}
