// LeadRow.jsx — single row in leads table
import StatusChip from '../ui/StatusChip';
import { formatDate } from '../../utils/formatDate';
import { Eye } from 'lucide-react';

const STATUS_OPTIONS = ['New', 'Under Review', 'Submitted to Lender', 'Closed'];

export default function LeadRow({ lead, onView, onStatusChange }) {
  const { leadId, createdAt, status, inputSnapshot } = lead;

  return (
    <tr className="hover:bg-white/20 dark:hover:bg-slate-900/20 transition">
      <td className="py-3.5 px-5 text-slate-900 dark:text-white font-bold text-xs sm:text-sm font-mono">
        {leadId}
      </td>
      <td className="py-3.5 px-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
        {inputSnapshot?.entityType || '—'}
      </td>
      <td className="py-3.5 px-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
        ₹{inputSnapshot?.loanRequirement || '—'} Cr
      </td>
      <td className="py-3.5 px-5">
        <StatusChip status={status} />
      </td>
      <td className="py-3.5 px-5 text-xs text-slate-400 dark:text-slate-500">
        {createdAt ? formatDate(createdAt) : '—'}
      </td>
      <td className="py-3.5 px-5">
        <select
          value={status}
          onChange={e => onStatusChange(leadId, e.target.value)}
          className="text-xs bg-slate-100 dark:bg-white/5 border border-transparent
                     rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300
                     focus:outline-none focus:border-indigo-500 transition cursor-pointer"
          aria-label={`Change status for ${leadId}`}
        >
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </td>
      <td className="py-3.5 px-5 text-right">
        <button
          onClick={() => onView(lead)}
          className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400
                     hover:underline font-bold text-xs"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </button>
      </td>
    </tr>
  );
}
