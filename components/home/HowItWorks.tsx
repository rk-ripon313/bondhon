import { Radio, ShieldCheck, Users2 } from "lucide-react";
import Section from "../layout/Section";

const steps = [
  {
    step: "01",
    title: "Create a Request",
    description:
      "Submit a blood request or community activity with location details.",
    icon: Radio,
    iconBg: "bg-app-primary/10",
    iconColor: "text-app-primary",
  },
  {
    step: "02",
    title: "Geo-Based Matching",
    description: "Nearby users receive alerts based on distance and urgency.",
    icon: Users2,
    iconBg: "bg-app-secondary/10",
    iconColor: "text-app-secondary",
  },
  {
    step: "03",
    title: "Take Real Action",
    description: "Coordinate quickly and complete real-world impact.",
    icon: ShieldCheck,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
];

export default function HowItWorks() {
  return (
    <Section
      title="How BondhOn Works"
      description=" Faster and more reliable than scattered social media coordination."
    >
      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((item) => (
          <div
            key={item.step}
            className="group rounded-3xl border bg-app-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-8 flex items-center justify-between">
              <div
                className={`${item.iconBg} flex h-14 w-14 items-center justify-center rounded-2xl`}
              >
                <item.icon className={`h-7 w-7 ${item.iconColor}`} />
              </div>

              <span className="text-5xl font-black text-muted-foreground/20">
                {item.step}
              </span>
            </div>

            <h3 className="text-xl font-bold">{item.title}</h3>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
