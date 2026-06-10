// FormSubmitButton.jsx — Next / Back / Submit navigation row
import { Send } from 'lucide-react';

export default function FormSubmitButton({ step, totalSteps, onBack, onNext, onSubmit, loading }) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6
                    border-t border-white/40 dark:border-white/10">
      {/* Back */}
      {step > 1 ? (
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-800
                     dark:hover:text-white font-bold text-xs transition disabled:opacity-40"
        >
          ← Back
        </button>
      ) : (
        <span />
      )}

      {/* Next or Submit */}
      {step < totalSteps ? (
        <button
          type="button"
          onClick={onNext}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700
                     text-white font-bold text-xs uppercase tracking-wider shadow-md
                     active:scale-95 transition-all duration-200 disabled:opacity-50"
        >
          Next →
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl
                     bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs
                     uppercase tracking-wider shadow-md active:scale-95
                     transition-all duration-200 disabled:opacity-50"
        >
          {loading
            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Send className="w-3.5 h-3.5" />
          }
          {loading ? 'Submitting…' : 'Submit Assessment'}
        </button>
      )}
    </div>
  );
}
