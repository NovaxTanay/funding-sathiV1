// lib/parseGeminiResponse.js — Safe parser for Gemini JSON responses

/**
 * Parses a raw Gemini API response string into a JavaScript object.
 *
 * Handles common quirks:
 * - Strips markdown code fences (```json … ``` or ``` … ```)
 * - Trims leading/trailing whitespace
 * - Throws descriptive errors on empty or malformed responses
 *
 * @param {string} raw — The raw text response from Gemini.
 * @returns {object} The parsed JSON object.
 * @throws {Error} If the response is empty/null or not valid JSON.
 */
export function parseGeminiResponse(raw) {
  if (!raw || raw.trim().length === 0) {
    throw new Error('AI returned an empty response');
  }

  // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '');
  cleaned = cleaned.replace(/\n?\s*```$/i, '');
  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const preview = cleaned.slice(0, 200);
    throw new Error(
      `AI response was not valid JSON. First 200 chars: ${preview}`
    );
  }
}
