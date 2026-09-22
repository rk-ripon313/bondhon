export const formatBDPhone = (phone: string) => {
  const normalized = phone.trim();

  if (!/^01[3-9]\d{8}$/.test(normalized)) {
    return phone;
  }

  return `+880 ${normalized.slice(1, 5)}-${normalized.slice(5)}`;
};
