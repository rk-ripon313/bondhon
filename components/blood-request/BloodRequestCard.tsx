import {
  AlertTriangle,
  CalendarDays,
  Clock,
  Droplets,
  Hospital,
  MapPin,
  Phone,
} from "lucide-react";

type BloodRequestCardProps = {
  request: {
    id: string;
    bloodGroupNeeded: string;
    quantity: number;
    urgency: string;
    hospitalName?: string;
    location?: {
      district?: string;
      area?: string;
      address?: string;
    };
    neededBefore: Date | string;
    contactNumber: string;
    additionalNotes?: string;
    status: string;
  };
};

const urgencyStyles: Record<string, string> = {
  low: "bg-emerald-500/10 text-emerald-600",
  normal: "bg-blue-500/10 text-blue-600",
  high: "bg-amber-500/10 text-amber-600",
  critical: "bg-rose-500/10 text-rose-600",
};

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600",
  "in-progress": "bg-amber-500/10 text-amber-600",
  completed: "bg-slate-500/10 text-slate-600",
  cancelled: "bg-red-500/10 text-red-600",
};

export default function BloodRequestCard({ request }: BloodRequestCardProps) {
  const neededBefore = new Date(request.neededBefore);

  const formattedDate = neededBefore.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = neededBefore.toLocaleTimeString("en-BD", {
    hour: "numeric",
    minute: "2-digit",
  });

  const locationText = [request.location?.area, request.location?.district]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="rounded-2xl border border-border/60 bg-app-card p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/10">
            <Droplets className="size-5 text-rose-500" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground sm:text-base">
                {request.bloodGroupNeeded} Blood
              </h3>

              <span className="text-xs text-muted-foreground">
                × {request.quantity}
              </span>
            </div>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Blood request
            </p>
          </div>
        </div>

        {/* Status */}
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-medium capitalize ${
            statusStyles[request.status] ?? "bg-muted text-muted-foreground"
          }`}
        >
          {request.status.replace("-", " ")}
        </span>
      </div>

      {/* Urgency */}
      <div className="mt-4 flex items-center gap-2">
        <AlertTriangle className="size-3.5 text-muted-foreground" />

        <span className="text-xs text-muted-foreground">Urgency:</span>

        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${
            urgencyStyles[request.urgency] ?? "bg-muted text-muted-foreground"
          }`}
        >
          {request.urgency}
        </span>
      </div>

      {/* Information */}
      <div className="mt-4 space-y-3 border-t border-border/50 pt-4">
        {/* Hospital */}
        {request.hospitalName && (
          <div className="flex items-start gap-2.5">
            <Hospital className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Hospital</p>
              <p className="truncate text-sm font-medium text-foreground">
                {request.hospitalName}
              </p>
            </div>
          </div>
        )}

        {/* Location */}
        {locationText && (
          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Location</p>

              <p className="text-sm text-foreground">{locationText}</p>

              {request.location?.address && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {request.location.address}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Needed Before */}
        <div className="flex items-start gap-2.5">
          <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <div>
            <p className="text-[11px] text-muted-foreground">Needed before</p>

            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-sm font-medium text-foreground">
                {formattedDate}
              </span>

              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {formattedTime}
              </span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-start gap-2.5">
          <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <div>
            <p className="text-[11px] text-muted-foreground">Contact</p>

            <a
              href={`tel:${request.contactNumber}`}
              className="text-sm font-medium text-foreground hover:underline"
            >
              {request.contactNumber}
            </a>
          </div>
        </div>
      </div>

      {/* Notes */}
      {request.additionalNotes && (
        <div className="mt-4 rounded-xl bg-muted/40 p-3">
          <p className="text-xs leading-relaxed text-muted-foreground">
            {request.additionalNotes}
          </p>
        </div>
      )}
    </article>
  );
}
