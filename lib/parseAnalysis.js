export function parseAnalysis(raw) {
  // Strip markdown fences if present
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("[parse] Failed to parse analysis:", err);
    return null;
  }
}
