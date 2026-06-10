// pages/forgot-password.jsx — Forgot Password page (no sidebar layout)
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('theme');
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
      setDark(true);
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: wire up actual password reset (e.g. Firebase Auth sendPasswordResetEmail)
    setSubmitted(true);
  }

  return (
    <>
      <Head>
        <title>FundingSathi — Forgot Password</title>
        <meta name="description" content="Reset your FundingSathi account password" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans antialiased
                      flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[15%] w-[60vw] h-[60vw] rounded-full
                          bg-gradient-to-tr from-indigo-400/30 dark:from-indigo-950/40
                          to-purple-400/20 dark:to-purple-900/30 blur-[100px]" />
          <div className="absolute bottom-[10%] -right-[15%] w-[50vw] h-[50vw] rounded-full
                          bg-gradient-to-br from-emerald-400/20 dark:from-emerald-950/20
                          to-teal-400/20 dark:to-teal-900/15 blur-[120px]" />
        </div>

        {/* Card */}
        <div className="relative z-10 w-full max-w-md glass-panel rounded-2xl shadow-2xl overflow-hidden">
          {/* Purple header bar */}
          <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600
                          px-8 py-10 text-center text-white">
            <div className="flex items-center justify-center gap-2 text-2xl font-black mb-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              FundingSathi
            </div>
            <p className="text-sm text-white/80">Reset your password</p>
          </div>

          {/* Form body */}
          <div className="px-8 py-10">
            {!submitted ? (
              <>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
                  Forgot Password?
                </h1>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-8 leading-relaxed">
                  Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input w-full"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-indigo-600 hover:bg-indigo-700
                               text-white text-xs font-bold uppercase tracking-wider shadow-lg
                               active:scale-95 transition-all duration-200"
                  >
                    Send Reset Link
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                {/* Success checkmark */}
                <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30
                                flex items-center justify-center mb-5">
                  <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                  Check Your Inbox
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed mb-2">
                  We&apos;ve sent a password reset link to
                </p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-6">
                  {email}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
                  Didn&apos;t receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                  >
                    try again
                  </button>.
                </p>
              </div>
            )}

            {/* Back to login */}
            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500
                           hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
