/**
 * Calculates age based on the provided date of birth (DOB).
 * @param {string} dob - The date of birth in a string format (e.g., "YYYY-MM-DD").
 * @returns {number} The calculated age.
 */

export const calculateAge = (dob: string) => {
  const birth = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};
