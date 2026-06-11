// AnalysisOutputPanel.jsx — assembles all 5 output sections
import ViabilityBadge from './ViabilityBadge';
import LenderRecommendationCard from './LenderRecommendationCard';
import RiskFlagsSection from './RiskFlagsSection';
import DocumentChecklistSection from './DocumentChecklistSection';
import RMNextActionSection from './RMNextActionSection';
import ExportToolbar from './ExportToolbar';

export default function AnalysisOutputPanel({ analysis, formData, leadId }) {
  console.log('[output] analysis prop:', analysis);
  if (!analysis) return null;
  const { 
    dealViability = {}, 
    lenderRecommendation = {}, 
    riskFlags = [], 
    documentChecklist = [], 
    rmNextAction = '' 
  } = analysis;

  return (
    <div className="space-y-4">
      {/* Section 1 — Viability Verdict */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-glass-md dark:shadow-glass-dark-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              Deal Viability
            </p>
            <ViabilityBadge classification={dealViability?.verdict} />
          </div>
          {leadId && (
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">
              {leadId}
            </span>
          )}
        </div>
        {dealViability?.rationale && (
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-white/40 dark:border-white/5 pt-3">
            {dealViability.rationale}
          </p>
        )}
      </div>

      {/* Section 2 — Lender Recommendation */}
      <LenderRecommendationCard lenderRecommendation={lenderRecommendation} />

      {/* Section 3 — Risk Flags */}
      <RiskFlagsSection riskFlags={riskFlags} />

      {/* Section 4 — Document Checklist */}
      <DocumentChecklistSection documentChecklist={documentChecklist} />

      {/* Section 5 — RM Next Action */}
      <RMNextActionSection rmNextAction={rmNextAction} />

      {/* Export toolbar */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-glass-sm">
        <ExportToolbar analysis={analysis} formData={formData} leadId={leadId} />
      </div>
    </div>
  );
}
