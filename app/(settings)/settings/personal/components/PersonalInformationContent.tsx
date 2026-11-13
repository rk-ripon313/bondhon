"use client";

import {
  CalendarDays,
  Droplets,
  HeartPulse,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Ruler,
  UserRound,
  Weight,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/helpers/date";
import { UserProfile } from "@/types/user.type";

import ProfileEditDialog from "@/app/(main)/profile/components/profile-edit/ProfileEditDialog";

type EditTab = "personal" | "medical" | "location";

interface PersonalInformationContentProps {
  user: UserProfile;
}

interface InformationItemProps {
  label: string;
  value?: ReactNode;
  icon?: React.ElementType;
  fullWidth?: boolean;
}

function InformationItem({
  label,
  value,
  icon: Icon,
  fullWidth,
}: InformationItemProps) {
  return (
    <div
      className={`min-w-0 rounded-lg bg-app-background/70 px-3.5 py-3 ${
        fullWidth ? "sm:col-span-2 lg:col-span-2" : ""
      }`}
    >
      <p className="text-xs font-medium text-muted-foreground">{label}</p>

      <div className="mt-1.5 flex min-w-0 items-center gap-2 text-sm font-medium text-foreground">
        {Icon && <Icon className="size-3.5 shrink-0 text-muted-foreground" />}
        <span className="min-w-0 break-words">{value ?? "Not added"}</span>
      </div>
    </div>
  );
}

interface InformationSectionProps {
  title: string;
  icon: React.ElementType;
  iconClassName: string;
  onEdit: () => void;
  children: ReactNode;
}

function InformationSection({
  title,
  icon: Icon,
  iconClassName,
  onEdit,
  children,
}: InformationSectionProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-app-card">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
          >
            <Icon className="size-4.5" />
          </div>

          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="h-8 shrink-0 gap-1.5 px-2.5 text-xs cursor-pointer"
        >
          <Pencil className="size-3.5" />
          Edit
        </Button>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">{children}</div>
    </section>
  );
}

export default function PersonalInformationContent({
  user,
}: PersonalInformationContentProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<EditTab>("personal");

  const handleEdit = (tab: EditTab) => {
    setActiveTab(tab);
    setOpen(true);
  };

  const gender = user.gender
    ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
    : undefined;

  return (
    <>
      <div className="space-y-5">
        {/* Basic Details */}
        <InformationSection
          title="Basic Details"
          icon={UserRound}
          iconClassName="bg-app-primary/10 text-app-primary"
          onEdit={() => handleEdit("personal")}
        >
          <InformationItem label="Full Name" value={user.name} />
          <InformationItem label="Nickname" value={user.nickname} />

          <InformationItem label="Gender" value={gender} />
          <InformationItem
            label="Date of Birth"
            value={user.dateOfBirth ? formatDate(user.dateOfBirth) : undefined}
            icon={CalendarDays}
          />

          <InformationItem
            label="Username"
            value={user.username ? `@${user.username}` : undefined}
            fullWidth
          />
        </InformationSection>

        {/* Contact Information */}
        <InformationSection
          title="Contact Information"
          icon={Mail}
          iconClassName="bg-sky-500/10 text-sky-500"
          onEdit={() => handleEdit("personal")}
        >
          <InformationItem
            label="Email Address"
            value={user.email}
            icon={Mail}
          />

          <InformationItem
            label="Phone Number"
            value={user.phone}
            icon={Phone}
          />
        </InformationSection>

        {/* Medical Information */}
        <InformationSection
          title="Medical Information"
          icon={HeartPulse}
          iconClassName="bg-rose-500/10 text-rose-500"
          onEdit={() => handleEdit("medical")}
        >
          <InformationItem
            label="Blood Group"
            value={user.bloodGroup}
            icon={Droplets}
          />

          <InformationItem
            label="Height"
            value={user.height ? `${user.height} cm` : undefined}
            icon={Ruler}
          />

          <InformationItem
            label="Weight"
            value={user.weight ? `${user.weight} kg` : undefined}
            icon={Weight}
          />
        </InformationSection>

        {/* Location Information */}
        <InformationSection
          title="Location Information"
          icon={MapPin}
          iconClassName="bg-emerald-500/10 text-emerald-500"
          onEdit={() => handleEdit("location")}
        >
          <InformationItem
            label="Area / Upazila / Thana"
            value={user.location?.area}
          />

          <InformationItem label="District" value={user.location?.district} />

          <div className="sm:col-span-2">
            <InformationItem
              label="Specific Address"
              value={user.location?.address}
            />
          </div>
        </InformationSection>
      </div>

      <ProfileEditDialog
        key={activeTab}
        open={open}
        onOpenChange={setOpen}
        defaultTab={activeTab}
        user={user}
      />
    </>
  );
}
