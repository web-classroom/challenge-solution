export function randomArray(arr, count) {
  return arr.sort(() => Math.random() - Math.random()).slice(0, count);
}

export function compare(a, b) {
  const sanitize = (v) => v.toLowerCase().replace(/[^a-z0-9]/g, "");
  return sanitize(a) === sanitize(b);
}