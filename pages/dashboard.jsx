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

/* ── Quick Action Cards ──────────────────────────── */
const CARDS = [
  { label: 'New Form',    value: '+',   icon: FilePlus2,    color: 'from-indigo-600 to-violet-600',  href: '/form' },
  { label: 'Completed',   value: '24',  icon: CheckCircle2, color: 'from-emerald-500 to-teal-500',   href: '/leads' },
  { label: 'Incomplete',  value: '7',   icon: Clock,        color: 'from-amber-500 to-orange-500',   href: '/leads' },
  { label: 'To Start',    value: '3',   icon: AlertCircle,  color: 'from-rose-500 to-pink-500',      href: '/form' },
];

/* ── Recent activity rows ────────────────────────── */
const ACTIVITY = [
  { id: 'FS-2026-0042', entity: 'Manufacturer', loan: '₹5 Cr',  status: 'Submitted to Lender', date: '08 Jun 2026' },
  { id: 'FS-2026-0041', entity: 'Trader',       loan: '₹2.5 Cr', status: 'Under Review',        date: '07 Jun 2026' },
  { id: 'FS-2026-0040', entity: 'Service Provider', loan: '₹1 Cr', status: 'New',               date: '06 Jun 2026' },
];

export default function DashboardPage() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

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
            data: [14, 7, 3],
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
  }, [dark]);

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
            {CARDS.map(({ label, value, icon: Icon, color, href }) => (
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
              <div className="h-52 sm:h-56">
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
                    {ACTIVITY.map(row => (
                      <tr key={row.id} className="hover:bg-white/20 dark:hover:bg-slate-900/20 transition">
                        <td className="py-3 px-5 text-xs font-bold font-mono text-slate-900 dark:text-white">{row.id}</td>
                        <td className="py-3 px-5 text-xs text-slate-600 dark:text-slate-300">{row.entity}</td>
                        <td className="py-3 px-5 text-xs text-slate-600 dark:text-slate-300">{row.loan}</td>
                        <td className="py-3 px-5"><StatusChip status={row.status} /></td>
                        <td className="py-3 px-5 text-xs text-slate-400 dark:text-slate-500">{row.date}</td>
                        <td className="py-3 px-5 text-right">
                          <Link href="/form"
                            className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:underline">
                            {row.status === 'New' ? <><Play className="w-3 h-3" />Start</> :
                             row.status === 'Under Review' ? <><Play className="w-3 h-3" />Resume</> :
                             <><Eye className="w-3 h-3" />View</>}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </Layout>
    </>
  );
}
