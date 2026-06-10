// RiskFlagsSection.jsx
import { AlertTriangle } from 'lucide-react';

export default function RiskFlagsSection({ riskFlags = [] }) {
  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-glass-sm space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Risk Flags</h3>
      </div>
      <ol className="space-y-2">
        {riskFlags.map((flag, i) => (
          <li key={i} className="flex gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <span className="shrink-0 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30
                             text-amber-700 dark:text-amber-400 flex items-center justify-center
                             text-[10px] font-black mt-0.5">
              {i + 1}
            </span>
            <span className="leading-relaxed">{flag}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
