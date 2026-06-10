// utils/generateLeadId.js
import { CONFIG } from '../constants/config';

/**
 * Generates a unique lead ID in format FS-2026-NNNN.
 * Uses timestamp-based suffix to avoid collisions.
 */
export function generateLeadId() {
  const suffix = String(Date.now()).slice(-4).padStart(4, '0');
  return `${CONFIG.LEAD_ID_PREFIX}-${CONFIG.LEAD_ID_YEAR}-${suffix}`;
}
