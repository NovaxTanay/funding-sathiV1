// utils/validateAnalysis.js
import { analysisSchema } from '../constants/schema';

/**
 * Validates Gemini output against the analysisSchema.
 * @param {unknown} data
 * @returns {{ success: boolean, data?: object, error?: string }}
 */
export function validateAnalysis(data) {
  const result = analysisSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const msg = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
  return { success: false, error: msg };
}
