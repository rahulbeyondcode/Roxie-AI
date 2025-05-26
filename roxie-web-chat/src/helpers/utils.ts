export function generateRandomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const generateRandomString = (length: number) =>
  Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, length);
