export const generateRandomString = (length: number) =>
  Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, length);

export const sanitizeString = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_\s]/g, "")
    .replace(/[\s-]+/g, "_");
