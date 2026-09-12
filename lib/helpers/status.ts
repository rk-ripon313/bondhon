export const getStatusStyles = (status: string) => {
  switch (status) {
    case "active":
      return {
        label: "Active",
        dot: "bg-emerald-500",
        text: "text-emerald-500",
      };

    case "assigned":
      return {
        label: "Assigned",
        dot: "bg-blue-500",
        text: "text-blue-500",
      };

    case "completed":
      return {
        label: "Completed",
        dot: "bg-green-500",
        text: "text-green-500",
      };

    case "expired":
      return {
        label: "Expired",
        dot: "bg-muted-foreground",
        text: "text-muted-foreground",
      };

    default:
      return {
        label: status,
        dot: "bg-muted-foreground",
        text: "text-muted-foreground",
      };
  }
};
