import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
/**
 * Calculates age based on the provided date of birth (DOB).
 * @param {string} dob - The date of birth in a string format (e.g., "YYYY-MM-DD").
 * @returns {number} The calculated age.
 */
export const calculateAge = (dob: string | Date) => {
  const birth = new Date(dob);

  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

/**
 * Formats a given date into a human-readable string in the "en-BD" locale.
 * @param {Date | string} date - The date to format, either as a Date object or a string.
 * @returns {string} The formatted date string in the format "day month year" (e.g., "1 January 2023").
 */

export const formatDate = (date?: Date | string) => {
  if (!date) return "Not provided";

  return new Date(date).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/**
 * Formats a given date and time into a human-readable string in the "en-BD" locale.
 * @param {Date | string} date - The date and time to format, either as a Date object or a string.
 * @returns {string} The formatted date and time string in the format "day month, hour:minute AM/PM" (e.g., "1 January, 10:30 AM").
 */

export const formatDateTime = (date: Date | string) => {
  return new Date(date).toLocaleString("en-BD", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
};

/**
 * Returns a human-readable string representing the time elapsed since the given date.
 * @param {Date | string} date - The date to calculate the time ago from, either as a Date object or a string.
 * @returns {string} A string representing the time elapsed (e.g., "Just now", "5m ago", "2h ago", "3d ago", "1mo ago", "2y ago").
 */

export const getTimeAgo = (date?: Date | string) => {
  if (!date) return "";

  const now = new Date();
  const created = new Date(date);
  const diff = Math.floor((now.getTime() - created.getTime()) / 1000);

  if (diff < 60) return "Just now";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(days / 365);
  return `${years}y ago`;
};

/**
 *  Get user time zone
 */

export const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Convert user's local datetime input to UTC Date
 */
export const localDateTimeToUTC = (
  dateTime: string,
  timeZone = getUserTimezone(),
) => {
  return fromZonedTime(dateTime, timeZone);
};

/**
 * Convert UTC Date to user's local datetime-local input value
 */
export const utcToLocalDateTimeInput = (
  date: Date | string,
  timeZone = getUserTimezone(),
) => {
  return formatInTimeZone(date, timeZone, "yyyy-MM-dd'T'HH:mm");
};
