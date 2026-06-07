import { BellRing, HeartHandshake, MapPinned, ShieldCheck } from "lucide-react";
import Section from "../layout/Section";

const features = [
  {
    title: "Geo-Based Matching",
    description: "Requests are matched using location-aware technology.",
    icon: MapPinned,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
  },

  {
    title: "Real-Time Alerts",
    description: "Instant notifications when action is needed.",
    icon: BellRing,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },

  {
    title: "Trusted Community",
    description: "Built around responsible volunteers and donors.",
    icon: ShieldCheck,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },

  {
    title: "Action Driven",
    description: "Focused on helping people, not generating engagement.",
    icon: HeartHandshake,
    iconBg: "bg-app-primary/10",
    iconColor: "text-app-primary",
  },
];

export default function TrustSection() {
  return (
    <Section
      title="Why People Trust BondhOn"
      description="Designed for real-world impact with speed, transparency, and community trust."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((item) => (
          <div
            key={item.title}
            className=" rounded-3xl border bg-app-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
          >
            <div
              className={`${item.iconBg} mb-5 flex h-14 w-14 items-center justify-center rounded-2xl`}
            >
              <item.icon className={`h-7 w-7 ${item.iconColor}`} />
            </div>

            <h3 className="text-lg font-semibold">{item.title}</h3>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
