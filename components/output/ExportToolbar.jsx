// ExportToolbar.jsx — Copy to clipboard + Download PDF buttons
import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import dynamic from 'next/dynamic';
import { formatAnalysisForClipboard } from '../../utils/formatAnalysisForClipboard';

// Client-only wrapper that imports both PDFDownloadLink and AnalysisPDF
// together, avoiding SSR and the dynamic-wrapper-in-document-prop issue.
const PDFExportButton = dynamic(
  () => import('./PDFExportButton'),
  { ssr: false, loading: () => (
    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                     bg-indigo-600/50 text-white/60 text-xs font-bold
                     uppercase tracking-wider shadow-md cursor-wait">
      Loading PDF engine…
    </span>
  )}
);

export default function ExportToolbar({ analysis, formData, leadId }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      const text = formatAnalysisForClipboard(analysis, leadId);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback */
    }
  }

  return (
    <div className="flex flex-wrap gap-3 pt-4 border-t border-white/40 dark:border-white/10">
      <button
        onClick={handleCopy}
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                    text-xs font-bold uppercase tracking-wider shadow-sm
                    transition-all duration-200 active:scale-95 ${
          copied
            ? 'bg-emerald-600 text-white'
            : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
        }`}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? 'Copied!' : 'Copy to Clipboard'}
      </button>

      {analysis && <PDFExportButton analysis={analysis} leadId={leadId} />}
    </div>
  );
}
