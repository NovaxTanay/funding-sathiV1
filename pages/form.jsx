// pages/form.jsx — Borrower Intake Form + Analysis Output
import Head from 'next/head';
import { CheckCircle2 } from 'lucide-react';
import Layout from '../components/layout/Layout';
import BorrowerInputForm from '../components/form/BorrowerInputForm';
import AnalysisOutputPanel from '../components/output/AnalysisOutputPanel';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import { useAnalysis } from '../hooks/useAnalysis';
import useAppStore from '../store/useAppStore';

export default function FormPage() {
  const { analysis, formData, leadId, isLoading, error, clearResult } = useAppStore();
  const { runAnalysis } = useAnalysis();

  return (
    <>
      <Head>
        <title>FundingSathi — Credit Assessment Form</title>
        <meta name="description" content="AI-powered first-pass credit evaluation for MSME borrowers" />
      </Head>

      <Layout pageTitle="Credit Assessment">
        <div className="h-full flex flex-col lg:flex-row gap-4">

          {/* ── LEFT: Borrower form ──────────────────── */}
          <div className="w-full lg:w-[45%] xl:w-[42%] shrink-0">
            <div className="mb-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Borrower Intake Form
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Enter the borrower's financial details for AI credit screening.
              </p>
            </div>

            <BorrowerInputForm
              onSubmit={runAnalysis}
              loading={isLoading}
            />
          </div>

          {/* ── RIGHT: Analysis output ───────────────── */}
          <div className="flex-1 min-w-0">
            {/* Empty / waiting state */}
            {!isLoading && !analysis && !error && (
              <div className="glass-panel rounded-2xl p-10 sm:p-14 h-full flex flex-col
                              items-center justify-center text-center gap-5
                              shadow-glass-md dark:shadow-glass-dark-md">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-indigo-400 dark:text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    AI Analysis Output
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
                    Complete the borrower form and click&nbsp;
                    <strong>Submit Assessment</strong>. The Gemini-powered
                    credit evaluation will appear here instantly.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {[
                    'Deal Viability Verdict',
                    'Lender Recommendation',
                    'Risk Flags',
                    'Document Checklist',
                    'RM Next Action',
                    'PDF Export',
                  ].map(f => (
                    <span key={f}
                      className="px-3 py-1 rounded-full text-[10px] font-bold
                                 bg-slate-100 dark:bg-white/5
                                 text-slate-500 dark:text-slate-400">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {isLoading && <LoadingSpinner />}

            {!isLoading && error && (
              <ErrorAlert message={error} onRetry={clearResult} />
            )}

            {!isLoading && analysis && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      Credit Assessment
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      Lead ID: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{leadId}</span>
                    </p>
                  </div>
                  <button
                    onClick={clearResult}
                    className="text-xs font-bold text-slate-400 dark:text-slate-500
                               hover:text-slate-700 dark:hover:text-slate-200 transition"
                  >
                    ← New Assessment
                  </button>
                </div>
                <AnalysisOutputPanel
                  analysis={analysis}
                  formData={formData}
                  leadId={leadId}
                />
              </>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
