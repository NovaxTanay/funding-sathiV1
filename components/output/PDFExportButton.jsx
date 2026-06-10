// PDFExportButton.jsx — Client-only wrapper for @react-pdf/renderer PDFDownloadLink
// This file is dynamically imported with { ssr: false } by ExportToolbar.
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import { AnalysisPDF } from '../AnalysisPDF';

export default function PDFExportButton({ analysis, leadId }) {
  return (
    <PDFDownloadLink
      document={<AnalysisPDF analysis={analysis} leadId={leadId} />}
      fileName={`${leadId || 'report'}.pdf`}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold
                 uppercase tracking-wider shadow-md active:scale-95
                 transition-all duration-200"
    >
      {({ loading }) => (
        <>
          <Download className="w-3.5 h-3.5" />
          {loading ? 'Generating PDF...' : 'Export as PDF'}
        </>
      )}
    </PDFDownloadLink>
  );
}
