// lib/geminiRetry.js — Direct wrapper for Gemini API calls (no retry)

/**
 * Direct wrapper for async function execution.
 * (No retry or delays applied - simplified for direct API testing).
 *
 * @param {() => Promise<any>} fn — The async function to execute.
 * @returns {Promise<any>} The resolved value from fn.
 */
export async function retryWithBackoff(fn) {
  return await fn();
}
