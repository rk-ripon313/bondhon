export const getStatusStyles = (status: string) => {
  switch (status) {
    // ----------------------------------------------------
    // Common / Request Statuses
    // ----------------------------------------------------
    case "active":
      return {
        label: "Active",
        dot: "bg-emerald-500",
        text: "text-emerald-600 dark:text-emerald-400",
        badge:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      };

    case "completed":
      return {
        label: "Completed",
        dot: "bg-green-500",
        text: "text-green-600 dark:text-green-400",
        badge:
          "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400",
      };

    case "pending":
      return {
        label: "Pending",
        dot: "bg-amber-500 animate-pulse",
        text: "text-amber-600 dark:text-amber-400",
        badge:
          "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      };

    case "rejected":
    case "cancelled":
    case "canceled":
      return {
        label: status.toLowerCase() === "rejected" ? "Rejected" : "Cancelled",
        dot: "bg-rose-500",
        text: "text-rose-600 dark:text-rose-400",
        badge:
          "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400",
      };

    case "expired":
      return {
        label: "Expired",
        dot: "bg-slate-400",
        text: "text-slate-500 dark:text-slate-400",
        badge:
          "border-slate-500/20 bg-slate-500/10 text-slate-500 dark:text-slate-400",
      };

    // ----------------------------------------------------
    // Event Specific Statuses
    // ----------------------------------------------------
    case "upcoming":
      return {
        label: "Upcoming",
        dot: "bg-blue-500",
        text: "text-blue-600 dark:text-blue-400",
        badge:
          "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
      };

    case "ongoing":
    case "live":
      return {
        label: "Live Now",
        dot: "bg-emerald-500 animate-ping",
        text: "text-emerald-600 dark:text-emerald-400 font-semibold",
        badge:
          "border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
      };

    case "draft":
      return {
        label: "Draft",
        dot: "bg-zinc-400",
        text: "text-zinc-500 dark:text-zinc-400",
        badge:
          "border-zinc-500/20 bg-zinc-500/10 text-zinc-500 dark:text-zinc-400",
      };

    case "postponed":
      return {
        label: "Postponed",
        dot: "bg-orange-500",
        text: "text-orange-600 dark:text-orange-400",
        badge:
          "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400",
      };

    // Default Fallback
    default:
      return {
        label: status || "Unknown",
        dot: "bg-muted-foreground",
        text: "text-muted-foreground",
        badge: "border-border bg-muted text-muted-foreground",
      };
  }
};

export const getUrgencyStyles = (urgency: string) => {
  switch (urgency) {
    case "critical":
      return {
        label: "Critical",
        text: "text-destructive",
        badge: "border-destructive/20 bg-destructive/10",
      };

    case "urgent":
      return {
        label: "Urgent",
        text: "text-orange-500",
        badge: "border-orange-500/20 bg-orange-500/10",
      };

    case "normal":
      return {
        label: "Normal",
        text: "text-muted-foreground",
        badge: "border-border bg-muted",
      };

    default:
      return {
        label: urgency,
        text: "text-muted-foreground",
        badge: "border-border bg-muted",
      };
  }
};
