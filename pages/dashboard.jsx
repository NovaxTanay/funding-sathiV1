// pages/dashboard.jsx — Dashboard overview page
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  FilePlus2, CheckCircle2, Clock, AlertCircle,
  TrendingUp, Eye, Play, ArrowRight,
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import StatusChip from '../components/ui/StatusChip';

import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';
import useAppStore from '../store/useAppStore';
import LeadDetailModal from '../components/leads/LeadDetailModal';

export default function DashboardPage() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [dark, setDark] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedLead, setSelectedLead } = useAppStore();

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  // 1. Setup real-time listener for leads collection
  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || null,
        };
      });
      setLeads(leadsData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore leads subscription error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Derive stat card values dynamically
  const completedCount = leads.filter(l => l.status === "Submitted to Lender" || l.status === "Closed").length;
  const incompleteCount = leads.filter(l => l.status === "Under Review").length;
  const toStartCount = leads.filter(l => l.status === "New").length;

  const statCards = [
    { label: 'New Form',    value: '+',   icon: FilePlus2,    color: 'from-indigo-600 to-violet-600',  href: '/form' },
    { label: 'Completed',   value: completedCount.toString(),  icon: CheckCircle2, color: 'from-emerald-500 to-teal-500',   href: '/leads' },
    { label: 'Incomplete',  value: incompleteCount.toString(),   icon: Clock,        color: 'from-amber-500 to-orange-500',   href: '/leads' },
    { label: 'To Start',    value: toStartCount.toString(),   icon: AlertCircle,  color: 'from-rose-500 to-pink-500',      href: '/form' },
  ];

  // 3. Derive pie chart data dynamically
  const bankableCount = leads.filter(l => 
    (l.analysisOutput?.viabilityVerdict?.classification || l.viabilityVerdict?.classification) === "Bankable"
  ).length;
  const conditionallyBankableCount = leads.filter(l => 
    (l.analysisOutput?.viabilityVerdict?.classification || l.viabilityVerdict?.classification) === "Conditionally Bankable"
  ).length;
  const substandardCount = leads.filter(l => 
    (l.analysisOutput?.viabilityVerdict?.classification || l.viabilityVerdict?.classification) === "Substandard"
  ).length;

  /* ── Chart.js (pie) ──────────────────────────────── */
  useEffect(() => {
    let isMounted = true;
    async function initChart() {
      const { Chart, ArcElement, Tooltip, Legend, PieController } = await import('chart.js');
      Chart.register(ArcElement, Tooltip, Legend, PieController);

      if (chartInstance.current) chartInstance.current.destroy();
      if (!chartRef.current || !isMounted) return;

      chartInstance.current = new Chart(chartRef.current, {
        type: 'pie',
        data: {
          labels: ['Bankable', 'Conditionally Bankable', 'Substandard'],
          datasets: [{
            data: [bankableCount, conditionallyBankableCount, substandardCount],
            backgroundColor: ['#16a34a', '#d97706', '#dc2626'],
            borderWidth: 0,
            hoverOffset: 6,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 16,
                font: { size: 11, weight: '600', family: 'DM Sans' },
                color: dark ? '#94a3b8' : '#64748b',
                usePointStyle: true,
                pointStyleWidth: 8,
              },
            },
          },
        },
      });
    }
    initChart();
    return () => { isMounted = false; if (chartInstance.current) chartInstance.current.destroy(); };
  }, [dark, bankableCount, conditionallyBankableCount, substandardCount]);

  // Helper function to format the date
  function formatDate(date) {
    if (!date) return '—';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  // 4. Recent activity rows — show latest 5 leads ordered by createdAt descending
  const recentActivity = leads.slice(0, 5);

  return (
    <>
      <Head>
        <title>FundingSathi — Dashboard</title>
        <meta name="description" content="Overview of credit assessment activity and pipeline metrics" />
      </Head>

      <Layout pageTitle="Dashboard">
        <div className="space-y-4">

          {/* ── Quick action cards ─────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {statCards.map(({ label, value, icon: Icon, color, href }) => (
              <Link key={label} href={href}
                className="glass-panel rounded-2xl p-4 sm:p-5 shadow-glass-sm dark:shadow-glass-dark-md
                           hover:shadow-lg transition-all duration-200 group cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${color} text-white shadow-md
                                  group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600
                                         group-hover:text-indigo-500 group-hover:translate-x-0.5
                                         transition-all" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{value}</p>
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">
                  {label}
                </p>
              </Link>
            ))}
          </div>

          {/* ── Chart + Activity row ───────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 md:gap-4">
            {/* Pie chart */}
            <div className="lg:col-span-2 glass-panel rounded-2xl p-5 sm:p-6 shadow-glass-md dark:shadow-glass-dark-md">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Form Completion Metrics</h3>
              </div>
              <div className="h-52 sm:h-56 relative">
                {leads.length === 0 && !loading ? (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                    No leads assessed yet
                  </div>
                ) : null}
                <canvas ref={chartRef} />
              </div>
            </div>

            {/* Recent Activity table */}
            <div className="lg:col-span-3 glass-panel rounded-2xl shadow-glass-md dark:shadow-glass-dark-md overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-white/40 dark:border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                <Link href="/leads" className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                  View All →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead>
                    <tr className="bg-white/30 dark:bg-slate-900/40 text-[10px] font-bold
                                   text-slate-500 dark:text-slate-400 uppercase tracking-wider
                                   border-b border-white/30 dark:border-white/5">
                      <th className="py-2.5 px-5">Lead ID</th>
                      <th className="py-2.5 px-5">Entity</th>
                      <th className="py-2.5 px-5">Loan</th>
                      <th className="py-2.5 px-5">Status</th>
                      <th className="py-2.5 px-5">Date</th>
                      <th className="py-2.5 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20 dark:divide-white/5">
                    {recentActivity.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                          {loading ? 'Loading leads...' : 'No activity yet'}
                        </td>
                      </tr>
                    ) : (
                      recentActivity.map(row => {
                        const entity = row.inputSnapshot?.entityType || row.entityType || '—';
                        const loan = row.inputSnapshot?.loanRequirement || row.inputSnapshot?.loanAmount || row.loanRequirement || row.loanAmount;
                        const loanText = loan ? `₹${loan} Cr` : '—';
                        
                        return (
                          <tr key={row.leadId || row.id} className="hover:bg-white/20 dark:hover:bg-slate-900/20 transition">
                            <td className="py-3 px-5 text-xs font-bold font-mono text-slate-900 dark:text-white">{row.leadId || row.id}</td>
                            <td className="py-3 px-5 text-xs text-slate-600 dark:text-slate-300">{entity}</td>
                            <td className="py-3 px-5 text-xs text-slate-600 dark:text-slate-300">{loanText}</td>
                            <td className="py-3 px-5"><StatusChip status={row.status} /></td>
                            <td className="py-3 px-5 text-xs text-slate-400 dark:text-slate-500">{formatDate(row.createdAt)}</td>
                            <td className="py-3 px-5 text-right">
                              {row.status === 'New' ? (
                                <Link href="/form" className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:underline">
                                  <Play className="w-3 h-3" />Start
                                </Link>
                              ) : row.status === 'Under Review' ? (
                                <Link href="/form" className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:underline">
                                  <Play className="w-3 h-3" />Resume
                                </Link>
                              ) : (
                                <button onClick={() => setSelectedLead(row)} className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:underline bg-transparent border-0 cursor-pointer p-0">
                                  <Eye className="w-3.5 h-3.5" />View
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

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
