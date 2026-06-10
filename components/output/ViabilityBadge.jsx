// ViabilityBadge.jsx — Bankable / Conditionally Bankable / Substandard badge
export default function ViabilityBadge({ classification }) {
  const map = {
    'Bankable': {
      bg:   'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-800 dark:text-emerald-300',
      dot:  'bg-emerald-500',
      ring: 'ring-emerald-500/30',
    },
    'Conditionally Bankable': {
      bg:   'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-800 dark:text-amber-300',
      dot:  'bg-amber-500',
      ring: 'ring-amber-500/30',
    },
    'Substandard': {
      bg:   'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-300',
      dot:  'bg-red-500',
      ring: 'ring-red-500/30',
    },
  };

  const style = map[classification] ?? map['Substandard'];

  return (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                      text-sm font-bold ring-1 ${style.bg} ${style.text} ${style.ring}`}>
      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
      {classification}
    </span>
  );
}
