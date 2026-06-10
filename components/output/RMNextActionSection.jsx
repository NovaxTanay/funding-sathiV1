// RMNextActionSection.jsx
import { ArrowRight } from 'lucide-react';

export default function RMNextActionSection({ rmNextAction }) {
  if (!rmNextAction) return null;

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-glass-sm
                    border-l-4 border-indigo-500 space-y-2">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
          <ArrowRight className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Relationship Manager — Next Action
        </h3>
      </div>
      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300
                    leading-relaxed font-medium">
        {rmNextAction}
      </p>
    </div>
  );
}
