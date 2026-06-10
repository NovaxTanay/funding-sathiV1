// LenderRecommendationCard.jsx
import { Building2 } from 'lucide-react';

export default function LenderRecommendationCard({ lenderRecommendation }) {
  if (!lenderRecommendation) return null;
  const { primary, secondary, justification } = lenderRecommendation;

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-glass-sm space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
          <Building2 className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Lender Recommendation</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold
                         bg-indigo-100 dark:bg-indigo-900/30
                         text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/20">
          Primary: {primary}
        </span>
        {secondary && (
          <span className="px-3 py-1 rounded-full text-xs font-bold
                           bg-slate-100 dark:bg-white/5
                           text-slate-600 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-white/10">
            Fallback: {secondary}
          </span>
        )}
      </div>

      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {justification}
      </p>
    </div>
  );
}
