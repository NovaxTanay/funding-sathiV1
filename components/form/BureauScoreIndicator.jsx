// BureauScoreIndicator.jsx — CIBIL number input with dynamic band label
import FormField from './FormField';

export function getBureauBand(score) {
  const s = parseInt(score);
  if (!s || isNaN(s)) return "";
  if (s >= 750) return "🟢 Prime — PSU Bank eligible";
  if (s >= 720) return "🟡 Near Prime (High) — Private Bank eligible";
  if (s >= 700) return "🟡 Near Prime (Low) — NBFC eligible";
  if (s >= 680) return "🟠 Subprime — NBFC only";
  if (s >= 650) return "🔴 High Risk — Fintech only";
  return "🔴 Declined Band";
}

export default function BureauScoreIndicator({ score, onChange, error, required, helper }) {
  const band = getBureauBand(score);

  return (
    <FormField
      label="PROMOTER CIBIL SCORE"
      required={required}
      error={error}
      helper={helper}
    >
      <input
        type="number"
        min={300}
        max={900}
        value={score === '' || score === null || score === undefined ? '' : score}
        placeholder="e.g. 720"
        onChange={e => {
          const val = e.target.value === '' ? '' : Number(e.target.value);
          onChange(val);
        }}
        className="form-input"
      />
      {band && (
        <p className="text-xs font-semibold mt-1.5 transition-colors">
          {band}
        </p>
      )}
    </FormField>
  );
}
