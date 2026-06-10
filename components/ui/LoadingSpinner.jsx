// LoadingSpinner.jsx
export default function LoadingSpinner({ message = 'Analysing borrower profile…' }) {
  return (
    <div className="glass-panel rounded-2xl p-10 sm:p-14 flex flex-col items-center
                    justify-center gap-5 shadow-glass-md dark:shadow-glass-dark-md text-center">
      {/* Animated rings */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-900" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent
                        border-t-indigo-600 animate-spin" />
      </div>

      <div>
        <p className="text-sm font-bold text-slate-900 dark:text-white">{message}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Powered by Google Gemini · Usually takes 3–8 seconds
        </p>
      </div>

      {/* Shimmer placeholder bars */}
      <div className="w-full max-w-sm space-y-2 pt-2">
        {[80, 60, 72, 48].map((w, i) => (
          <div
            key={i}
            className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  );
}
