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

export const handleApiError = (
  error: any,
  res: { status: (code: number) => { send: (body: any) => void } },
  context: string
) => {
  console.error(`${context} error: `, error);

  if (error.response?.status === 401) {
    res.status(401).send({
      message:
        "Invalid API key for OpenRouter. Please check your configuration.",
      error: error.message,
    });
  } else if (error.response?.status === 429) {
    res.status(429).send({
      message:
        "Rate limit exceeded for OpenRouter API. Please try again later.",
      error: error.message,
    });
  } else if (error.code === "ECONNRESET" || error.code === "ENOTFOUND") {
    res.status(503).send({
      message:
        "Network error connecting to OpenRouter API. Please check your connection.",
      error: error.message,
    });
  } else {
    res.status(500).send({
      message: `Error ${context}`,
      error: error.message || "Unknown error occurred",
    });
  }
};
