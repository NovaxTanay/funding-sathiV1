// pages/leads.jsx — Lead Registry page
import Head from 'next/head';
import { RefreshCcw } from 'lucide-react';
import Layout from '../components/layout/Layout';
import LeadListTable from '../components/leads/LeadListTable';
import LeadDetailModal from '../components/leads/LeadDetailModal';
import { useLeads } from '../hooks/useLeads';
import useAppStore from '../store/useAppStore';

export default function LeadsPage() {
  const { leads, changeStatus, refetch } = useLeads();
  const { selectedLead, setSelectedLead } = useAppStore();

  return (
    <>
      <Head>
        <title>FundingSathi — Lead Registry</title>
        <meta name="description" content="View and manage all credit assessment leads" />
      </Head>

      <Layout pageTitle="Lead Registry">
        {/* Page header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Lead Registry
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              All submitted assessments. Update pipeline status or view full details.
            </p>
          </div>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                       bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400
                       text-xs font-bold hover:bg-slate-200 dark:hover:bg-white/10
                       transition active:scale-95"
            aria-label="Refresh leads"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {/* Table */}
        <LeadListTable
          leads={leads}
          onView={lead => setSelectedLead(lead)}
          onStatusChange={changeStatus}
        />

        {/* Detail modal */}
        {selectedLead && (
          <LeadDetailModal
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
          />
        )}
      </Layout>
    </>
  );
}
