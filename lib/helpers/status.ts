export const getStatusStyles = (status: string) => {
  switch (status) {
    case "active":
      return {
        label: "Active",
        dot: "bg-emerald-500",
        text: "text-emerald-500",
        badge: "border-emerald-500/20 bg-emerald-500/10",
      };

    case "assigned":
      return {
        label: "Assigned",
        dot: "bg-blue-500",
        text: "text-blue-500",
        badge: "border-blue-500/20 bg-blue-500/10",
      };

    case "completed":
      return {
        label: "Completed",
        dot: "bg-green-500",
        text: "text-green-500",
        badge: "border-green-500/20 bg-green-500/10",
      };

    case "expired":
      return {
        label: "Expired",
        dot: "bg-muted-foreground",
        text: "text-muted-foreground",
        badge: "border-border bg-muted",
      };

    default:
      return {
        label: status,
        dot: "bg-muted-foreground",
        text: "text-muted-foreground",
        badge: "border-border bg-muted",
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
