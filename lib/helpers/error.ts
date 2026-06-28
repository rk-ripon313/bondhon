export function getErrorMessage(
  error: unknown,
  fallback = "An unexpected error occurred.",
): string {
  if (!error) return fallback;

  if (error instanceof Error) {
    if (error.message && error.message.trim() !== "") {
      return error.message;
    }
    return fallback;
  }

  if (typeof error === "object" && "message" in error) {
    const obj = error as { message: unknown };
    if (typeof obj.message === "string" && obj.message.trim() !== "") {
      return obj.message;
    }
  }

  if (typeof error === "string" && error.trim() !== "") {
    return error;
  }

  return fallback;
}
