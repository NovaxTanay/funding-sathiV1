// StatusChip.jsx — lead pipeline status pill
const STATUS_MAP = {
  'New':                  { bg: 'bg-blue-100  dark:bg-blue-900/30',   text: 'text-blue-700  dark:text-blue-300'   },
  'Under Review':         { bg: 'bg-amber-100 dark:bg-amber-900/30',  text: 'text-amber-700 dark:text-amber-300'  },
  'Submitted to Lender':  { bg: 'bg-indigo-100 dark:bg-indigo-900/30',text: 'text-indigo-700 dark:text-indigo-300' },
  'Closed':               { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300' },
};

export default function StatusChip({ status }) {
  const style = STATUS_MAP[status] ?? STATUS_MAP['New'];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full
                      text-[10px] font-bold ${style.bg} ${style.text}`}>
      {status}
    </span>
  );
}
