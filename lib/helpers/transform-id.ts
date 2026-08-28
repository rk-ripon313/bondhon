export const replaceMongoIdInArray = <T extends { _id: unknown }>(
  array: T[],
): (Omit<T, "_id"> & { id: string })[] => {
  return array.map(({ _id, ...item }) => ({
    id: String(_id),
    ...item,
  }));
};

export const replaceMongoIdInObject = <T extends { _id: unknown }>(
  data: T | null,
): (Omit<T, "_id"> & { id: string }) | null => {
  if (!data) return null;

  const { _id, ...rest } = data;

  return {
    id: String(_id),
    ...rest,
  };
};
