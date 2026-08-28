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
