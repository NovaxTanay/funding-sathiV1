// LeadDetailModal.jsx — slide-in modal showing full lead analysis
import { X } from 'lucide-react';
import AnalysisOutputPanel from '../output/AnalysisOutputPanel';
import StatusChip from '../ui/StatusChip';

export default function LeadDetailModal({ lead, onClose }) {
  if (!lead) return null;
  const { leadId, status, inputSnapshot, analysisOutput } = lead;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl
                      flex flex-col glass-panel shadow-glass-dark-md
                      border-l border-white/10 overflow-hidden
                      animate-[slideIn_0.3s_cubic-bezier(0.4,0,0.2,1)]">
        {/* Header */}
        <div className="h-16 shrink-0 px-5 sm:px-6 flex items-center justify-between
                        border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-slate-900 dark:text-white font-mono">{leadId}</span>
            <StatusChip status={status} />
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 dark:text-slate-500 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* Borrower snapshot */}
          {inputSnapshot && (
            <div className="glass-panel rounded-2xl p-4 shadow-glass-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Borrower Snapshot</p>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {[
                  ['Entity', inputSnapshot.entityType],
                  ['Turnover', `₹${inputSnapshot.annualTurnover} Cr`],
                  ['Loan Req.', `₹${inputSnapshot.loanRequirement} Cr`],
                  ['Purpose', inputSnapshot.loanPurpose],
                  ['Bureau', inputSnapshot.bureauScore],
                  ['Vintage', `${inputSnapshot.businessVintage} yrs`],
                  ['Location', inputSnapshot.location],
                  ['GST', inputSnapshot.gstStatus],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-slate-400 dark:text-slate-500">{k}</dt>
                    <dd className="font-bold text-slate-900 dark:text-white mt-0.5">{v || '—'}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Full analysis */}
          {analysisOutput
            ? <AnalysisOutputPanel analysis={analysisOutput} formData={inputSnapshot} leadId={leadId} />
            : <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-8">No analysis available for this lead.</p>
          }
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
