export function debounce<A extends unknown[], R>(
  fn: (...args: A) => R,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: A) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
