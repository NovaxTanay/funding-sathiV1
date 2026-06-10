// EmptyState.jsx
import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No leads yet', body = 'Submit your first assessment to get started.' }) {
  return (
    <div className="glass-panel rounded-2xl p-10 sm:p-14 flex flex-col items-center
                    justify-center gap-4 text-center shadow-glass-md dark:shadow-glass-dark-md">
      <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-white/5
                      flex items-center justify-center">
        <Inbox className="w-7 h-7 text-slate-400 dark:text-slate-500" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">{body}</p>
      </div>
    </div>
  );
}
