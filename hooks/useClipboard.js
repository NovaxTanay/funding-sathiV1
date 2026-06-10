// hooks/useClipboard.js
import { useState } from 'react';

/**
 * Copies text to clipboard and returns a transient "copied" flag.
 * @returns {{ copy: (text: string) => void, copied: boolean }}
 */
export function useClipboard(resetMs = 2000) {
  const [copied, setCopied] = useState(false);

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetMs);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), resetMs);
    }
  }

  return { copy, copied };
}
