import {
  Building2,
  CalendarDays,
  Droplets,
  MapPin,
  Package,
  ShieldAlert,
} from "lucide-react";
import type { ReactNode } from "react";

import { formatDateTime } from "@/lib/helpers/date";
import { formatLocation } from "@/lib/helpers/location-format";
import { getUrgencyStyles } from "@/lib/helpers/status";
import { BloodRequestCardData } from "@/types/blood-request.type";

export function BloodRequestInfo({
  request,
}: {
  request: BloodRequestCardData;
}) {
  const urgencyStyles = getUrgencyStyles(request.urgency);

  return (
    <div className="space-y-5">
      {/* Request Information */}
      <section className="rounded-2xl border border-border bg-app-card">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <h2 className="font-semibold">Request Information</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Details about this blood request.
          </p>
        </div>

        <div className="grid gap-px bg-border sm:grid-cols-2">
          <InfoItem
            icon={<Droplets />}
            label="Blood Group"
            value={request.bloodGroupNeeded}
          />

          <InfoItem
            icon={<Package />}
            label="Quantity"
            value={`${request.quantity} ${
              request.quantity === 1 ? "bag" : "bags"
            }`}
          />

          <InfoItem
            icon={<ShieldAlert />}
            label="Urgency"
            value={urgencyStyles.label}
            valueClassName={urgencyStyles.text}
          />

          <InfoItem
            icon={<CalendarDays />}
            label="Needed Before"
            value={formatDateTime(request.neededBefore)}
          />

          {request.hospitalName && (
            <InfoItem
              icon={<Building2 />}
              label="Hospital / Place"
              value={request.hospitalName}
              fullWidth
            />
          )}

          <InfoItem
            icon={<MapPin />}
            label="Location"
            value={formatLocation(request.location)}
            secondaryValue={request.location?.address || ""}
            fullWidth
          />
        </div>
      </section>

      {/* Additional Notes */}
      {request.additionalNotes && (
        <section className="rounded-2xl border border-border bg-app-card p-5 sm:p-6">
          <h2 className="font-semibold">Additional Notes</h2>

          <p className="mt-3 whitespace-pre-wrap rounded-xl bg-muted/40 p-4 text-sm leading-6 text-muted-foreground">
            {request.additionalNotes}
          </p>
        </section>
      )}
    </div>
  );
}

interface InfoItemProps {
  icon: ReactNode;
  label: string;
  value: string;
  secondaryValue?: string;
  valueClassName?: string;
  fullWidth?: boolean;
}

function InfoItem({
  icon,
  label,
  value,
  secondaryValue,
  valueClassName = "",
  fullWidth = false,
}: InfoItemProps) {
  return (
    <div
      className={`bg-app-card p-4 sm:p-5 ${fullWidth ? "sm:col-span-2" : ""}`}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="[&>svg]:size-4">{icon}</span>

        <span className="text-xs">{label}</span>
      </div>

      <p className={`mt-2 text-sm font-medium ${valueClassName}`}>{value}</p>

      {secondaryValue && (
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {secondaryValue}
        </p>
      )}
    </div>
  );
}
