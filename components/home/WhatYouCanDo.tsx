import { Droplets, MapPinned, Megaphone, Siren } from "lucide-react";
import Section from "../layout/Section";

const actions = [
  {
    title: "Blood Donation",
    description: "Respond to urgent blood requests and save lives near you.",
    icon: Droplets,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
  },
  {
    title: "Emergency Response",
    description: "Get notified about nearby critical situations instantly.",
    icon: Siren,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500",
  },
  {
    title: "Community Events",
    description: "Join awareness campaigns and volunteer activities.",
    icon: Megaphone,

    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    title: "Location-Based Matching",
    description: "Discover opportunities and requests around your area.",
    icon: MapPinned,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
  },
];

export default function WhatYouCanDo() {
  return (
    <Section
      title="What You Can Do"
      description="Bondhon helps people take meaningful real-world action, not just online engagement."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((item) => (
          <div
            key={item.title}
            className=" group rounded-3xl border bg-app-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
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
