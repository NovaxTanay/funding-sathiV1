// utils/formatDate.js
import { format, parseISO, isValid } from 'date-fns';

/**
 * Formats an ISO date string to a readable display date.
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function formatDate(dateInput) {
  try {
    const d = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    if (!isValid(d)) return '—';
    return format(d, 'dd MMM yyyy, hh:mm a');
  } catch {
    return '—';
  }
}

/**
 * Short date for table cells.
 */
export function formatDateShort(dateInput) {
  try {
    const d = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    if (!isValid(d)) return '—';
    return format(d, 'dd MMM yyyy');
  } catch {
    return '—';
  }
}
