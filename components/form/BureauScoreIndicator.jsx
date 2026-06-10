// BureauScoreIndicator.jsx — CIBIL range slider with live score badge
import { useMemo } from 'react';
import FormField from './FormField';

function getScoreMeta(score) {
  if (score <= 549) return { label: 'Poor',      cls: 'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400'    };
  if (score <= 649) return { label: 'Fair',      cls: 'bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-400'  };
  if (score <= 749) return { label: 'Good',      cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' };
  return             { label: 'Excellent', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' };
}

export default function BureauScoreIndicator({ score, onChange, error }) {
  const meta = useMemo(() => getScoreMeta(score), [score]);

  return (
    <FormField
      label="Approximate Promoter CIBIL / Bureau Score"
      required
      error={error}
      helper="Drag to your approximate score. Exact figure not required."
    >
      {/* Live badge */}
      <div className="flex items-center gap-3 mb-3 mt-1">
        <span className="text-2xl font-black text-slate-900 dark:text-white">{score}</span>
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${meta.cls}`}>
          {meta.label}
        </span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={300}
        max={900}
        step={10}
        value={score}
        onChange={e => onChange(Number(e.target.value))}
        aria-label="Approximate CIBIL score"
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
      />

      {/* Range labels */}
      <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1">
        <span>300</span>
        <span>900</span>
      </div>
    </FormField>
  );
}
