// ErrorAlert.jsx
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function ErrorAlert({ message, onRetry }) {
  return (
    <div className="glass-panel rounded-2xl p-6 shadow-glass-sm
                    border border-red-500/20 space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Analysis Failed</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {message || 'An unexpected error occurred. Please try again.'}
          </p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                     bg-red-600 hover:bg-red-700 text-white text-xs font-bold
                     uppercase tracking-wider shadow-sm active:scale-95 transition"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Try Again
        </button>
      )}
    </div>
  );
}
