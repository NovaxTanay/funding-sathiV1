// LeadListTable.jsx — full leads registry table
import LeadRow from './LeadRow';
import EmptyState from '../ui/EmptyState';

const HEADERS = ['Lead ID', 'Entity', 'Loan Req.', 'Status', 'Created', 'Update Status', ''];

export default function LeadListTable({ leads = [], onView, onStatusChange }) {
  if (leads.length === 0) {
    return <EmptyState title="No leads yet" body="Submit an assessment to create your first lead." />;
  }

  return (
    <div className="glass-panel rounded-2xl shadow-glass-md dark:shadow-glass-dark-md overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-white/40 dark:border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Lead Registry</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{leads.length} lead{leads.length !== 1 ? 's' : ''} total</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-white/30 dark:bg-slate-900/40 text-[11px] font-bold
                           text-slate-500 dark:text-slate-400 uppercase tracking-wider
                           border-b border-white/30 dark:border-white/5">
              {HEADERS.map(h => (
                <th key={h} className="py-3 px-5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20 dark:divide-white/5">
            {leads.map(lead => (
              <LeadRow
                key={lead.leadId}
                lead={lead}
                onView={onView}
                onStatusChange={onStatusChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
