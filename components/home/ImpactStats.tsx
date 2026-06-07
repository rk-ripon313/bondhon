import { CalendarRange, HeartPulse, MapPinned, Users } from "lucide-react";
import Section from "../layout/Section";

const stats = [
  {
    label: "Verified Donors",
    value: "12,450+",
    icon: Users,
    iconColor: "text-app-secondary",
    bg: "bg-blue-500/5",
    border: "border-blue-500/10",
  },
  {
    label: "Lives Impacted",
    value: "12,450+",
    icon: HeartPulse,
    iconColor: "text-app-primary",
    bg: "bg-red-500/5",
    border: "border-red-500/10",
  },
  {
    label: "Community Events",
    value: "420+",
    icon: CalendarRange,
    iconColor: "text-amber-500",
    bg: "bg-amber-500/5",
    border: "border-amber-500/10",
  },
  {
    label: "District Coverage",
    value: "64",
    icon: MapPinned,
    iconColor: "text-green-500",
    bg: "bg-green-500/5",
    border: "border-green-500/10",
  },
];

export default function ImpactStats() {
  return (
    <Section>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl border ${stat.border} ${stat.bg} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
          >
            <stat.icon className={`h-7 w-7 mb-4 ${stat.iconColor}`} />

            <div>
              <p className="text-3xl font-mono font-bold text-app-foreground tracking-tight">
                {stat.value}
              </p>

              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
