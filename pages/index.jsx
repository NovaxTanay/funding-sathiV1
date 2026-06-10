// pages/index.jsx — Login & Sign Up page (no sidebar layout)
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signInWithGoogle } from '../lib/firebaseClient';
import { Eye, EyeOff } from 'lucide-react';

/* ── Inline Google "G" logo SVG ───────────────────── */
function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09A6.97 6.97 0 0 1 5.47 12c0-.72.13-1.43.37-2.09V7.07H2.18A11.02 11.02 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

/* ── OR divider ───────────────────────────────────── */
function OrDivider() {
  return (
    <div className="flex items-center gap-3 w-full max-w-xs my-4">
      <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        or
      </span>
      <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
    </div>
  );
}

/* ── Google button ────────────────────────────────── */
function GoogleSignInButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full max-w-xs py-3 rounded-full
                 border border-slate-200 dark:border-white/10
                 bg-white dark:bg-white/5
                 text-slate-700 dark:text-slate-300
                 text-xs font-bold uppercase tracking-wider
                 shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-white/10
                 active:scale-95 transition-all duration-200
                 inline-flex items-center justify-center gap-2.5
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <GoogleIcon className="w-4 h-4" />
      Continue with Google
    </button>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [dark, setDark] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('theme');
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
      setDark(true);
    }
  }, []);

  function handleSignIn(e) {
    e.preventDefault();
    router.push('/dashboard');
  }

  function handleSignUp(e) {
    e.preventDefault();
    router.push('/dashboard');
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err) {
      // Don't show error for user-cancelled popups
      if (err?.code !== 'auth/popup-closed-by-user') {
        setAuthError(err.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>FundingSathi — Sign In</title>
        <meta name="description" content="Sign in to FundingSathi AI Credit Assessment Tool" />
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

        {/* ── DESKTOP CARD ─────────────────────────────────── */}
        <div className="hidden md:block relative z-10 w-[850px] max-w-full min-h-[500px]
                        bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden
                        transition-all duration-500">

          {/* ─── Sign In Panel (left half, default visible) ─── */}
          <div
            className={`absolute top-0 left-0 h-full w-1/2
                        flex flex-col items-center justify-center px-10
                        transition-all duration-700 ease-in-out
                        ${isSignUp
                          ? 'translate-x-full opacity-0 pointer-events-none z-0'
                          : 'translate-x-0 opacity-100 pointer-events-auto z-20'
                        }`}
          >
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Welcome Back</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-8">Sign in to your FundingSathi account</p>

            <form onSubmit={handleSignIn} className="w-full max-w-xs space-y-4">
              <input type="email" placeholder="Email Address" required
                className="form-input w-full" />
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="form-input w-full pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-slate-500 hover:text-indigo-600 focus:outline-none focus:ring-0 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <Link href="/forgot-password" className="block text-right text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                Forgot Password?
              </Link>
              <button type="submit"
                className="w-full py-3 rounded-full bg-indigo-600 hover:bg-indigo-700
                           text-white text-xs font-bold uppercase tracking-wider shadow-lg
                           active:scale-95 transition-all duration-200">
                Sign In
              </button>
            </form>

            <OrDivider />
            <GoogleSignInButton onClick={handleGoogleSignIn} disabled={googleLoading} />

            {authError && (
              <p className="mt-3 text-[11px] text-red-500 dark:text-red-400 font-semibold text-center max-w-xs">
                {authError}
              </p>
            )}
          </div>

          {/* ─── Sign Up Panel (left half, hidden by default) ─── */}
          <div
            className={`absolute top-0 left-0 h-full w-1/2
                        flex flex-col items-center justify-center px-10
                        transition-all duration-700 ease-in-out
                        ${isSignUp
                          ? 'translate-x-full opacity-100 pointer-events-auto z-30'
                          : 'translate-x-0 opacity-0 pointer-events-none z-0'
                        }`}
          >
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Create Account</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-8">Join FundingSathi and start assessing</p>

            <form onSubmit={handleSignUp} className="w-full max-w-xs space-y-4">
              <input type="text" placeholder="Full Name" required
                className="form-input w-full" />
              <input type="email" placeholder="Email Address" required
                className="form-input w-full" />
              <div className="relative w-full">
                <input
                  type={showSignUpPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="form-input w-full pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-slate-500 hover:text-indigo-600 focus:outline-none focus:ring-0 transition-colors flex items-center p-0"
                  aria-label={showSignUpPassword ? "Hide password" : "Show password"}
                >
                  {showSignUpPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              <button type="submit"
                className="w-full py-3 rounded-full bg-indigo-600 hover:bg-indigo-700
                           text-white text-xs font-bold uppercase tracking-wider shadow-lg
                           active:scale-95 transition-all duration-200">
                Sign Up
              </button>
            </form>

            <OrDivider />
            <GoogleSignInButton onClick={handleGoogleSignIn} disabled={googleLoading} />

            {authError && (
              <p className="mt-3 text-[11px] text-red-500 dark:text-red-400 font-semibold text-center max-w-xs">
                {authError}
              </p>
            )}
          </div>

          {/* ─── Sliding Overlay Container (viewport mask) ─── */}
          <div
            className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden
                        transition-all duration-700 ease-in-out z-50
                        ${isSignUp
                          ? '-translate-x-full rounded-r-none rounded-l-2xl'
                          : 'translate-x-0 rounded-l-none rounded-r-2xl'
                        }`}
          >
            {/* Interior Purple Overlay (double-width counter-slide) */}
            <div
              className={`relative -left-full h-full w-[200%]
                          bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-600
                          text-white transition-all duration-700 ease-in-out
                          ${isSignUp ? 'translate-x-1/2' : 'translate-x-0'}`}
            >
              {/* ── Left overlay text (visible when isSignUp) ── */}
              <div
                className={`absolute top-0 left-0 flex flex-col items-center justify-center
                            h-full w-1/2 px-10 text-center
                            transition-all duration-700 ease-in-out
                            ${isSignUp ? 'translate-x-0 opacity-100' : '-translate-x-[20%] opacity-0'}`}
              >
                <div className="flex items-center gap-2 text-2xl font-black mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  FundingSathi
                </div>
                <p className="text-sm text-white/80 max-w-[240px] leading-relaxed mb-4">
                  Already have an account? Sign in to access your credit assessments.
                </p>
                <button
                  onClick={() => setIsSignUp(false)}
                  className="mt-2 px-8 py-2.5 border-2 border-white text-white rounded-full
                             text-xs font-bold uppercase tracking-wider
                             hover:bg-white hover:text-indigo-700 transition-all duration-300"
                >
                  Sign In
                </button>
              </div>

              {/* ── Right overlay text (visible when !isSignUp) ── */}
              <div
                className={`absolute top-0 right-0 flex flex-col items-center justify-center
                            h-full w-1/2 px-10 text-center
                            transition-all duration-700 ease-in-out
                            ${isSignUp ? 'translate-x-[20%] opacity-0' : 'translate-x-0 opacity-100'}`}
              >
                <div className="flex items-center gap-2 text-2xl font-black mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  FundingSathi
                </div>
                <p className="text-sm text-white/80 max-w-[240px] leading-relaxed mb-4">
                  Don&apos;t have an account? Sign up and start your AI-powered credit screening journey.
                </p>
                <button
                  onClick={() => setIsSignUp(true)}
                  className="mt-2 px-8 py-2.5 border-2 border-white text-white rounded-full
                             text-xs font-bold uppercase tracking-wider
                             hover:bg-white hover:text-indigo-700 transition-all duration-300"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBILE: Stacked forms ───────────────────────── */}
        <div className="block md:hidden relative z-10 w-full max-w-md
                        bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
          {!isSignUp ? (
            <div className="flex flex-col items-center justify-center px-8 py-12">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Welcome Back</h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Sign in to your FundingSathi account</p>
              <form onSubmit={handleSignIn} className="w-full max-w-xs space-y-4">
                <input type="email" placeholder="Email Address" required className="form-input w-full" />
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    className="form-input w-full pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-slate-500 hover:text-indigo-600 focus:outline-none focus:ring-0 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <Link href="/forgot-password" className="block text-right text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                  Forgot Password?
                </Link>
                <button type="submit"
                  className="w-full py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg active:scale-95 transition-all">
                  Sign In
                </button>
              </form>

              <OrDivider />
              <GoogleSignInButton onClick={handleGoogleSignIn} disabled={googleLoading} />

              {authError && (
                <p className="mt-3 text-[11px] text-red-500 dark:text-red-400 font-semibold text-center max-w-xs">
                  {authError}
                </p>
              )}

              <p className="mt-6 text-xs text-slate-400">
                Don&apos;t have an account?{' '}
                <button onClick={() => setIsSignUp(true)} className="text-indigo-600 dark:text-indigo-400 font-bold">Sign Up</button>
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-8 py-12">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Create Account</h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Join FundingSathi</p>
              <form onSubmit={handleSignUp} className="w-full max-w-xs space-y-4">
                <input type="text" placeholder="Full Name" required className="form-input w-full" />
                <input type="email" placeholder="Email Address" required className="form-input w-full" />
                <div className="relative w-full">
                  <input
                    type={showSignUpPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    className="form-input w-full pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-slate-500 hover:text-indigo-600 focus:outline-none focus:ring-0 transition-colors flex items-center p-0"
                    aria-label={showSignUpPassword ? "Hide password" : "Show password"}
                  >
                    {showSignUpPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                <button type="submit"
                  className="w-full py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg active:scale-95 transition-all">
                  Sign Up
                </button>
              </form>

              <OrDivider />
              <GoogleSignInButton onClick={handleGoogleSignIn} disabled={googleLoading} />

              {authError && (
                <p className="mt-3 text-[11px] text-red-500 dark:text-red-400 font-semibold text-center max-w-xs">
                  {authError}
                </p>
              )}

              <p className="mt-6 text-xs text-slate-400">
                Already have an account?{' '}
                <button onClick={() => setIsSignUp(false)} className="text-indigo-600 dark:text-indigo-400 font-bold">Sign In</button>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
